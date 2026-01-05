const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3001; // Frontend is 5173

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('./email');

const JWT_SECRET = 'your-secret-key-123'; // In production, use env var

// --- AUTH ROUTES ---

// REGISTER
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user exists
        const check = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (check) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User
        const insert = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const info = insert.run(name, email, hashedPassword);

        // Send Welcome Email (Non-blocking)
        sendWelcomeEmail(email, name).then(url => {
            console.log(`Email sent to ${email} (Preview: ${url})`);
        });

        res.json({ success: true, message: 'Registration successful', userId: info.lastInsertRowid });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: error.message });
    }
});

// LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Create Token
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- DOCUMENT ROUTES ---

// GET All Documents
app.get('/api/documents', (req, res) => {
    try {
        const stmt = db.prepare('SELECT id, type, customer, date, status, updated_at FROM documents ORDER BY updated_at DESC');
        const documents = stmt.all();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Single Document
app.get('/api/documents/:id', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM documents WHERE id = ?');
        const doc = stmt.get(req.params.id);
        if (doc) {
            // Parse JSON string back to object
            doc.data = JSON.parse(doc.data);
            res.json(doc);
        } else {
            res.status(404).json({ error: 'Document not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SAVE (Upsert) Document
app.post('/api/documents', (req, res) => {
    const { id, type, customer, date, status, data } = req.body;

    try {
        const stmt = db.prepare(`
            INSERT INTO documents (id, type, customer, date, status, data, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
                type = excluded.type,
                customer = excluded.customer,
                date = excluded.date,
                status = excluded.status,
                data = excluded.data,
                updated_at = CURRENT_TIMESTAMP
        `);

        stmt.run(id, type, customer, date, status, JSON.stringify(data));
        res.json({ success: true, message: 'Document saved successfully' });
    } catch (error) {
        console.error("Save error:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- SINGLE WINDOW PROXY (Test Environment) ---
app.post('/api/proxy/single-window/submit', async (req, res) => {
    const { token, payload } = req.body;

    if (!token || !payload) {
        return res.status(400).json({ error: 'Missing token or payload' });
    }

    const TARGET_URL = 'https://test-ogi.singlewindow.io/api/v2-0/direct-export-jobs/document';

    try {
        console.log(`[Proxy] Forwarding to ${TARGET_URL}`);

        // Using Node.js native fetch (Node 18+)
        const response = await fetch(TARGET_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Get text first to handle both JSON and non-JSON errors
        const responseText = await response.text();
        let responseData;

        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            responseData = { message: responseText };
        }

        if (!response.ok) {
            console.error(`[Proxy] Upstream Error: ${response.status} - ${responseText}`);
            return res.status(response.status).json({
                error: `Upstream Error: ${response.status}`,
                details: responseData
            });
        }

        res.json(responseData);

    } catch (error) {
        console.error("[Proxy] Request Failed:", error);
        res.status(500).json({ error: 'Proxy Request Failed', details: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

# FRD Spedition - Ceisa Web Application

A modern web application for managing customs documents, integrating with the Single Window API, and featuring AI-powered OCR for automatic data extraction from invoices.

## 🚀 Features

- **Document Management**: Create, edit, and track PEB (Pemberitahuan Ekspor Barang) documents.
- **AI OCR Integration**: Automatically extract data from PDF/Image invoices using Tesseract.js.
- **Single Window API Proxy**: Securely forward validated document data to the Single Window API.
- **Autosave & Local Drafts**: Never lose your progress with localStorage backups and automatic database syncing.
- **Smart Validation**: Real-time validation for customs-specific fields (HS Codes, NPWP, etc.).

## 🛠 Technology Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **Lucide React** for premium iconography
- **React Router 7** for navigation

### Backend
- **Node.js** with **Express**
- **Better-SQLite3** for high-performance data storage
- **JWT & Bcryptjs** for secure authentication
- **Nodemailer** for automated communication

## 📦 Getting Started

### Prerequisites
- Node.js (v20.19+ or v22.12+)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/faridgo/web.ceisa.git
   cd web.ceisa
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running the Application

You need to run both the frontend and the backend servers.

1. **Start the Backend Server**:
   ```bash
   cd server
   npm start
   ```
   The server will run on [http://localhost:3001](http://localhost:3001).

2. **Start the Frontend Development Server**:
   ```bash
   # In a new terminal
   npm run dev
   ```
   The application will be accessible at [http://localhost:5173](http://localhost:5173).

## 📂 Project Structure

```
ceisa-app/
├── server/             # Express Backend
│   ├── db.js          # SQLite Database configuration
│   ├── index.js       # Main API entry point
│   └── email.js       # Email notification service
├── src/                # React Frontend
│   ├── components/    # Reusable UI components
│   ├── layouts/       # Page layouts (Dashboard, Guest)
│   ├── lib/           # Utility functions (OCR, API, Validation)
│   └── pages/         # Application pages
├── public/             # Static assets
└── package.json        # Project dependencies and scripts
```

## 🔐 Environment Variables

Create a `.env` file in the root directory for any environment-specific configurations (e.g., API keys, secrets). Note that `.env` files are ignored by git for security.

## 📝 License

This project is private and intended for use by FRD Spedition.

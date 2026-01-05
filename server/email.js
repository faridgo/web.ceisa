const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
// For DEMO purposes, we use Ethereal.email (auto-generated test account)
// In production, user would swap this with Gmail credentials.
let transporter;

async function initEmail() {
    try {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        console.log("Email Service Initialized with Ethereal Test Account");
        console.log("Preview URL will be logged for every email sent.");
    } catch (error) {
        console.error("Failed to init email service:", error);
    }
}

initEmail();

async function sendWelcomeEmail(toEmail, userName) {
    if (!transporter) {
        console.log("Email Transporter not ready yet.");
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: '"FRD Spedition" <no-reply@frdspedition.com>', // sender address
            to: toEmail, // list of receivers
            subject: "Welcome to FRD Spedition! 🚀", // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1>Welcome, ${userName}!</h1>
                    <p>Thank you for registering with <b>FRD Spedition</b>.</p>
                    <p>You can now:</p>
                    <ul>
                        <li>Manage your Export (PEB) Documents</li>
                        <li>Use our AI OCR for quick data entry</li>
                        <li>Save drafts locally and securely</li>
                    </ul>
                    <p>Click below to login:</p>
                    <a href="http://localhost:5173/login" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Dashboard</a>
                    <br><br>
                    <p>Best Regards,<br>FRD Spedition Team</p>
                </div>
            `, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return nodemailer.getTestMessageUrl(info);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = { sendWelcomeEmail };

import transporter from '../config/mail.js';

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 * @returns {Promise<Object>} - Nodemailer info object
 */
export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

/**
 * Get password reset email template
 * @param {string} resetLink - The password reset link
 * @returns {string} - HTML content
 */
export const getPasswordResetTemplate = (resetLink) => {
    return `
        <p>You requested a password reset.</p>
        <p>Click this link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link is valid for 1 hour.</p>
    `;
};

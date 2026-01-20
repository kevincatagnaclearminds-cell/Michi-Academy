import nodemailer from 'nodemailer';
import { env } from '../../config/env';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
    }
});

export const sendRecoveryEmail = async (
    email: string,
    token: string,
    level: string
) => {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    const mailOption = {
        from: `"Financial Education" <${env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset your password',
        html: `
            <h1>Hello Student</h1>
            <p>You have requested to reset your password for the <strong>${level}</strong> level.</p>
            <p>Click on the following link to continue:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                Reset Password
            </a>
            <p>This link will expire in 1 hour.</p>
        `
    };
    
    return transporter.sendMail(mailOption);
}
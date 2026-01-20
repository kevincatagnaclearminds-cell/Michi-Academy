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
    // URL base unificada para recuperación de contraseña
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    const mailOption = {
        from: `"Educación Financiera " <${env.EMAIL_USER}>`,
        to: email,
        subject: 'Recupera tu contraseña',
        html: `
            <h1>Hola Estudiante</h1>
            <p>Has solicitado restablecer tu contraseña para el nivel de <strong>${level}</strong>.</p>
            <p>Haz clic en el siguiente enlace para continuar:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                Restablecer Contraseña
            </a>
            <p>Este enlace expirará en 1 hora.</p>
        `
    };
    
    return transporter.sendMail(mailOption);
}
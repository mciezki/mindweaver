import nodemailer from 'nodemailer'
import { getMessage } from '../locales'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendActivationEmail = async (email: string, token: string, userName: string) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'no-reply@mindweave.com',
        to: email,
        subject: getMessage('emails.activation.subject'),
        html: `<h1>Witaj, ${userName}!</h1>
                <p>Dziękujemy za rejestrację w MindWeave. Aby aktywować swoje konto, użyj poniższego kodu:</p>
                <h2>${token}</h2>
                <p>Ten kod jest ważny przez ograniczony czas (np. 15 minut). Wprowadź go w aplikacji, aby zakończyć aktywację.</p>
                <p>Jeśli nie rejestrowałeś się w MindWeave, zignoruj tę wiadomość.</p>
                <p>Z poważaniem,<br/>Zespół MindWeave</p>
    `,
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Activation email with token sent to ${email}`);

    } catch (error) {
        console.error(`Error sending activation email to ${email}:`, error);
        throw new Error(getMessage('common.serverError'));
    }
}
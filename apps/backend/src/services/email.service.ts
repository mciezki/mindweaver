import nodemailer from 'nodemailer';

import { getMessage } from '../locales';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '1025'),
  secure: process.env.EMAIL_PORT === '465',
});

export const sendActivationEmail = async (
  email: string,
  token: string,
  userName: string,
) => {
  console.log(getMessage('emails.activation.subject'));
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@mindweave.com',
    to: email,
    subject: getMessage('auth.emails.activation.subject'),
    html: `<h1>Witaj, ${userName}!</h1>
                <p>Dziękujemy za rejestrację w MindWeave. Aby aktywować swoje konto, użyj poniższego kodu:</p>
                <h2>${token}</h2>
                <p>Ten kod jest ważny przez ograniczony czas (24 godziny). Wprowadź go w aplikacji, aby zakończyć aktywację.</p>
                <p>Jeśli nie rejestrowałeś się w MindWeave, zignoruj tę wiadomość.</p>
                <p>Z poważaniem,<br/>Zespół MindWeave</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Activation email with token sent to ${email}`);
  } catch (error) {
    console.error(`Error sending activation email to ${email}:`, error);
    throw new Error(getMessage('common.serverError'));
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@mindweave.com',
    to: email,
    subject: getMessage('auth.emails.resetPassword.subject'),
    html: `<h1>Witaj!</h1>
                <p>Widzimy, że zaginęło Twoje hasło. Aby je zresetować kliknij w poniższy link:</p>
                <h2>${token}</h2>
                <p>Ten kod jest ważny przez ograniczony czas (24 godziny). Wprowadź go w aplikacji, aby zakończyć aktywację.</p>
                <p>Jeśli nie resetowałeś/aś hasła w MindWeave, zignoruj tę wiadomość.</p>
                <p>Z poważaniem,<br/>Zespół MindWeave</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reset password email with token sent to ${email}`);
  } catch (error) {
    console.error(`Error sending reset password email to ${email}:`, error);
    throw new Error(getMessage('common.serverError'));
  }
};

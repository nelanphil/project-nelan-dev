import nodemailer from 'nodemailer';
import { EmailSettingsModel } from '../models/EmailSettings';
import { decryptSecret } from './encryption';

export async function getEmailSettingsDoc() {
  return EmailSettingsModel.findOne().sort({ updatedAt: -1 });
}

export async function isEmailConfigured(): Promise<boolean> {
  const settings = await getEmailSettingsDoc();
  return Boolean(settings?.passwordEncrypted && settings.username && settings.fromAddress);
}

async function createTransport() {
  const settings = await getEmailSettingsDoc();

  if (!settings) {
    throw new Error('Email settings are not configured');
  }

  const password = decryptSecret(settings.passwordEncrypted);

  return {
    settings,
    transporter: nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      auth: {
        user: settings.username,
        pass: password,
      },
    }),
  };
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const { settings, transporter } = await createTransport();

  await transporter.sendMail({
    from: settings.fromAddress,
    to,
    subject: 'Password reset code — nelan.dev',
    text: [
      'You requested a password reset for your nelan.dev account.',
      '',
      `Your reset code is: ${token}`,
      '',
      'Enter this code on the Client Portal to continue. It expires in 1 hour.',
      '',
      'If you did not request this, you can ignore this email.',
    ].join('\n'),
    html: `
      <p>You requested a password reset for your <strong>nelan.dev</strong> account.</p>
      <p>Your reset code is:</p>
      <p style="font-size:24px;font-weight:700;letter-spacing:0.08em;">${token}</p>
      <p>Enter this code on the Client Portal to continue. It expires in 1 hour.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
}

export async function sendTestEmail(to: string) {
  const { settings, transporter } = await createTransport();

  await transporter.sendMail({
    from: settings.fromAddress,
    to,
    subject: 'Test email — nelan.dev Control Panel',
    text: 'This is a test email from the nelan.dev Control Panel. SMTP is configured correctly.',
    html: '<p>This is a test email from the <strong>nelan.dev</strong> Control Panel. SMTP is configured correctly.</p>',
  });
}

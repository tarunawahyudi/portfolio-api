import fs from 'fs/promises'
import path from 'path'
import nodemailer from 'nodemailer'
import { injectable } from 'tsyringe'
import config from '@core/config'
import { logger } from '@shared/util/logger.util'

interface ContactEmailPayload {
  to: string;
  profileOwnerName: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
}

@injectable()
export class EmailService {
  private transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  private async loadTemplate(
    templateName: string,
    replacements: Record<string, string>,
  ): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      'resources',
      'templates',
      'email',
      `${templateName}.html`,
    )
    let content = await fs.readFile(templatePath, 'utf-8')
    for (const [key, value] of Object.entries(replacements)) {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }

    return content
  }

  async sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    const html = await this.loadTemplate('email-verification', {
      VERIFY_URL: verifyUrl,
      YEAR: new Date().getFullYear().toString(),
    })

    await this.transporter.sendMail({
      from: `"${config.app.name}" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Verify your email address',
      html,
    })
  }

  async sendContactFormEmail(payload: ContactEmailPayload): Promise<void> {
    const { to, profileOwnerName, fromName, fromEmail, subject, message } = payload

    const html = await this.loadTemplate('contact-notification', {
      profileOwnerName,
      fromName,
      fromEmail,
      subject,
      message,
      YEAR: new Date().getFullYear().toString(),
      appName: config.app.name,
    })

    logger.info(`[EmailService] Sending contact form email to: ${to}`)
    await this.transporter.sendMail({
      from: `"${config.app.name} Contact Form" <${process.env.SMTP_USER}>`,
      to: to,
      subject: `Pesan Baru dari Portfolio: ${subject}`,
      html,
      replyTo: fromEmail,
    })
  }

  async sendPasswordResetEmail(
    recipientEmail: string,
    recipientName: string,
    resetUrl: string,
  ): Promise<void> {
    const html = await this.loadTemplate('reset-password', {
      RECIPIENT_NAME: recipientName,
      RESET_URL: resetUrl,
      YEAR: new Date().getFullYear().toString(),
    })

    logger.info(`[EmailService] Sending password reset email to: ${recipientEmail}`)
    await this.transporter.sendMail({
      from: `"${config.app.name}" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: 'Your Password Reset Link',
      html,
    })
  }
}

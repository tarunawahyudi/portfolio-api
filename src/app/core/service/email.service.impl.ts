import fs from 'fs/promises'
import path from 'path'
import nodemailer from 'nodemailer'
import { EmailService } from '@core/service/email.service'
import { injectable } from 'tsyringe'
import config from '@core/config'

@injectable()
export class EmailServiceImpl implements EmailService {
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
    const html = await this.loadTemplate('email_verification', {
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
}

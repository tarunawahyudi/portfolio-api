export interface EmailService {
  sendVerificationEmail(to: string, url: string): Promise<void>;
  sendPasswordResetEmail(recipientEmail: string, recipientName: string, resetUrl: string): Promise<void>
}

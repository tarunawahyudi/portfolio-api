export interface EmailService {
  sendVerificationEmail(to: string, url: string): Promise<void>;
}

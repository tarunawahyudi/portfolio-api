export interface AuthService {
  verifyEmail(rawToken: string, userId: number): Promise<{ message: string }>;
}

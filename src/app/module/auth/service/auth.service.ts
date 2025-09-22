import { ForgotPasswordRequest, LoginRequest, LoginResponse } from '@module/auth/dto/auth.dto'

export interface AuthService {
  signIn(data: LoginRequest): Promise<LoginResponse>
  verifyEmail(rawToken: string, userId: string): Promise<{ message: string }>
  refreshToken(token: string): Promise<{ accessToken: string }>
  signOut(userId: string): Promise<{ message: string }>
  requestPasswordReset(request: ForgotPasswordRequest, clientIp?: string): Promise<void>
  resetPassword(token: string, newPassword: string): Promise<void>
}

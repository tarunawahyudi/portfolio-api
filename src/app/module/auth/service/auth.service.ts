import { LoginRequest, LoginResponse } from '@module/auth/dto/auth.dto'

export interface AuthService {
  signIn(data: LoginRequest): Promise<LoginResponse>
  verifyEmail(rawToken: string, userId: number): Promise<{ message: string }>
  refreshToken(token: string): Promise<{ accessToken: string }>
  signOut(userId: number): Promise<{ message: string }>
}

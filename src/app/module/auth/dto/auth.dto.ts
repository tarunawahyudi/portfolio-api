export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

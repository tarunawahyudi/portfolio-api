export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  captchaToken: string;
  ipAddress?: string;
  userAgent?: string;
  browser?: string;
  cpu?: string;
  device?: string;
  os?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
  captchaToken: string;
}

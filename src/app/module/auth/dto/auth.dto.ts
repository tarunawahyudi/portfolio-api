export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
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

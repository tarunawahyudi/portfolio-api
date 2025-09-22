export interface CreateUserRequest {
  name: string;
  email: string;
  username: string;
  password: string;
  captchaToken: string;
}

export interface UserSignupResponse {
  id: string;
  email: string;
  name: string;
  username: string;
  status: string;
}

export interface ShowUserResponse {
  id: string;
  username: string;
  name: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface UserSignupResponse {
  id: number;
  email: string;
  name: string;
  username: string;
  status: string;
}

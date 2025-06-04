export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: string;
  message?: string;
}

export interface LoginError {
  error: string;
  message?: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  data: string;
  message?: string;
}

export interface SignupError {
  error: string;
  message?: string;
}

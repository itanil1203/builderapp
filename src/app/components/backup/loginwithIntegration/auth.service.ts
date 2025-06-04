import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { delay, map } from "rxjs/operators";
import { LoginFormData, LoginResponse, ApiError } from "./login.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_BASE_URL = "https://api.example.com";

  constructor() {}

  login(credentials: LoginFormData): Observable<LoginResponse> {
    // Simulate API call with delay
    // In real implementation, use HttpClient to make actual API calls
    return of(credentials).pipe(
      delay(1000),
      map((creds) => {
        // Mock validation
        if (
          creds.email === "user@example.com" &&
          creds.password === "password"
        ) {
          return {
            success: true,
            token: "mock-jwt-token",
            message: "Login successful",
          };
        } else {
          throw new Error("Invalid credentials");
        }
      }),
    );
  }

  forgotPassword(
    email: string,
  ): Observable<{ success: boolean; message: string }> {
    return of({ success: true, message: "Password reset email sent" }).pipe(
      delay(500),
    );
  }

  // In real implementation, use axios or HttpClient
  // Example with axios (if preferred):
  /*
  async loginWithAxios(credentials: LoginFormData): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${this.API_BASE_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw new ApiError({
        message: error.response?.data?.message || 'Login failed',
        status: error.response?.status || 500
      });
    }
  }
  */
}

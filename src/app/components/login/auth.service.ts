import { Injectable } from "@angular/core";
import axios, { AxiosResponse } from "axios";
import { LoginCredentials, LoginResponse, LoginError } from "./login.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly apiUrl = "http://localhost:4000/api/login";

  constructor() {}

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        this.apiUrl,
        {
          username: credentials.username,
          password: credentials.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        return response.data;
      }

      throw new Error("Unexpected response status");
    } catch (error: any) {
      if (error.response?.status === 401) {
        const errorData: LoginError = error.response.data;
        throw new Error(errorData.error || "Authentication failed");
      }

      throw new Error(error.message || "Network error occurred");
    }
  }
}

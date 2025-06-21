import { Injectable } from "@angular/core";
import axios, { AxiosResponse } from "axios";
import { LoginCredentials, LoginResponse, LoginError } from "./login.model";
import {
  SignupCredentials,
  SignupResponse,
  SignupError,
} from "../signup/signup.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly loginApiUrl = "http://localhost:4000/api/login";
  private readonly registerApiUrl = "http://localhost:4000/api/register";

  constructor() {}

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        this.loginApiUrl,
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

  async register(credentials: SignupCredentials): Promise<SignupResponse> {
    try {
      const response: AxiosResponse<SignupResponse> = await axios.post(
        this.registerApiUrl,
        {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        return response.data;
      }

      throw new Error("Unexpected response status");
    } catch (error: any) {
      if (error.response?.status === 400) {
        const errorData: SignupError = error.response.data;
        throw new Error(errorData.error || "Registration failed");
      }

      if (error.response?.status === 409) {
        const errorData: SignupError = error.response.data;
        throw new Error(errorData.error || "User already exists");
      }

      throw new Error(error.message || "Network error occurred");
    }
  }
}

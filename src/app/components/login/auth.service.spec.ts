import { TestBed } from "@angular/core/testing";
import axios from "axios";
import { AuthService } from "./auth.service";
import { LoginCredentials } from "./login.model";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    jest.clearAllMocks();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should make POST request to correct endpoint", async () => {
    const credentials: LoginCredentials = {
      username: "test@example.com",
      password: "password123",
    };

    const mockResponse = {
      status: 200,
      data: { data: "Login successful" },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    await service.login(credentials);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:4000/api/login",
      {
        username: "test@example.com",
        password: "password123",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });

  it("should return response data on successful login", async () => {
    const credentials: LoginCredentials = {
      username: "test@example.com",
      password: "password123",
    };

    const mockResponse = {
      status: 200,
      data: { data: "Login successful" },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await service.login(credentials);

    expect(result).toEqual({ data: "Login successful" });
  });

  it("should throw error with message from API on 401 response", async () => {
    const credentials: LoginCredentials = {
      username: "test@example.com",
      password: "wrongpassword",
    };

    const mockError = {
      response: {
        status: 401,
        data: { error: "Invalid credentials" },
      },
    };

    mockedAxios.post.mockRejectedValue(mockError);

    await expect(service.login(credentials)).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it("should throw default error message on 401 response without error field", async () => {
    const credentials: LoginCredentials = {
      username: "test@example.com",
      password: "wrongpassword",
    };

    const mockError = {
      response: {
        status: 401,
        data: {},
      },
    };

    mockedAxios.post.mockRejectedValue(mockError);

    await expect(service.login(credentials)).rejects.toThrow(
      "Authentication failed",
    );
  });

  it("should throw network error on request failure", async () => {
    const credentials: LoginCredentials = {
      username: "test@example.com",
      password: "password123",
    };

    const mockError = {
      message: "Network Error",
    };

    mockedAxios.post.mockRejectedValue(mockError);

    await expect(service.login(credentials)).rejects.toThrow("Network Error");
  });

  it("should throw default error message on unknown error", async () => {
    const credentials: LoginCredentials = {
      username: "test@example.com",
      password: "password123",
    };

    mockedAxios.post.mockRejectedValue({});

    await expect(service.login(credentials)).rejects.toThrow(
      "Network error occurred",
    );
  });

  it("should throw error on unexpected response status", async () => {
    const credentials: LoginCredentials = {
      username: "test@example.com",
      password: "password123",
    };

    const mockResponse = {
      status: 500,
      data: { data: "Server error" },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    await expect(service.login(credentials)).rejects.toThrow(
      "Unexpected response status",
    );
  });
});

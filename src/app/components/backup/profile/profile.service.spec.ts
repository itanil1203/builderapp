import { TestBed } from "@angular/core/testing";
import axios from "axios";
import { ProfileService } from "./profile.service";
import { UserProfile, UpdateProfileRequest } from "./user-profile.model";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ProfileService", () => {
  let service: ProfileService;

  const mockUserProfile: UserProfile = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profilePicture: "https://example.com/profile.jpg",
    dob: "1990-01-01",
    gender: "Male",
    contactNumber: "+1234567890",
    address: "123 Main St, City, Country",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileService);

    // Reset axios mocks
    jest.clearAllMocks();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getUserProfile", () => {
    it("should fetch user profile successfully", (done) => {
      const userId = "test-user-id";
      const mockResponse = { data: mockUserProfile };

      mockedAxios.get.mockResolvedValue(mockResponse);

      service.getUserProfile(userId).subscribe({
        next: (profile) => {
          expect(profile).toEqual(mockUserProfile);
          expect(mockedAxios.get).toHaveBeenCalledWith(
            `https://api.example.com/users/${userId}/profile`,
          );
          done();
        },
        error: done.fail,
      });
    });

    it("should handle error when fetching user profile", (done) => {
      const userId = "test-user-id";
      const errorMessage = "Network error";

      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      service.getUserProfile(userId).subscribe({
        next: () => done.fail("Should have failed"),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });
  });

  describe("updateUserProfile", () => {
    it("should update user profile successfully", (done) => {
      const userId = "test-user-id";
      const updateData: UpdateProfileRequest = {
        dob: "1995-01-01",
        gender: "Female",
      };
      const updatedProfile = { ...mockUserProfile, ...updateData };
      const mockResponse = { data: updatedProfile };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      service.updateUserProfile(userId, updateData).subscribe({
        next: (profile) => {
          expect(profile).toEqual(updatedProfile);
          expect(mockedAxios.patch).toHaveBeenCalledWith(
            `https://api.example.com/users/${userId}/profile`,
            updateData,
          );
          done();
        },
        error: done.fail,
      });
    });

    it("should handle error when updating user profile", (done) => {
      const userId = "test-user-id";
      const updateData: UpdateProfileRequest = { dob: "1995-01-01" };
      const errorMessage = "Update failed";

      mockedAxios.patch.mockRejectedValue(new Error(errorMessage));

      service.updateUserProfile(userId, updateData).subscribe({
        next: () => done.fail("Should have failed"),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });
  });

  describe("uploadProfilePicture", () => {
    it("should upload profile picture successfully", (done) => {
      const userId = "test-user-id";
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const mockResponse = {
        data: { profilePicture: "https://example.com/new-profile.jpg" },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      service.uploadProfilePicture(userId, mockFile).subscribe({
        next: (result) => {
          expect(result.profilePicture).toBe(
            "https://example.com/new-profile.jpg",
          );
          expect(mockedAxios.post).toHaveBeenCalledWith(
            `https://api.example.com/users/${userId}/profile-picture`,
            expect.any(FormData),
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          done();
        },
        error: done.fail,
      });
    });

    it("should handle error when uploading profile picture", (done) => {
      const userId = "test-user-id";
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const errorMessage = "Upload failed";

      mockedAxios.post.mockRejectedValue(new Error(errorMessage));

      service.uploadProfilePicture(userId, mockFile).subscribe({
        next: () => done.fail("Should have failed"),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });
  });

  describe("axios configuration", () => {
    it("should set default headers", () => {
      expect(axios.defaults.headers.common["Content-Type"]).toBe(
        "application/json",
      );
    });
  });
});

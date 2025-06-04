import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { UserProfileService } from "./user-profile.service";
import { UserProfile, UpdateProfileRequest } from "./user-profile.interface";

describe("UserProfileService", () => {
  let service: UserProfileService;
  let httpMock: HttpTestingController;

  const mockUserProfile: UserProfile = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profilePicture: "https://example.com/avatar.jpg",
    dob: "1990-01-01",
    gender: "Male",
    contactNumber: "+1234567890",
    address: "123 Main St, City, Country",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserProfileService],
    });
    service = TestBed.inject(UserProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get user profile", () => {
    service.getUserProfile().subscribe((profile) => {
      expect(profile).toEqual(mockUserProfile);
    });

    const req = httpMock.expectOne("/api/profile");
    expect(req.request.method).toBe("GET");
    req.flush(mockUserProfile);
  });

  it("should update user profile", () => {
    const updates: UpdateProfileRequest = {
      dob: "1991-01-01",
      gender: "Female",
    };
    const updatedProfile = { ...mockUserProfile, ...updates };

    service.updateUserProfile(updates).subscribe((profile) => {
      expect(profile).toEqual(updatedProfile);
    });

    const req = httpMock.expectOne("/api/profile");
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toEqual(updates);
    req.flush(updatedProfile);
  });

  it("should handle HTTP errors", () => {
    service.getUserProfile().subscribe({
      next: () => fail("should have failed with 404 error"),
      error: (error) => {
        expect(error.status).toBe(404);
      },
    });

    const req = httpMock.expectOne("/api/profile");
    req.flush("Not Found", { status: 404, statusText: "Not Found" });
  });
});

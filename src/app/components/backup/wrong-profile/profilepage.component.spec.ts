import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { of, throwError } from "rxjs";
import ProfilePageComponent from "./profilepage.component";
import { UserProfileService } from "./user-profile.service";
import { UserProfile, UpdateProfileRequest } from "./user-profile.interface";

describe("ProfilePageComponent", () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let userProfileService: jasmine.SpyObj<UserProfileService>;
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

  beforeEach(async () => {
    const spy = jasmine.createSpyObj("UserProfileService", [
      "getUserProfile",
      "updateUserProfile",
    ]);

    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent, HttpClientTestingModule],
      providers: [{ provide: UserProfileService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    userProfileService = TestBed.inject(
      UserProfileService,
    ) as jasmine.SpyObj<UserProfileService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should create", () => {
    userProfileService.getUserProfile.and.returnValue(of(mockUserProfile));
    expect(component).toBeTruthy();
  });

  it("should load user profile on init", () => {
    userProfileService.getUserProfile.and.returnValue(of(mockUserProfile));

    component.ngOnInit();

    expect(userProfileService.getUserProfile).toHaveBeenCalled();
    expect(component.userProfile).toEqual(mockUserProfile);
    expect(component.isLoading).toBeFalse();
  });

  it("should handle error when loading profile fails", () => {
    const errorMessage = "Network error";
    userProfileService.getUserProfile.and.returnValue(
      throwError(() => new Error(errorMessage)),
    );

    component.ngOnInit();

    expect(component.error).toBe("Failed to load profile. Please try again.");
    expect(component.isLoading).toBeFalse();
  });

  it("should toggle edit mode", () => {
    expect(component.isEditing).toBeFalse();

    component.toggleEdit();

    expect(component.isEditing).toBeTrue();

    component.toggleEdit();

    expect(component.isEditing).toBeFalse();
  });

  it("should save profile changes", () => {
    const updates: UpdateProfileRequest = {
      dob: "1991-01-01",
      gender: "Female",
    };
    const updatedProfile = { ...mockUserProfile, ...updates };

    userProfileService.updateUserProfile.and.returnValue(of(updatedProfile));
    component.isEditing = true;

    component.handleSave(updates);

    expect(userProfileService.updateUserProfile).toHaveBeenCalledWith(updates);
    expect(component.userProfile).toEqual(updatedProfile);
    expect(component.isEditing).toBeFalse();
    expect(component.error).toBeNull();
  });

  it("should handle error when saving profile fails", () => {
    const updates: UpdateProfileRequest = { dob: "1991-01-01" };
    const errorMessage = "Save failed";

    userProfileService.updateUserProfile.and.returnValue(
      throwError(() => new Error(errorMessage)),
    );

    component.handleSave(updates);

    expect(component.error).toBe("Failed to save changes. Please try again.");
  });

  it("should display loading state", () => {
    component.isLoading = true;
    fixture.detectChanges();

    const loadingElement =
      fixture.nativeElement.querySelector('[data-testid="loading"]') ||
      fixture.nativeElement.textContent;

    expect(loadingElement).toContain("Loading profile...");
  });

  it("should display error message", () => {
    component.error = "Test error message";
    component.isLoading = false;
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector(".text-red-700");

    expect(errorElement?.textContent).toContain("Test error message");
  });
});

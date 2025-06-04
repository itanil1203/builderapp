import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { ProfilePageComponent } from "./profile-page.component";
import { ProfileService } from "./profile.service";
import { UserProfile } from "./user-profile.model";

describe("ProfilePageComponent", () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;

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

  beforeEach(async () => {
    const profileServiceSpy = jasmine.createSpyObj("ProfileService", [
      "getUserProfile",
      "updateUserProfile",
    ]);

    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [{ provide: ProfileService, useValue: profileServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    mockProfileService = TestBed.inject(
      ProfileService,
    ) as jasmine.SpyObj<ProfileService>;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load user profile on init", () => {
    mockProfileService.getUserProfile.and.returnValue(of(mockUserProfile));

    component.ngOnInit();

    expect(mockProfileService.getUserProfile).toHaveBeenCalledWith(
      "current-user",
    );
    expect(component.userProfile).toEqual(mockUserProfile);
    expect(component.isLoading).toBeFalse();
  });

  it("should handle error when loading profile fails", () => {
    const errorMessage = "Network error";
    mockProfileService.getUserProfile.and.returnValue(
      throwError(() => new Error(errorMessage)),
    );

    component.ngOnInit();

    expect(component.error).toBe("Failed to load profile. Please try again.");
    expect(component.isLoading).toBeFalse();
  });

  it("should toggle edit mode", () => {
    component.userProfile = mockUserProfile;

    expect(component.isEditing).toBeFalse();

    component.toggleEditAction();

    expect(component.isEditing).toBeTrue();
    expect(component.editableProfile.dob).toBe(mockUserProfile.dob);
    expect(component.editableProfile.gender).toBe(mockUserProfile.gender);
    expect(component.editableProfile.contactNumber).toBe(
      mockUserProfile.contactNumber,
    );
    expect(component.editableProfile.address).toBe(mockUserProfile.address);
  });

  it("should cancel edit mode", () => {
    component.isEditing = true;
    component.editableProfile = { dob: "1995-01-01" };

    component.toggleEditAction();

    expect(component.isEditing).toBeFalse();
    expect(component.editableProfile).toEqual({});
  });

  it("should update field value", () => {
    component.updateFieldAction("dob", "1995-01-01");

    expect(component.editableProfile.dob).toBe("1995-01-01");
  });

  it("should save profile successfully", () => {
    const updatedProfile = { ...mockUserProfile, dob: "1995-01-01" };
    mockProfileService.updateUserProfile.and.returnValue(of(updatedProfile));

    component.editableProfile = { dob: "1995-01-01" };
    component.isEditing = true;

    component.saveProfile();

    expect(mockProfileService.updateUserProfile).toHaveBeenCalledWith(
      "current-user",
      { dob: "1995-01-01" },
    );
    expect(component.userProfile).toEqual(updatedProfile);
    expect(component.isEditing).toBeFalse();
    expect(component.editableProfile).toEqual({});
  });

  it("should handle save profile error", () => {
    mockProfileService.updateUserProfile.and.returnValue(
      throwError(() => new Error("Save failed")),
    );

    component.editableProfile = { dob: "1995-01-01" };

    component.saveProfile();

    expect(component.error).toBe("Failed to save profile. Please try again.");
    expect(component.isLoading).toBeFalse();
  });

  it("should handle form submission", () => {
    spyOn(component, "saveProfile");
    const mockEvent = new Event("submit");
    spyOn(mockEvent, "preventDefault");

    component.handleSaveAction(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(component.saveProfile).toHaveBeenCalled();
  });

  it("should return correct profile fields", () => {
    component.userProfile = mockUserProfile;

    const fields = component.getProfileFields();

    expect(fields).toEqual([
      ["Date of Birth", "1990-01-01"],
      ["Gender", "Male"],
      ["Contact", "+1234567890"],
      ["Address", "123 Main St, City, Country"],
    ]);
  });

  it("should return correct edit fields", () => {
    component.userProfile = mockUserProfile;
    component.editableProfile = { dob: "1995-01-01" };

    const fields = component.getEditFields();

    expect(fields).toEqual([
      ["Date of Birth", "date", "1995-01-01", "dob"],
      ["Gender", "text", "Male", "gender"],
      ["Contact", "tel", "+1234567890", "contactNumber"],
      ["Address", "text", "123 Main St, City, Country", "address"],
    ]);
  });

  it("should track profile fields correctly", () => {
    const result = component.trackByProfileField(0, [
      "Date of Birth",
      "1990-01-01",
    ]);
    expect(result).toBe("profile-field-0");
  });

  it("should track edit fields correctly", () => {
    const result = component.trackByEditField(0, [
      "Date of Birth",
      "date",
      "1990-01-01",
      "dob",
    ]);
    expect(result).toBe("edit-field-0");
  });
});

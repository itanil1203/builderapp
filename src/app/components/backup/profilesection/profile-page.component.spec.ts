import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { of } from "rxjs";
import { ProfilePageComponent } from "./profile-page.component";
import { ProfileService } from "./profile.service";
import { UserProfile } from "./user-profile.model";

describe("ProfilePageComponent", () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let profileService: jasmine.SpyObj<ProfileService>;

  const mockUserProfile: UserProfile = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    dob: "1990-01-15",
    gender: "Male",
    email: "john.doe@example.com",
    contactNumber: "+1-555-0123",
    profilePicture: "https://example.com/profile.jpg",
  };

  beforeEach(async () => {
    const profileServiceSpy = jasmine.createSpyObj("ProfileService", [
      "getUserProfile",
      "updateUserProfile",
    ]);

    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent, FormsModule],
      providers: [{ provide: ProfileService, useValue: profileServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(
      ProfileService,
    ) as jasmine.SpyObj<ProfileService>;
  });

  beforeEach(() => {
    profileService.getUserProfile.and.returnValue(of(mockUserProfile));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load user profile on init", () => {
    expect(profileService.getUserProfile).toHaveBeenCalled();
    expect(component.userProfile).toEqual(mockUserProfile);
  });

  it("should start editing mode", () => {
    component.startEditing();

    expect(component.isEditing).toBe(true);
    expect(component.tempEmail).toBe(mockUserProfile.email);
    expect(component.tempContact).toBe(mockUserProfile.contactNumber);
  });

  it("should cancel editing mode", () => {
    component.startEditing();
    component.tempEmail = "changed@example.com";
    component.tempContact = "+1-555-9999";

    component.cancelEdit();

    expect(component.isEditing).toBe(false);
    expect(component.tempEmail).toBe("");
    expect(component.tempContact).toBe("");
  });

  it("should validate email field", () => {
    component.tempEmail = "invalid-email";
    component.tempContact = "+1-555-0123";

    const isValid = component.validateFields();

    expect(isValid).toBe(false);
    expect(component.errors.email).toBe("Please enter a valid email address");
  });

  it("should validate contact field", () => {
    component.tempEmail = "valid@example.com";
    component.tempContact = "invalid-contact";

    const isValid = component.validateFields();

    expect(isValid).toBe(false);
    expect(component.errors.contact).toBe(
      "Please enter a valid contact number",
    );
  });

  it("should save changes when validation passes", () => {
    const updatedProfile = {
      ...mockUserProfile,
      email: "new@example.com",
      contactNumber: "+1-555-9999",
    };
    profileService.updateUserProfile.and.returnValue(of(updatedProfile));

    component.startEditing();
    component.tempEmail = "new@example.com";
    component.tempContact = "+1-555-9999";

    component.saveChanges();

    expect(profileService.updateUserProfile).toHaveBeenCalledWith(
      updatedProfile,
    );
    expect(component.isEditing).toBe(false);
  });

  it("should not save changes when validation fails", () => {
    component.startEditing();
    component.tempEmail = "invalid-email";
    component.tempContact = "invalid-contact";

    component.saveChanges();

    expect(profileService.updateUserProfile).not.toHaveBeenCalled();
    expect(component.isEditing).toBe(true);
  });

  it("should generate profile fields correctly", () => {
    const fields = component.getProfileFields();

    expect(fields).toHaveSize(6);
    expect(fields[0].label).toBe("First Name");
    expect(fields[0].value).toBe(mockUserProfile.firstName);
    expect(fields[4].label).toBe("Email");
  });

  it("should handle keyboard events", () => {
    const mockAction = jasmine.createSpy("mockAction");
    const event = new KeyboardEvent("keydown", { key: "Enter" });
    spyOn(event, "preventDefault");

    component.onKeydown(event, mockAction);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockAction).toHaveBeenCalled();
  });

  it("should track fields by key", () => {
    const field = { label: "Test", value: "test", key: "test-key" };
    const result = component.trackByField(0, field);

    expect(result).toBe("test-key");
  });
});

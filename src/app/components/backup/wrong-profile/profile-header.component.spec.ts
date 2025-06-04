import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProfileHeaderComponent } from "./profile-header.component";
import { UserProfile } from "./user-profile.interface";

describe("ProfileHeaderComponent", () => {
  let component: ProfileHeaderComponent;
  let fixture: ComponentFixture<ProfileHeaderComponent>;

  const mockUserProfile: UserProfile = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profilePicture: "https://example.com/avatar.jpg",
    dob: "1990-01-01",
    gender: "Male",
    contactNumber: "+1234567890",
    address: "123 Main St",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHeaderComponent);
    component = fixture.componentInstance;
    component.userProfile = mockUserProfile;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display user information", () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain("John Doe");
    expect(compiled.textContent).toContain("john.doe@example.com");
  });

  it("should emit toggle edit event", () => {
    spyOn(component.toggleEdit, "emit");

    component.onToggleEdit();

    expect(component.toggleEdit.emit).toHaveBeenCalled();
  });

  it("should show correct button text based on editing state", () => {
    component.isEditing = false;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");
    expect(button.textContent.trim()).toBe("Edit Profile");

    component.isEditing = true;
    fixture.detectChanges();

    expect(button.textContent.trim()).toBe("Cancel Edit");
  });

  it("should have proper accessibility attributes", () => {
    component.isEditing = false;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");
    expect(button.getAttribute("aria-label")).toBe("Edit profile information");

    component.isEditing = true;
    fixture.detectChanges();

    expect(button.getAttribute("aria-label")).toBe("Cancel profile editing");
  });
});

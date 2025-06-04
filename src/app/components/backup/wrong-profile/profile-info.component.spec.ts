import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProfileInfoComponent } from "./profile-info.component";
import { UserProfile } from "./user-profile.interface";

describe("ProfileInfoComponent", () => {
  let component: ProfileInfoComponent;
  let fixture: ComponentFixture<ProfileInfoComponent>;

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
      imports: [ProfileInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileInfoComponent);
    component = fixture.componentInstance;
    component.userProfile = mockUserProfile;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display profile fields", () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain("Date of Birth");
    expect(compiled.textContent).toContain("1990-01-01");
    expect(compiled.textContent).toContain("Gender");
    expect(compiled.textContent).toContain("Male");
    expect(compiled.textContent).toContain("Contact");
    expect(compiled.textContent).toContain("+1234567890");
    expect(compiled.textContent).toContain("Address");
    expect(compiled.textContent).toContain("123 Main St");
  });

  it("should return correct profile fields", () => {
    const fields = component.profileFields;

    expect(fields).toEqual([
      { label: "Date of Birth", value: "1990-01-01" },
      { label: "Gender", value: "Male" },
      { label: "Contact", value: "+1234567890" },
      { label: "Address", value: "123 Main St" },
    ]);
  });

  it("should track fields correctly", () => {
    const trackResult = component.trackByField(0, {
      label: "Test",
      value: "Test",
    });
    expect(trackResult).toBe("profile-field-0");
  });
});

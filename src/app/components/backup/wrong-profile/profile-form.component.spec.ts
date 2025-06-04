import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ProfileFormComponent } from "./profile-form.component";
import { UserProfile } from "./user-profile.interface";

describe("ProfileFormComponent", () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;

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
      imports: [ProfileFormComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;
    component.userProfile = mockUserProfile;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form data on init", () => {
    component.ngOnInit();

    expect(component.formData).toEqual({
      dob: "1990-01-01",
      gender: "Male",
      contactNumber: "+1234567890",
      address: "123 Main St",
    });
  });

  it("should update field value", () => {
    component.ngOnInit();

    const mockEvent = {
      target: { value: "Female" },
    } as any;

    component.updateField("gender", mockEvent);

    expect(component.formData.gender).toBe("Female");
  });

  it("should emit save changes on submit", () => {
    spyOn(component.saveChanges, "emit");
    component.ngOnInit();

    component.onSubmit();

    expect(component.saveChanges.emit).toHaveBeenCalledWith(component.formData);
  });

  it("should track fields correctly", () => {
    const trackResult = component.trackByField(0, {
      label: "Test",
      value: "Test",
    });
    expect(trackResult).toBe("edit-field-0");
  });

  it("should render form fields", () => {
    component.ngOnInit();
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll("input");
    expect(inputs.length).toBe(4);

    const labels = fixture.nativeElement.querySelectorAll("label");
    expect(labels.length).toBe(4);
  });

  it("should have proper form validation attributes", () => {
    component.ngOnInit();
    fixture.detectChanges();

    const dobInput = fixture.nativeElement.querySelector('input[type="date"]');
    expect(dobInput).toBeTruthy();

    const telInput = fixture.nativeElement.querySelector('input[type="tel"]');
    expect(telInput).toBeTruthy();
  });
});

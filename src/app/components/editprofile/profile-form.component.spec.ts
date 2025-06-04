import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ProfileFormComponent } from "./profile-form.component";
import { ProfileService } from "./profile.service";

describe("ProfileFormComponent", () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;
  let profileService: ProfileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileFormComponent, HttpClientTestingModule],
      providers: [ProfileService],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with empty profile", () => {
    expect(component.profile).toEqual({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
    expect(component.isEditing).toBeFalsy();
  });

  it("should toggle edit mode", () => {
    component.toggleEdit();
    expect(component.isEditing).toBeTruthy();
    expect(component.formStatus).toBe("Form is now in edit mode");

    component.toggleEdit();
    expect(component.isEditing).toBeFalsy();
    expect(component.formStatus).toBe("Form is now in view mode");
  });

  it("should validate required fields", () => {
    component.validateField("firstName", "");
    expect(component.errors.firstName).toBe("First name is required");

    component.validateField("firstName", "John");
    expect(component.errors.firstName).toBe("");
  });

  it("should validate email format", () => {
    component.validateField("email", "invalid-email");
    expect(component.errors.email).toBe("Invalid email format");

    component.validateField("email", "test@example.com");
    expect(component.errors.email).toBe("");
  });

  it("should validate phone format", () => {
    component.validateField("phone", "123");
    expect(component.errors.phone).toBe("Invalid phone format");

    component.validateField("phone", "+1234567890");
    expect(component.errors.phone).toBe("");
  });

  it("should handle input changes", () => {
    const mockEvent = {
      target: { value: "John" },
    } as any;

    component.handleInput("firstName", mockEvent);
    expect(component.profile.firstName).toBe("John");
  });

  it("should cancel edit and restore original values", () => {
    component.profile = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
    };
    component.originalProfile = { ...component.profile };
    component.isEditing = true;

    // Make changes
    component.profile.firstName = "Jane";

    // Cancel edit
    component.cancelEdit();

    expect(component.profile.firstName).toBe("John");
    expect(component.isEditing).toBeFalsy();
    expect(component.formStatus).toBe("Changes have been cancelled");
  });

  it("should reset form", () => {
    component.profile = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
    };
    component.isEditing = true;

    component.resetForm();

    expect(component.profile).toEqual({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
    expect(component.isEditing).toBeFalsy();
    expect(component.formStatus).toBe("Form has been reset");
  });

  it("should validate all fields before submit", async () => {
    component.profile = {
      firstName: "",
      lastName: "Doe",
      email: "invalid-email",
      phone: "123",
    };

    await component.handleSubmit();

    expect(component.errors.firstName).toBe("First name is required");
    expect(component.errors.email).toBe("Invalid email format");
    expect(component.errors.phone).toBe("Invalid phone format");
    expect(component.formStatus).toBe(
      "Please correct the errors before submitting",
    );
  });

  it("should handle successful form submission", async () => {
    component.profile = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
    };
    component.isEditing = true;

    await component.handleSubmit();

    expect(component.isEditing).toBeFalsy();
    expect(component.formStatus).toBe("Profile updated successfully");
  });

  it("should handle keyboard events", () => {
    const mockAction = jest.fn();
    const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
    const spaceEvent = new KeyboardEvent("keydown", { key: " " });

    jest.spyOn(enterEvent, "preventDefault");
    jest.spyOn(spaceEvent, "preventDefault");

    component.handleKeyDown(enterEvent, mockAction);
    expect(enterEvent.preventDefault).toHaveBeenCalled();
    expect(mockAction).toHaveBeenCalled();

    component.handleKeyDown(spaceEvent, mockAction);
    expect(spaceEvent.preventDefault).toHaveBeenCalled();
    expect(mockAction).toHaveBeenCalledTimes(2);
  });
});

describe("ProfileService", () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProfileService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should validate email correctly", () => {
    expect(service.validateEmail("test@example.com")).toBeTruthy();
    expect(service.validateEmail("invalid-email")).toBeFalsy();
    expect(service.validateEmail("")).toBeFalsy();
  });

  it("should validate phone correctly", () => {
    expect(service.validatePhone("+1234567890")).toBeTruthy();
    expect(service.validatePhone("123-456-7890")).toBeTruthy();
    expect(service.validatePhone("123 456 7890")).toBeTruthy();
    expect(service.validatePhone("123")).toBeFalsy();
    expect(service.validatePhone("")).toBeFalsy();
  });
});

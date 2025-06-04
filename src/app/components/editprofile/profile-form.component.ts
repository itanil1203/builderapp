import { AfterViewInit, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Profile, ProfileErrors, ValidationResult } from "./profile.model";
import { ProfileService } from "./profile.service";

@Component({
  selector: "app-profile-form",
  templateUrl: "./profile-form.component.html",
  styleUrls: ["./profile-form.component.scss"],
  standalone: true,
  imports: [CommonModule, HttpClientModule],
})
export class ProfileFormComponent implements OnInit,AfterViewInit {
  profile: Profile = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };

  originalProfile: Profile = { ...this.profile };

  errors: ProfileErrors = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };

  isEditing = false;
  formStatus = "";
  isLoading = false;

  constructor(private profileService: ProfileService) {}
  ngAfterViewInit(): void {
    this.loadProfile();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    try {
      this.isLoading = true;
      // In a real application, you would load the profile from the API
      // this.profile = await this.profileService.getProfile().toPromise();
      // this.originalProfile = { ...this.profile };
      this.profileService.getProfile().subscribe(
        (data)=>{ 
          this.profile= data;
        },
        (error)=>{
          console.log(error);
        }
      );
    } catch (error) {
      this.formStatus = "Failed to load profile data";
    } finally {
      this.isLoading = false;
    }
  }

  validateField(field: keyof Profile, value: string): void {
    switch (field) {
      case "firstName":
        this.errors.firstName = !value.trim() ? "First name is required" : "";
        break;
      case "lastName":
        this.errors.lastName = !value.trim() ? "Last name is required" : "";
        break;
      case "email":
        this.errors.email = !value.trim()
          ? "Email is required"
          : !this.profileService.validateEmail(value)
            ? "Invalid email format"
            : "";
        break;
      case "phone":
        this.errors.phone = !value.trim()
          ? "Phone is required"
          : !this.profileService.validatePhone(value)
            ? "Invalid phone format"
            : "";
        break;
    }
  }

  validateAllFields(): ValidationResult {
    this.validateField("firstName", this.profile.firstName);
    this.validateField("lastName", this.profile.lastName);
    this.validateField("email", this.profile.email);
    this.validateField("phone", this.profile.phone);

    const hasErrors = Object.values(this.errors).some((error) => error);
    return {
      isValid: !hasErrors,
      errors: { ...this.errors },
    };
  }

  handleInput(field: keyof Profile, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.profile[field] = value;
    this.validateField(field, value);
    this.clearFormStatus();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.formStatus = this.isEditing
      ? "Form is now in edit mode"
      : "Form is now in view mode";

    if (this.isEditing) {
      this.originalProfile = { ...this.profile };
    }
  }

  cancelEdit(): void {
    this.profile = { ...this.originalProfile };
    this.clearErrors();
    this.isEditing = false;
    this.formStatus = "Changes have been cancelled";
  }

  resetForm(): void {
    this.profile = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    };
    this.originalProfile = { ...this.profile };
    this.clearErrors();
    this.isEditing = false;
    this.formStatus = "Form has been reset";
  }

  private clearErrors(): void {
    this.errors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    };
  }

  private clearFormStatus(): void {
    if (
      this.formStatus.includes("error") ||
      this.formStatus.includes("success")
    ) {
      this.formStatus = "";
    }
  }

  handleKeyDown(event: KeyboardEvent, action: () => void): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action.call(this);
    }
  }

  async handleSubmit(event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
    }

    const validation = this.validateAllFields();

    if (!validation.isValid) {
      this.formStatus = "Please correct the errors before submitting";
      return;
    }

    try {
      this.isLoading = true;
      this.formStatus = "Saving changes...";

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real application, you would call the service
      await this.profileService.updateProfile(this.profile).toPromise();

      this.originalProfile = { ...this.profile };
      this.isEditing = false;
      this.formStatus = "Profile updated successfully";
    } catch (error) {
      this.formStatus = "Failed to update profile. Please try again.";
    } finally {
      this.isLoading = false;
    }
  }
}

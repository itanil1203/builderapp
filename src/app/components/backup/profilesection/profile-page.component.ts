import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  UserProfile,
  ProfileField,
  ValidationErrors,
} from "./user-profile.model";
import { ProfileService } from "./profile.service";

@Component({
  selector: "app-profile-page",
  templateUrl: "./profile-page.component.html",
  styleUrls: ["./profile-page.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProfilePageComponent implements OnInit {
  userProfile: UserProfile = {
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    contactNumber: "",
    profilePicture: "",
  };

  isEditing = false;
  tempEmail = "";
  tempContact = "";
  errors: ValidationErrors = {};

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: (error) => {
        console.error("Error loading profile:", error);
      },
    });
  }

  getProfileFields(): ProfileField[] {
    return [
      {
        label: "First Name",
        value: this.userProfile.firstName,
        key: "firstName",
      },
      {
        label: "Last Name",
        value: this.userProfile.lastName,
        key: "lastName",
      },
      {
        label: "Date of Birth",
        value: this.userProfile.dob,
        key: "dob",
      },
      {
        label: "Gender",
        value: this.userProfile.gender,
        key: "gender",
      },
      {
        label: "Email",
        value: this.isEditing ? "editing" : this.userProfile.email,
        key: "email",
      },
      {
        label: "Contact Number",
        value: this.isEditing ? "editing" : this.userProfile.contactNumber,
        key: "contact",
      },
    ];
  }

  startEditing(): void {
    this.isEditing = true;
    this.tempEmail = this.userProfile.email;
    this.tempContact = this.userProfile.contactNumber;
    this.errors = {};
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.tempEmail = "";
    this.tempContact = "";
    this.errors = {};
  }

  validateFields(): boolean {
    this.errors = {};
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.tempEmail || !emailRegex.test(this.tempEmail)) {
      this.errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Contact validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (
      !this.tempContact ||
      !phoneRegex.test(this.tempContact.replace(/[-\s]/g, ""))
    ) {
      this.errors.contact = "Please enter a valid contact number";
      isValid = false;
    }

    return isValid;
  }

  saveChanges(): void {
    if (!this.validateFields()) {
      return;
    }

    const updatedProfile: UserProfile = {
      ...this.userProfile,
      email: this.tempEmail,
      contactNumber: this.tempContact,
    };

    this.profileService.updateUserProfile(updatedProfile).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.isEditing = false;
        this.tempEmail = "";
        this.tempContact = "";
        this.errors = {};
        console.log("Profile updated successfully");
      },
      error: (error) => {
        console.error("Error updating profile:", error);
      },
    });
  }

  trackByField(index: number, field: ProfileField): string {
    return field.key;
  }

  onKeydown(event: KeyboardEvent, action: () => void): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  }
}

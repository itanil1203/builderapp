import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserProfile, UpdateProfileRequest } from "./user-profile.model";
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
    email: "",
    profilePicture: "",
    dob: "",
    gender: "",
    contactNumber: "",
    address: "",
  };

  editableProfile: UpdateProfileRequest = {};
  isEditing = false;
  isLoading = false;
  error: string | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.error = null;
    console.log("load User Profile")

    // Replace 'current-user' with actual user ID from authentication
    this.profileService.getUserProfile("current-user").subscribe({
      next: (profile) => {
        console.log("getUserProfile");
        this.userProfile = profile;
        console.log("User Profile received");
        this.isLoading = false;
        console.log("User Profile Loading");
      },
      error: (error) => {
        this.error = "Failed to load profile. Please try again.";
        this.isLoading = false;
        console.error("Error loading profile:", error);
      },
    });
  }

  toggleEditAction(): void {
    if (this.isEditing) {
      this.cancelEdit();
    } else {
      this.startEdit();
    }
  }

  startEdit(): void {
    this.isEditing = true;
    this.editableProfile = {
      dob: this.userProfile.dob,
      gender: this.userProfile.gender,
      contactNumber: this.userProfile.contactNumber,
      address: this.userProfile.address,
    };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editableProfile = {};
    this.error = null;
  }

  updateFieldAction(fieldName: string, value: string): void {
    this.editableProfile = {
      ...this.editableProfile,
      [fieldName]: value,
    };
  }

  handleSaveAction(event: Event): void {
    event.preventDefault();
    this.saveProfile();
  }

  saveProfile(): void {
    this.isLoading = true;
    this.error = null;

    // Replace 'current-user' with actual user ID from authentication
    this.profileService
      .updateUserProfile("current-user", this.editableProfile)
      .subscribe({
        next: (updatedProfile) => {
          this.userProfile = updatedProfile;
          this.isEditing = false;
          this.editableProfile = {};
          this.isLoading = false;
        },
        error: (error) => {
          this.error = "Failed to save profile. Please try again.";
          this.isLoading = false;
          console.error("Error saving profile:", error);
        },
      });
  }

  trackByProfileField(index: number, item: [string, string]): string {
    return `profile-field-${index}`;
  }

  trackByEditField(
    index: number,
    item: [string, string, string, string],
  ): string {
    return `edit-field-${index}`;
  }

  getProfileFields(): [string, string][] {
    return [
      ["Date of Birth", this.userProfile.dob],
      ["Gender", this.userProfile.gender],
      ["Contact", this.userProfile.contactNumber],
      ["Address", this.userProfile.address],
    ];
  }

  getEditFields(): [string, string, string, string][] {
    return [
      [
        "Date of Birth",
        "date",
        this.editableProfile.dob || this.userProfile.dob,
        "dob",
      ],
      [
        "Gender",
        "text",
        this.editableProfile.gender || this.userProfile.gender,
        "gender",
      ],
      [
        "Contact",
        "tel",
        this.editableProfile.contactNumber || this.userProfile.contactNumber,
        "contactNumber",
      ],
      [
        "Address",
        "text",
        this.editableProfile.address || this.userProfile.address,
        "address",
      ],
    ];
  }
}

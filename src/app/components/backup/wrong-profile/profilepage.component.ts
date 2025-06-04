import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { UserProfile, UpdateProfileRequest } from "./user-profile.interface";
import { UserProfileService } from "./user-profile.service";
import { ProfileHeaderComponent } from "./profile-header.component";
import { ProfileInfoComponent } from "./profile-info.component";
import { ProfileFormComponent } from "./profile-form.component";

@Component({
  selector: "app-profilepage",
  templateUrl: "./profilepage.component.html",
  styleUrls: ["./profilepage.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ProfileHeaderComponent,
    ProfileInfoComponent,
    ProfileFormComponent,
  ],
})
export default class ProfilePageComponent implements OnInit {
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

  isEditing = false;
  isLoading = true;
  error: string | null = null;

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.isLoading = true;
    this.error = null;

    this.userProfileService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = "Failed to load profile. Please try again.";
        this.isLoading = false;
        console.error("Error loading profile:", error);
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  handleSave(updates: UpdateProfileRequest): void {
    this.userProfileService.updateUserProfile(updates).subscribe({
      next: (updatedProfile) => {
        this.userProfile = updatedProfile;
        this.isEditing = false;
        this.error = null;
      },
      error: (error) => {
        this.error = "Failed to save changes. Please try again.";
        console.error("Error updating profile:", error);
      },
    });
  }
}

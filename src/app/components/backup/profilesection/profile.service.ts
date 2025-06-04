import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { UserProfile } from "./user-profile.model";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private apiUrl = "/api/profile";

  constructor() {}

  getUserProfile(): Observable<UserProfile> {
    // Mock data for demonstration - replace with actual HTTP call
    const mockProfile: UserProfile = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      dob: "1990-01-15",
      gender: "Male",
      email: "john.doe@example.com",
      contactNumber: "+1-555-0123",
      profilePicture:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    };

    return of(mockProfile);

    // Actual implementation would use HttpClient:
    // return this.http.get<UserProfile>(`${this.apiUrl}`);
  }

  updateUserProfile(profile: UserProfile): Observable<UserProfile> {
    // Mock implementation - replace with actual HTTP call
    console.log("Updating profile:", profile);
    return of(profile);

    // Actual implementation would use HttpClient:
    // return this.http.post<UserProfile>(`${this.apiUrl}`, profile);
  }
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserProfile, UpdateProfileRequest } from "./user-profile.interface";

@Injectable({
  providedIn: "root",
})
export class UserProfileService {
  private readonly apiUrl = "/api/profile";

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl);
  }

  updateUserProfile(updates: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.patch<UserProfile>(this.apiUrl, updates);
  }
}

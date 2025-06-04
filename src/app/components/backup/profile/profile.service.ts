import { Injectable } from "@angular/core";
import axios, { AxiosResponse } from "axios";
import { Observable, from } from "rxjs";
import { UserProfile, UpdateProfileRequest } from "./user-profile.model";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private readonly baseUrl = "http://localhost:4000"; // Replace with actual API URL

  constructor() {
    // Configure axios defaults
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.headers.common["origin"] = "*";
  }

  getUserProfile(userId: string): Observable<UserProfile> {
    return from(
      axios
        .get<UserProfile>(`${this.baseUrl}/users/${userId}/profile`)
        .then((response: AxiosResponse<UserProfile>) => {
          console.log('User profile data:', response.data);
          return response.data;
        }),
    );
  }

  updateUserProfile(
    userId: string,
    profileData: UpdateProfileRequest,
  ): Observable<UserProfile> {
    return from(
      axios
        .patch<UserProfile>(
          `${this.baseUrl}/users/${userId}/profile`,
          profileData,
        )
        .then((response: AxiosResponse<UserProfile>) => response.data),
    );
  }

  uploadProfilePicture(
    userId: string,
    file: File,
  ): Observable<{ profilePicture: string }> {
    const formData = new FormData();
    formData.append("profilePicture", file);

    return from(
      axios
        .post<{ profilePicture: string }>(
          `${this.baseUrl}/users/${userId}/profile-picture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        )
        .then(
          (response: AxiosResponse<{ profilePicture: string }>) =>
            response.data,
        ),
    );
  }
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  dob: string;
  gender: string;
  contactNumber: string;
  address: string;
}

export interface UpdateProfileRequest {
  dob?: string;
  gender?: string;
  contactNumber?: string;
  address?: string;
}

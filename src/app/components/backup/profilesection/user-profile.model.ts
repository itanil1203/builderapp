export interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
  contactNumber: string;
  profilePicture: string;
}

export interface ProfileField {
  label: string;
  value: string | any;
  key: string;
}

export interface ValidationErrors {
  email?: string;
  contact?: string;
}

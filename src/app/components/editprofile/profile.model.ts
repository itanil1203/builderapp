export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ProfileErrors {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ProfileErrors;
}

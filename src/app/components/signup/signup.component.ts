import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../login/auth.service";
import { SignupCredentials } from "./signup.model";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signupForm = this.createSignupForm();
  }

  ngOnInit(): void {
    // Component initialization logic if needed
  }

  private createSignupForm(): FormGroup {
    return this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSignup(): Promise<void> {
    if (this.signupForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;

    try {
      const credentials: SignupCredentials = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      };

      const response = await this.authService.register(credentials);

      // Show success alert with response data
      alert(
        `Registration successful! ${response.data || response.message || ""}`,
      );

      // Redirect to login page
      await this.router.navigate(["/login"]);
    } catch (error: any) {
      // Show error alert with error message
      alert(error.message || "Registration failed. Please try again.");
    } finally {
      this.isLoading = false;
    }
  }

  onReset(): void {
    this.signupForm.reset();
    // Reset validation states
    Object.keys(this.signupForm.controls).forEach((key) => {
      const control = this.signupForm.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
      }
    });
  }

  async onBackToLogin(): Promise<void> {
    await this.router.navigate(["/login"]);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach((key) => {
      const control = this.signupForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}

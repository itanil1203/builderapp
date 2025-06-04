import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "./auth.service";
import { LoginFormData } from "./login.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export default class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.loginForm = this.createLoginForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  private initializeForm(): void {
    // Reset form state
    this.loginForm.reset();
    this.errorMessage = "";
    this.isLoading = false;
  }

  handleBackAction(): void {
    // Navigate back in history
    window.history.back();
  }

  handleBackKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleBackAction();
    }
  }

  handleLoginSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.performLogin();
    } else {
      this.markFormGroupTouched();
    }
  }

  private performLogin(): void {
    this.isLoading = true;
    this.errorMessage = "";

    const formData: LoginFormData = {
      email: this.loginForm.get("email")?.value,
      password: this.loginForm.get("password")?.value,
    };

    this.authService.login(formData).subscribe({
      next: (response) => {
        this.handleLoginSuccess(response);
      },
      error: (error) => {
        this.handleLoginError(error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private handleLoginSuccess(response: any): void {
    console.log("Login successful:", response);
    // Handle successful login (e.g., redirect to dashboard)
    // In a real app, you might use Router to navigate
    // this.router.navigate(['/dashboard']);
  }

  private handleLoginError(error: any): void {
    console.error("Login failed:", error);
    this.errorMessage = error.message || "Login failed. Please try again.";
  }

  handleForgotPasswordAction(): void {
    const email = this.loginForm.get("email")?.value;

    if (email && this.isValidEmail(email)) {
      this.processForgotPassword(email);
    } else {
      this.errorMessage = "Please enter a valid email address first.";
    }
  }

  private processForgotPassword(email: string): void {
    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        console.log("Password reset email sent:", response);
        // Show success message or redirect
      },
      error: (error) => {
        console.error("Forgot password failed:", error);
        this.errorMessage = "Failed to send password reset email.";
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

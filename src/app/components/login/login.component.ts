import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { LoginCredentials } from "./login.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.createLoginForm();
  }

  ngOnInit(): void {
    // Component initialization logic if needed
  }

  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(1)]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;

    try {
      const credentials: LoginCredentials = {
        username: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      const response = await this.authService.login(credentials);

      // Show success alert with response data
      alert(`Login successful! ${response.data}`);

      // Redirect to update profile page
      await this.router.navigate(["/updateprofile"]);
    } catch (error: any) {
      // Show error alert with error message
      alert(error.message || "Login failed. Please try again.");
    } finally {
      this.isLoading = false;
    }
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    // Handle forgot password action
    alert("Forgot password functionality will be implemented soon.");
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}

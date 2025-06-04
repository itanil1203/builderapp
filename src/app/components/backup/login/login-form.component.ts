import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginInputComponent } from "./login-input.component";
import { LoginButtonComponent } from "./login-button.component";

@Component({
  selector: "login-form",
  template: `
    <main class="login-container">
      <section class="login-card">
        <div class="form-wrapper">
          <div class="form-content">
            <form class="login-form">
              <h1 class="login-title">Login</h1>

              <login-input
                label="Email ID"
                type="email"
                placeholder="Value"
                value=""
              ></login-input>

              <login-input
                label="Password"
                type="password"
                placeholder="Value"
                value=""
              ></login-input>

              <a href="#" class="forgot-password">Forgot Password?</a>
              <login-button
                text="Back"
                (buttonClick)="onLogin()"
              ></login-button>
              
              <login-button
                text="Login"
                (buttonClick)="onLogin()"
              ></login-button>
            </form>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        width: 100%;
        background-color: #f8f9fa;
        padding: 27px;
      }
      @media (max-width: 640px) {
        .login-container {
          padding: 16px;
        }
      }
      .login-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 73px;
        border-radius: 18px;
        background-color: #f8f9fa;
        width: 100%;
        max-width: 405px;
        padding: 27px;
      }
      @media (max-width: 640px) {
        .login-card {
          gap: 40px;
          padding: 20px;
        }
      }
      .form-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 61px;
        width: 100%;
      }
      .form-content {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
      }
      .login-form {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        gap: 13px;
      }
      @media (max-width: 640px) {
        .login-form {
          gap: 16px;
        }
      }
      .login-title {
        width: 100%;
        color: #000;
        font-family:
          Inter,
          -apple-system,
          Roboto,
          Helvetica,
          sans-serif;
        font-size: 22px;
        font-weight: 700;
        line-height: 120%;
        margin: 0;
      }
      @media (max-width: 640px) {
        .login-title {
          font-size: 20px;
        }
      }
      .forgot-password {
        width: 100%;
        color: rgba(0, 122, 255, 1);
        font-family:
          Inter,
          -apple-system,
          Roboto,
          Helvetica,
          sans-serif;
        font-size: 13px;
        font-weight: 400;
        text-decoration: none;
      }
      @media (max-width: 640px) {
        .forgot-password {
          font-size: 12px;
        }
      }
      .forgot-password:hover {
        text-decoration: underline;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, LoginInputComponent, LoginButtonComponent],
})
export default class LoginFormComponent {
  onLogin() {
    console.log("Login button clicked");
    // Add login logic here
  }
}

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginComponent } from "./login.component";
import { AuthService } from "./auth.service";
import { LoginResponse } from "./login.model";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj("AuthService", ["login"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(
      AuthService,
    ) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with empty values", () => {
    expect(component.loginForm.get("email")?.value).toBe("");
    expect(component.loginForm.get("password")?.value).toBe("");
  });

  it("should validate email field", () => {
    const emailControl = component.loginForm.get("email");

    emailControl?.setValue("");
    expect(emailControl?.hasError("required")).toBeTruthy();

    emailControl?.setValue("invalid-email");
    expect(emailControl?.hasError("email")).toBeTruthy();

    emailControl?.setValue("test@example.com");
    expect(emailControl?.valid).toBeTruthy();
  });

  it("should validate password field", () => {
    const passwordControl = component.loginForm.get("password");

    passwordControl?.setValue("");
    expect(passwordControl?.hasError("required")).toBeTruthy();

    passwordControl?.setValue("password123");
    expect(passwordControl?.valid).toBeTruthy();
  });

  it("should return true for invalid field when field is invalid and touched", () => {
    const emailControl = component.loginForm.get("email");
    emailControl?.setValue("");
    emailControl?.markAsTouched();

    expect(component.isFieldInvalid("email")).toBeTruthy();
  });

  it("should return false for valid field", () => {
    const emailControl = component.loginForm.get("email");
    emailControl?.setValue("test@example.com");

    expect(component.isFieldInvalid("email")).toBeFalsy();
  });

  it("should not submit form when invalid", async () => {
    component.loginForm.get("email")?.setValue("");
    component.loginForm.get("password")?.setValue("");

    await component.onLogin();

    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it("should submit form and redirect on successful login", async () => {
    const mockResponse: LoginResponse = { data: "Login successful" };
    mockAuthService.login.and.returnValue(Promise.resolve(mockResponse));
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    spyOn(window, "alert");

    component.loginForm.get("email")?.setValue("test@example.com");
    component.loginForm.get("password")?.setValue("password123");

    await component.onLogin();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      username: "test@example.com",
      password: "password123",
    });
    expect(window.alert).toHaveBeenCalledWith(
      "Login successful! Login successful",
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/updateprofile"]);
  });

  it("should show error alert on login failure", async () => {
    const errorMessage = "Invalid credentials";
    mockAuthService.login.and.returnValue(
      Promise.reject(new Error(errorMessage)),
    );

    spyOn(window, "alert");

    component.loginForm.get("email")?.setValue("test@example.com");
    component.loginForm.get("password")?.setValue("wrongpassword");

    await component.onLogin();

    expect(window.alert).toHaveBeenCalledWith(errorMessage);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it("should handle forgot password click", () => {
    const event = new Event("click");
    spyOn(event, "preventDefault");
    spyOn(window, "alert");

    component.onForgotPassword(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      "Forgot password functionality will be implemented soon.",
    );
  });

  it("should set loading state during login", async () => {
    const mockResponse: LoginResponse = { data: "Success" };
    mockAuthService.login.and.returnValue(Promise.resolve(mockResponse));
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    component.loginForm.get("email")?.setValue("test@example.com");
    component.loginForm.get("password")?.setValue("password123");

    expect(component.isLoading).toBeFalsy();

    const loginPromise = component.onLogin();
    expect(component.isLoading).toBeTruthy();

    await loginPromise;
    expect(component.isLoading).toBeFalsy();
  });
});

import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "login-button",
  template: `
    <button class="login-btn" (click)="onClick()" [disabled]="disabled">
      {{ text }}
    </button>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      .login-btn {
        color: rgba(245, 245, 245, 1);
        font-family:
          Inter,
          -apple-system,
          Roboto,
          Helvetica,
          sans-serif;
        font-size: 16px;
        font-weight: 400;
        line-height: 100%;
        width: 100%;
        padding: 12px;
        gap: 8px;
        border-radius: 7px;
        border: 1px solid #374151;
        background-color: #374151;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      @media (max-width: 640px) {
        .login-btn {
          font-size: 14px;
          padding: 14px;
        }
      }
      .login-btn:hover:not(:disabled) {
        background-color: #4b5563;
        border-color: #4b5563;
      }
      .login-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
})
export class LoginButtonComponent {
  @Input() text: string = "Login";
  @Input() disabled: boolean = false;
  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}

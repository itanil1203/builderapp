import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "login-input",
  template: `
    <div class="input-field">
      <label class="input-label">{{ label }}</label>
      <input
        class="input-control"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
      />
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      .input-field {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      .input-label {
        width: 100%;
        color: rgba(30, 30, 30, 1);
        font-family:
          Inter,
          -apple-system,
          Roboto,
          Helvetica,
          sans-serif;
        font-size: 16px;
        font-weight: 400;
        line-height: 140%;
      }
      @media (max-width: 640px) {
        .input-label {
          font-size: 14px;
        }
      }
      .input-control {
        flex: 1;
        color: rgba(30, 30, 30, 1);
        font-family:
          Inter,
          -apple-system,
          Roboto,
          Helvetica,
          sans-serif;
        font-size: 16px;
        font-weight: 400;
        line-height: 100%;
        min-width: 218px;
        padding: 12px 16px;
        width: 100%;
        border-radius: 7px;
        border: 1px solid #d1d5db;
        background-color: #ffffff;
        outline: none;
      }
      @media (max-width: 640px) {
        .input-control {
          font-size: 14px;
          padding: 10px 14px;
        }
      }
      .input-control:focus {
        border-color: #007aff;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
})
export class LoginInputComponent {
  @Input() label: string = "";
  @Input() type: string = "text";
  @Input() placeholder: string = "";
  @Input() value: string = "";
}

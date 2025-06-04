import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserProfile, UpdateProfileRequest } from "./user-profile.interface";

@Component({
  selector: "app-profile-form",
  template: `
    <form
      class="grid gap-5 grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]"
      (ngSubmit)="onSubmit()"
    >
      <div *ngFor="let field of formFields; trackBy: trackByField">
        <label
          class="block mb-2 text-sm text-stone-500"
          [for]="'edit-' + field.name"
        >
          {{ field.label }}
        </label>
        <input
          class="p-2.5 w-full text-base rounded-md border border-solid border-zinc-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          [type]="field.type"
          [value]="field.value"
          [id]="'edit-' + field.name"
          [name]="field.name"
          [attr.aria-label]="'Edit ' + field.label"
          (input)="updateField(field.name, $event)"
        />
      </div>
      <button
        class="p-3 bg-gray-700 rounded-md cursor-pointer border-[none] col-[span_2] duration-[0.2s] text-[white] transition-[background-color] hover:bg-gray-800 max-sm:col-[span_1]"
        type="submit"
        aria-label="Save profile changes"
      >
        Save Changes
      </button>
    </form>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProfileFormComponent implements OnInit {
  @Input() userProfile!: UserProfile;
  @Output() saveChanges = new EventEmitter<UpdateProfileRequest>();

  formData: UpdateProfileRequest = {};

  formFields = [
    { label: "Date of Birth", type: "date", name: "dob", value: "" },
    { label: "Gender", type: "text", name: "gender", value: "" },
    { label: "Contact", type: "tel", name: "contactNumber", value: "" },
    { label: "Address", type: "text", name: "address", value: "" },
  ];

  ngOnInit(): void {
    this.initializeFormData();
  }

  private initializeFormData(): void {
    this.formData = {
      dob: this.userProfile.dob,
      gender: this.userProfile.gender,
      contactNumber: this.userProfile.contactNumber,
      address: this.userProfile.address,
    };

    this.formFields = [
      {
        label: "Date of Birth",
        type: "date",
        name: "dob",
        value: this.userProfile.dob,
      },
      {
        label: "Gender",
        type: "text",
        name: "gender",
        value: this.userProfile.gender,
      },
      {
        label: "Contact",
        type: "tel",
        name: "contactNumber",
        value: this.userProfile.contactNumber,
      },
      {
        label: "Address",
        type: "text",
        name: "address",
        value: this.userProfile.address,
      },
    ];
  }

  updateField(fieldName: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.formData = {
      ...this.formData,
      [fieldName]: value,
    };

    const fieldIndex = this.formFields.findIndex(
      (field) => field.name === fieldName,
    );
    if (fieldIndex !== -1) {
      this.formFields[fieldIndex].value = value;
    }
  }

  onSubmit(): void {
    this.saveChanges.emit(this.formData);
  }

  trackByField(index: number, field: any): string {
    return `edit-field-${index}`;
  }
}

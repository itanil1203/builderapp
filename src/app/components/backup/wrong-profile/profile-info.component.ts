import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserProfile } from "./user-profile.interface";

@Component({
  selector: "app-profile-info",
  template: `
    <section
      class="grid gap-5 grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]"
    >
      <article
        class="p-4 bg-gray-50 rounded-lg"
        *ngFor="let field of profileFields; trackBy: trackByField"
      >
        <h3 class="mb-1.5 text-sm text-stone-500">{{ field.label }}</h3>
        <p class="text-base text-zinc-900">{{ field.value }}</p>
      </article>
    </section>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class ProfileInfoComponent {
  @Input() userProfile!: UserProfile;

  get profileFields() {
    return [
      { label: "Date of Birth", value: this.userProfile.dob },
      { label: "Gender", value: this.userProfile.gender },
      { label: "Contact", value: this.userProfile.contactNumber },
      { label: "Address", value: this.userProfile.address },
    ];
  }

  trackByField(index: number, field: any): string {
    return `profile-field-${index}`;
  }
}

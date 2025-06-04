import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserProfile } from "./user-profile.interface";

@Component({
  selector: "app-profile-header",
  template: `
    <header
      class="flex gap-8 items-center mb-10 max-sm:flex-col max-sm:text-center"
    >
      <figure class="overflow-hidden relative rounded-full h-[150px] w-[150px]">
        <img
          class="object-cover overflow-hidden aspect-square size-full"
          [src]="userProfile.profilePicture"
          [alt]="
            userProfile.firstName +
            ' ' +
            userProfile.lastName +
            ' profile picture'
          "
        />
      </figure>
      <div class="flex-1">
        <h1 class="mb-2.5 text-3xl font-bold text-zinc-900">
          {{ userProfile.firstName }} {{ userProfile.lastName }}
        </h1>
        <p class="mb-5 text-base text-stone-500">{{ userProfile.email }}</p>
        <button
          class="px-5 py-2.5 bg-gray-700 rounded-md cursor-pointer border-[none] duration-[0.2s] text-[white] transition-[background-color] hover:bg-gray-800"
          [attr.aria-label]="
            isEditing ? 'Cancel profile editing' : 'Edit profile information'
          "
          (click)="onToggleEdit()"
        >
          {{ isEditing ? "Cancel Edit" : "Edit Profile" }}
        </button>
      </div>
    </header>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class ProfileHeaderComponent {
  @Input() userProfile!: UserProfile;
  @Input() isEditing = false;
  @Output() toggleEdit = new EventEmitter<void>();

  onToggleEdit(): void {
    this.toggleEdit.emit();
  }
}

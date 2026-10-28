import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Portrait inside a rounded frame with a tilted backing plate and two accent corner brackets. */
@Component({
  selector: 'app-profile-photo',
  imports: [NgOptimizedImage],
  template: `
    <div class="relative isolate mx-auto aspect-square w-full max-w-88">
      <span aria-hidden="true" class="absolute inset-0 -z-10 -rotate-6 scale-[1.04] rounded-3xl bg-accent-soft"></span>
      <span aria-hidden="true" class="absolute -top-3.5 -right-3.5 h-12 w-16 rounded-tr-2xl border-t-2 border-r-2 border-accent"></span>
      <span aria-hidden="true" class="absolute -bottom-3.5 -left-3.5 h-16 w-12 rounded-bl-2xl border-b-2 border-l-2 border-accent"></span>
      <img
        ngSrc="profile_image.webp"
        [alt]="alt()"
        width="538"
        height="464"
        loading="lazy"
        class="size-full rounded-2xl border border-line bg-bg-2 object-cover object-[50%_20%]"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhoto {
  readonly alt = input.required<string>();
}

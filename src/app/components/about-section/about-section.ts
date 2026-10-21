import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { about } from '../../content/about';
import { profile } from '../../content/profile';
import type { Dictionary, Lang } from '../../i18n';
import { Reveal } from '../../shared/reveal.directive';
import { ProfilePhoto } from '../profile-photo/profile-photo';

@Component({
  selector: 'app-about-section',
  imports: [Reveal, ProfilePhoto],
  template: `
    <section id="about" class="page-x section-y grid items-center gap-x-16 gap-y-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div appReveal class="px-4 md:px-0">
        <app-profile-photo [alt]="dict().about.photoAlt + ' ' + profile.name" />
      </div>
      <div class="flex flex-col gap-6">
        <h2 appReveal class="m-0 font-mono text-[13px] font-normal text-mute">{{ dict().sections.about }}</h2>
        <p appReveal class="m-0 max-w-190 text-[clamp(1.375rem,2.6vw,1.875rem)] leading-[1.4] tracking-[-0.015em] text-pretty">
          {{ about.lead[lang()] }}
          <span class="text-fg-2">{{ about.rest[lang()] }}</span>
        </p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutSection {
  readonly lang = input.required<Lang>();
  readonly dict = input.required<Dictionary>();
  protected readonly about = about;
  protected readonly profile = profile;
}

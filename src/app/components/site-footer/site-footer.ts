import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { profile } from '../../content/profile';
import type { Dictionary, Lang } from '../../i18n';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  template: `
    <footer class="border-t border-line-2">
      <div class="page-x flex flex-wrap justify-between gap-3 py-7 font-mono text-xs text-mute">
        <span>© {{ year }} {{ profile.name }} · {{ dict().footer.location }}</span>
        @if (mode() === 'case') {
          <a [href]="'mailto:' + profile.email">{{ profile.email }}</a>
        } @else {
          <a [routerLink]="['/', lang()]">{{ dict().footer.backToTop }} ↑</a>
        }
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  readonly lang = input.required<Lang>();
  readonly dict = input.required<Dictionary>();
  readonly mode = input<'home' | 'case'>('home');
  protected readonly profile = profile;
  protected readonly year = new Date().getFullYear();
}

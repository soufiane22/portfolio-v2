import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Dictionary, Lang } from '../../i18n';
import { LangSwitch } from '../lang-switch/lang-switch';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, LangSwitch, ThemeToggle],
  templateUrl: './site-header.html',
  host: { '(keydown.escape)': 'menuOpen.set(false)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  readonly lang = input.required<Lang>();
  readonly dict = input.required<Dictionary>();
  protected readonly menuOpen = signal(false);
  protected readonly navKeys = ['about', 'experience', 'work', 'skills', 'notes', 'contact'] as const;
}

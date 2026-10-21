import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      type="button"
      (click)="theme.toggle()"
      [attr.aria-label]="label()"
      class="grid size-[34px] cursor-pointer place-items-center rounded-full border border-line bg-transparent font-mono text-sm font-medium"
    >
      <span class="theme-icon-dark" aria-hidden="true">☾</span>
      <span class="theme-icon-light" aria-hidden="true">☀</span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  readonly label = input.required<string>();
}

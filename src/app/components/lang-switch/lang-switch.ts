import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollManager } from '../../core/scroll-manager';
import { LANGS, type Lang } from '../../i18n';

@Component({
  selector: 'app-lang-switch',
  imports: [RouterLink],
  template: `
    <div
      role="group"
      [attr.aria-label]="label()"
      class="flex gap-0.5 rounded-full border border-line p-[3px] font-mono text-xs font-medium"
    >
      @for (l of langs; track l) {
        <a
          [routerLink]="['/', l, ...path()]"
          (click)="scroll.keepPosition()"
          [attr.lang]="l"
          [attr.aria-current]="l === lang() ? 'true' : null"
          class="rounded-full px-2.25 py-1 uppercase"
          [class.bg-line]="l === lang()"
          >{{ l }}</a
        >
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitch {
  readonly lang = input.required<Lang>();
  readonly label = input.required<string>();
  /** Route segments after the language, so switching language keeps the current page. */
  readonly path = input<readonly string[]>([]);
  protected readonly langs = LANGS;
  /** Switching language must not move the page. */
  protected readonly scroll = inject(ScrollManager);
}

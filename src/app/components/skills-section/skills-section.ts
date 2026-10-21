import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { skills, type SkillGroup } from '../../content/skills';
import type { Dictionary, Lang } from '../../i18n';
import { Reveal } from '../../shared/reveal.directive';

const CHIP_CLASS: Record<SkillGroup['level'], string> = {
  daily: 'bg-accent px-3.25 py-1.75 text-accent-ink',
  solid: 'border border-accent px-3 py-1.5 text-fg',
  working: 'border border-line px-3 py-1.5 text-fg-2',
};

@Component({
  selector: 'app-skills-section',
  imports: [Reveal],
  template: `
    <section id="skills" class="border-t border-line-2">
      <div class="page-x section-y flex flex-wrap gap-x-12 gap-y-6">
        <p class="m-0 flex-none basis-50 font-mono text-[13px] text-mute">{{ dict().sections.skills }}</p>
        <div class="max-w-215 flex-[1_1_520px]">
          <h2 appReveal class="display-h2 mb-10">{{ dict().headings.skills }}</h2>
          <div class="flex flex-col border-t border-line">
            @for (group of groups; track group.level) {
              <div appReveal class="flex flex-wrap gap-x-8 gap-y-3 border-b border-line py-6.5">
                <div class="flex basis-45 flex-none flex-col gap-1">
                  <h3 class="m-0 text-[22px] font-semibold tracking-[-0.02em]">{{ group.title[lang()] }}</h3>
                  <p class="m-0 font-mono text-xs text-mute">{{ group.hint[lang()] }}</p>
                </div>
                <ul class="m-0 flex flex-[1_1_300px] list-none flex-wrap content-start gap-2 p-0 font-mono text-sm">
                  @for (item of group.items; track item) {
                    <li class="rounded-full" [class]="chipClass[group.level]">{{ item }}</li>
                  }
                </ul>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsSection {
  readonly lang = input.required<Lang>();
  readonly dict = input.required<Dictionary>();
  protected readonly groups = skills;
  protected readonly chipClass = CHIP_CLASS;
}

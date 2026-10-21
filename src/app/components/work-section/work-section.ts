import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { projects } from '../../content/projects';
import type { Dictionary, Lang } from '../../i18n';
import { Reveal } from '../../shared/reveal.directive';
import { ProjectCard } from '../project-card/project-card';

@Component({
  selector: 'app-work-section',
  imports: [ProjectCard, Reveal],
  template: `
    <section id="work" class="border-t border-line-2">
      <div class="page-x section-y">
        <div class="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div appReveal class="flex flex-col gap-3.5">
            <p class="m-0 font-mono text-[13px] text-mute">{{ dict().sections.work }}</p>
            <h2 class="display-h2">{{ dict().headings.work }}</h2>
          </div>
          <p appReveal class="m-0 max-w-95 text-base leading-[1.5] text-fg-2">{{ dict().work.intro }}</p>
        </div>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] gap-5">
          @for (project of projects; track project.id) {
            <app-project-card [project]="project" [lang]="lang()" [dict]="dict()" />
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkSection {
  readonly lang = input.required<Lang>();
  readonly dict = input.required<Dictionary>();
  protected readonly projects = projects;
}

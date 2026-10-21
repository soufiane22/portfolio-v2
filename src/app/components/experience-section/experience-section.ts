import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { experience, todoSummary } from '../../content/experience';
import type { Dictionary, Lang } from '../../i18n';
import { Reveal } from '../../shared/reveal.directive';

@Component({
  selector: 'app-experience-section',
  imports: [Reveal],
  templateUrl: './experience-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceSection {
  readonly lang = input.required<Lang>();
  readonly dict = input.required<Dictionary>();
  protected readonly jobs = experience;
  protected readonly todoSummary = todoSummary;
}

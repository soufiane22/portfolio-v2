import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Project } from '../../content/projects';
import type { Dictionary, Lang } from '../../i18n';
import { Reveal } from '../../shared/reveal.directive';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink, Reveal],
  templateUrl: './project-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  readonly project = input.required<Project>();
  readonly lang = input.required<Lang>();
  readonly dict = input.required<Dictionary>();
}

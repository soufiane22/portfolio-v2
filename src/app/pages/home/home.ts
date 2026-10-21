import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AboutSection } from '../../components/about-section/about-section';
import { ContactSection } from '../../components/contact-section/contact-section';
import { ExperienceSection } from '../../components/experience-section/experience-section';
import { Hero } from '../../components/hero/hero';
import { NotesSection } from '../../components/notes-section/notes-section';
import { SiteFooter } from '../../components/site-footer/site-footer';
import { SiteHeader } from '../../components/site-header/site-header';
import { SkillsSection } from '../../components/skills-section/skills-section';
import { WorkSection } from '../../components/work-section/work-section';
import { Seo } from '../../core/seo.service';
import { dictionaries, type Lang } from '../../i18n';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    SiteHeader,
    Hero,
    AboutSection,
    ExperienceSection,
    WorkSection,
    SkillsSection,
    NotesSection,
    ContactSection,
    SiteFooter,
  ],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  /** Bound from the `:lang` route parameter. */
  readonly lang = input.required<Lang>();
  protected readonly dict = computed(() => dictionaries[this.lang()]);
  private readonly seo = inject(Seo);

  constructor() {
    effect(() => this.seo.update(this.lang(), this.dict().meta.title, this.dict().meta.description));
  }
}

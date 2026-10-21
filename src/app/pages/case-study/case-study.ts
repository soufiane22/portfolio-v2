import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArchitectureFigure } from '../../components/architecture-figure/architecture-figure';
import { LangSwitch } from '../../components/lang-switch/lang-switch';
import { ScreenGallery } from '../../components/screen-gallery/screen-gallery';
import { VideoEmbed } from '../../components/video-embed/video-embed';
import { SiteFooter } from '../../components/site-footer/site-footer';
import { ThemeToggle } from '../../components/theme-toggle/theme-toggle';
import { caseStudies, findCaseStudy, type CaseStudy } from '../../content/case-studies';
import { Seo } from '../../core/seo.service';
import { dictionaries, type Lang } from '../../i18n';

/** Page sections in display order. Optional ones are skipped when the case study lacks them. */
const SECTION_ORDER = [
  'media',
  'problem',
  'context',
  'flow',
  'architecture',
  'modules',
  'rules',
  'decision',
  'challenges',
  'patterns',
  'contribution',
  'result',
  'stack',
] as const;
type SectionKey = (typeof SECTION_ORDER)[number];

const isPresent = (study: CaseStudy, key: SectionKey): boolean => {
  switch (key) {
    case 'media':
      return !!(study.media?.video || study.media?.gallery?.items.length);
    case 'flow':
      return !!study.flow?.steps.length;
    case 'modules':
    case 'rules':
    case 'challenges':
    case 'patterns':
      return !!study[key]?.length;
    case 'contribution':
      return !!study.contribution;
    default:
      return true;
  }
};

@Component({
  selector: 'app-case-study-page',
  imports: [RouterLink, LangSwitch, ThemeToggle, SiteFooter, ArchitectureFigure, VideoEmbed, ScreenGallery],
  templateUrl: './case-study.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseStudyPage {
  /** Bound from the `:lang` route parameter. */
  readonly lang = input.required<Lang>();
  /** Bound from the `:slug` route parameter; validated by `caseStudyGuard`. */
  readonly slug = input.required<string>();

  protected readonly dict = computed(() => dictionaries[this.lang()]);
  protected readonly study = computed(() => findCaseStudy(this.slug()));
  protected readonly next = computed(() => {
    const index = caseStudies.findIndex((c) => c.slug === this.slug());
    return index >= 0 ? (caseStudies[index + 1] ?? null) : null;
  });
  protected readonly langPath = computed(() => ['work', this.slug()]);
  protected readonly decisionAfter = computed(() => this.study()?.decision.after?.[this.lang()] ?? '');

  /** "01 — Problem", "02 — Context"… numbered over the sections this case study actually has. */
  protected readonly label = computed(() => {
    const study = this.study();
    const names = this.dict().caseStudy;
    const labels = {} as Record<SectionKey, string>;
    if (!study) return labels;
    SECTION_ORDER.filter((key) => isPresent(study, key)).forEach((key, i) => {
      labels[key] = `${String(i + 1).padStart(2, '0')} — ${names[key]}`;
    });
    return labels;
  });

  private readonly seo = inject(Seo);

  constructor() {
    effect(() => {
      const study = this.study();
      if (!study) return;
      this.seo.update(this.lang(), `${study.title[this.lang()]} — ${study.org}`, study.problem[this.lang()]);
    });
  }
}

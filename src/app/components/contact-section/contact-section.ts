import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { profile } from '../../content/profile';
import { buildWhatsappUrl } from '../../core/whatsapp';
import type { Dictionary, Lang } from '../../i18n';
import { Reveal } from '../../shared/reveal.directive';

/** Builds the mailto link. Exported for unit tests. */
export function buildMailto(email: string, subject: string, name: string, from: string, message: string): string {
  const body = `${message}\n\n— ${name} (${from})`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

@Component({
  selector: 'app-contact-section',
  imports: [Reveal],
  templateUrl: './contact-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSection {
  readonly lang = input.required<Lang>();
  readonly dict = input.required<Dictionary>();
  protected readonly profile = profile;
  protected readonly sent = signal(false);
  protected readonly whatsappUrl = computed(() => buildWhatsappUrl(profile.phone, this.dict().contact.whatsappMessage));
  private readonly doc = inject(DOCUMENT);

  // TODO: static hosting has no backend, so the form opens the visitor's mail client.
  // Swap for a real endpoint (e.g. a Vercel function) if one is wanted.
  protected submit(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const field = (key: string): string => String(data.get(key) ?? '').trim();
    const url = buildMailto(
      profile.email,
      `${this.dict().contact.subject} — ${field('name')}`,
      field('name'),
      field('email'),
      field('message'),
    );
    this.doc.defaultView?.location.assign(url);
    this.sent.set(true);
  }
}

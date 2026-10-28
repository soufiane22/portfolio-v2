import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { profile } from '../../content/profile';
import { sendContactMessage } from '../../core/contact-form';
import { buildWhatsappUrl } from '../../core/whatsapp';
import type { Dictionary, Lang } from '../../i18n';
import { Reveal } from '../../shared/reveal.directive';

/** Builds the mailto link offered when sending fails. Exported for unit tests. */
export function buildMailto(email: string, subject: string, name: string, from: string, message: string): string {
  const body = `${message}\n\n— ${name} (${from})`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

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
  protected readonly status = signal<Status>('idle');
  /** Mail-client fallback carrying what the visitor typed, shown when sending fails. */
  protected readonly fallbackUrl = signal(`mailto:${profile.email}`);
  protected readonly whatsappUrl = computed(() => buildWhatsappUrl(profile.phone, this.dict().contact.whatsappMessage));

  protected async submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (this.status() === 'sending') return;
    const data = new FormData(event.target as HTMLFormElement);
    const field = (key: string): string => String(data.get(key) ?? '').trim();
    const subject = `${this.dict().contact.subject} — ${field('name')}`;

    this.status.set('sending');
    const ok = await sendContactMessage({
      name: field('name'),
      email: field('email'),
      message: field('message'),
      subject,
      botcheck: field('botcheck'),
    });
    if (!ok) {
      this.fallbackUrl.set(buildMailto(profile.email, subject, field('name'), field('email'), field('message')));
    }
    this.status.set(ok ? 'sent' : 'error');
  }
}

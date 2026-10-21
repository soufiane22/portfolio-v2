import { profile } from '../content/profile';
import { buildWhatsappUrl } from './whatsapp';

describe('buildWhatsappUrl', () => {
  it('keeps digits only in the number and encodes the message', () => {
    expect(buildWhatsappUrl('+212 6 41 18 56 80', 'Hi & hello')).toBe('https://wa.me/212641185680?text=Hi%20%26%20hello');
  });

  it('works with the number stored in the profile', () => {
    expect(buildWhatsappUrl(profile.phone, 'x')).toMatch(/^https:\/\/wa\.me\/\d{8,15}\?text=x$/);
  });
});

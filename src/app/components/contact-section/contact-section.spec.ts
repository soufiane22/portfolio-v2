import { buildMailto } from './contact-section';

describe('buildMailto', () => {
  it('encodes subject and body so special characters survive', () => {
    const url = buildMailto('me@example.com', 'Hi & hello', 'Ana', 'ana@x.io', 'Line 1\nLine 2');
    expect(url.startsWith('mailto:me@example.com?subject=Hi%20%26%20hello&body=')).toBe(true);
    expect(decodeURIComponent(url.split('body=')[1])).toBe('Line 1\nLine 2\n\n— Ana (ana@x.io)');
  });
});

import { buildPayload, sendContactMessage, WEB3FORMS_ACCESS_KEY, WEB3FORMS_ENDPOINT, type ContactMessage } from './contact-form';

const msg: ContactMessage = {
  name: 'Ana',
  email: 'ana@x.io',
  message: 'Hello',
  subject: 'Portfolio contact — Ana',
  botcheck: '',
};

function fakeFetch(status: number, body: unknown): { fn: typeof fetch; calls: [RequestInfo | URL, RequestInit | undefined][] } {
  const calls: [RequestInfo | URL, RequestInit | undefined][] = [];
  const fn = ((input: RequestInfo | URL, init?: RequestInit) => {
    calls.push([input, init]);
    return Promise.resolve(new Response(JSON.stringify(body), { status }));
  }) as typeof fetch;
  return { fn, calls };
}

describe('contact form', () => {
  it('builds the Web3Forms payload with the access key and a reply-to address', () => {
    expect(buildPayload(msg)).toEqual({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: 'Portfolio contact — Ana',
      from_name: 'Ana',
      name: 'Ana',
      email: 'ana@x.io',
      replyto: 'ana@x.io',
      message: 'Hello',
      botcheck: false,
    });
    expect(buildPayload({ ...msg, botcheck: '1' })['botcheck']).toBe(true);
  });

  it('posts JSON to Web3Forms and resolves true on success', async () => {
    const { fn, calls } = fakeFetch(200, { success: true });
    expect(await sendContactMessage(msg, fn)).toBe(true);
    expect(calls[0][0]).toBe(WEB3FORMS_ENDPOINT);
    expect(calls[0][1]?.method).toBe('POST');
    expect(JSON.parse(String(calls[0][1]?.body)).message).toBe('Hello');
  });

  it('resolves false when Web3Forms rejects the message or the network fails', async () => {
    expect(await sendContactMessage(msg, fakeFetch(400, { success: false }).fn)).toBe(false);
    const offline = (() => Promise.reject(new TypeError('offline'))) as typeof fetch;
    expect(await sendContactMessage(msg, offline)).toBe(false);
  });
});

// Contact form delivery through Web3Forms (same account as the previous portfolio).
// The access key only allows sending to the owner's inbox, so it is meant to be public.
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
export const WEB3FORMS_ACCESS_KEY = '139266ca-09b8-46c9-8f03-d37acfbd777e';

export interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly subject: string;
  /** Honeypot: real visitors leave it empty; Web3Forms drops the submission otherwise. */
  readonly botcheck: string;
}

interface Web3FormsResponse {
  readonly success: boolean;
  readonly message?: string;
}

/** Builds the JSON payload Web3Forms expects. Exported for unit tests. */
export function buildPayload(msg: ContactMessage): Record<string, string | boolean> {
  return {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: msg.subject,
    from_name: msg.name,
    name: msg.name,
    email: msg.email,
    // Lets "Reply" in the inbox answer the visitor directly.
    replyto: msg.email,
    message: msg.message,
    botcheck: msg.botcheck !== '',
  };
}

/** Sends the message; resolves to `true` only when Web3Forms confirms delivery. */
export async function sendContactMessage(msg: ContactMessage, fetchFn: typeof fetch = fetch): Promise<boolean> {
  try {
    const res = await fetchFn(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(buildPayload(msg)),
    });
    const json = (await res.json()) as Web3FormsResponse;
    return res.ok && json.success;
  } catch {
    return false;
  }
}

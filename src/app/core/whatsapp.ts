/**
 * Builds a click-to-chat WhatsApp link from a phone number in international format.
 * Spaces, dashes, parentheses and the leading "+" are stripped: wa.me wants digits only.
 */
export function buildWhatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

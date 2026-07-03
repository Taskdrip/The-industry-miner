/**
 * Formats a Kobo amount (1/100 of a Naira) as a Nigerian Naira string.
 * e.g. 6900000 kobo → "₦69,000"
 */
export function formatNairaFromKobo(kobo: number): string {
  const naira = kobo / 100;
  return `₦${new Intl.NumberFormat("en-NG").format(naira)}`;
}

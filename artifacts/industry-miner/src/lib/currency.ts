export function formatNaira(cents: number): string {
  return `₦${(cents / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

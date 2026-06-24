// Founder Edition number formatting.
//
// Rules:
//   1    => "0001"
//   25   => "0025"
//   250  => "0250"
//   1000 => "1000"
//
// Anything non-numeric, null, undefined, empty, or <= 0 returns "" (blank) so
// the 3D patch shows no number rather than a misleading placeholder.
export function formatFounderNumber(value?: number | string | null): string {
  if (value === null || value === undefined || value === "") return "";
  const n =
    typeof value === "number"
      ? value
      : parseInt(String(value).replace(/[^0-9]/g, ""), 10);
  if (!Number.isFinite(n) || n <= 0) return "";
  return String(Math.trunc(n)).padStart(4, "0");
}

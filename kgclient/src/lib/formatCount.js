// Formats a raw count into a compact display string, e.g. 1234 -> "1.2K",
// 1000000 -> "1M". Used anywhere real stats are shown so large real numbers
// still look clean, without ever inventing a number that isn't real.
export function formatCount(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '0'
  if (n < 1000) return String(n)
  if (n < 1_000_000) {
    const k = n / 1000
    return `${k % 1 === 0 ? k : k.toFixed(1)}K`
  }
  const m = n / 1_000_000
  return `${m % 1 === 0 ? m : m.toFixed(1)}M`
}

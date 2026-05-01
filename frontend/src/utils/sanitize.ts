/**
 * Validates and sanitises a CSS colour string coming from the database before
 * rendering it in an inline style, preventing CSS injection attacks.
 *
 * Accepted formats:
 *   - Hex colours:   #RGB  #RGBA  #RRGGBB  #RRGGBBAA
 *   - Named colours: alphabetic, max 30 chars (e.g. "red", "cornflowerblue")
 *
 * Everything else is replaced with the provided fallback.
 */
export function sanitizeCssColor(
  color: string | undefined | null,
  fallback = '#10b981',
): string {
  if (!color) return fallback
  const trimmed = color.trim()
  if (/^#[0-9A-Fa-f]{3,8}$/.test(trimmed)) return trimmed
  if (/^[a-zA-Z]{1,30}$/.test(trimmed)) return trimmed
  return fallback
}

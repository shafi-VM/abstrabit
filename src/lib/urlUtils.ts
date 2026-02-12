/**
 * Normalize URL for comparison
 * - Converts to lowercase
 * - Ensures protocol
 * - Removes trailing slashes
 * - Removes www prefix for consistency
 */
export function normalizeUrl(url: string): string {
  try {
    let normalized = url.trim().toLowerCase()

    // Add protocol if missing
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = 'https://' + normalized
    }

    const urlObj = new URL(normalized)

    // Remove www prefix for consistency
    const host = urlObj.hostname.replace(/^www\./, '')

    // Reconstruct URL without trailing slash
    let result = `${urlObj.protocol}//${host}${urlObj.pathname}`

    // Remove trailing slash unless it's the root path
    if (result.endsWith('/') && urlObj.pathname !== '/') {
      result = result.slice(0, -1)
    }

    // Add search params if present
    if (urlObj.search) {
      result += urlObj.search
    }

    return result
  } catch {
    return url.trim().toLowerCase()
  }
}

/**
 * Check if two URLs are the same (ignoring case, www, trailing slashes)
 */
export function isSameUrl(url1: string, url2: string): boolean {
  return normalizeUrl(url1) === normalizeUrl(url2)
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const normalized = url.trim()
    if (!normalized) return false

    // Add protocol if missing for validation
    const testUrl = normalized.startsWith('http://') || normalized.startsWith('https://')
      ? normalized
      : 'https://' + normalized

    new URL(testUrl)
    return true
  } catch {
    return false
  }
}

/**
 * Truncate text to max length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

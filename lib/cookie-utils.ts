/**
 * Utility functions for handling cookies safely
 */

/**
 * Determines if a string looks like a JWT token
 * JWT tokens have 3 parts separated by dots and consist of base64url encoded strings
 * 
 * @param value - The string to check
 * @returns True if the string appears to be a JWT token
 */
function isJwtToken(value: string): boolean {
  // JWT pattern: 3 base64url encoded parts separated by dots
  const jwtPattern = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
  return jwtPattern.test(value);
}

/**
 * Sanitizes cookie values to ensure they don't contain characters that
 * could cause issues with cookie parsing (like double quotes)
 * 
 * @param value - The cookie value to sanitize
 * @returns A sanitized version of the cookie value
 */
export function sanitizeCookieValue(value: string | undefined): string {
  if (!value) return '';
  
  // First check if this looks like a JWT token, and if so, use extractJwtToken
  if (value.includes('.')) {
    // Look for the JWT pattern (3 segments separated by dots)
    const jwtRegex = /([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)/g;
    const matches = [...value.matchAll(jwtRegex)];
    
    if (matches.length > 0) {
      // Sort matches by length in descending order to get the most complete JWT
      matches.sort((a, b) => b[0].length - a[0].length);
      return matches[0][0];
    }
  }
  
  // For non-JWT values, remove problematic characters:
  // - Double quotes (ASCII 34) - the specific character causing our OAuth issue
  // - Semicolons - would break cookie string
  // - Commas - can cause issues in some contexts
  // - Backslashes - can cause escaping issues
  return value
    .replace(/"/g, '') // Remove double quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/,/g, '') // Remove commas
    .replace(/\\/g, '') // Remove backslashes
    .trim(); // Remove leading/trailing whitespace
}

/**
 * Extracts a JWT token from a potentially malformed string
 * This handles cases where the JWT token might be wrapped in quotes or have extra characters
 * 
 * @param value - The potentially malformed JWT string
 * @returns The extracted JWT token or the sanitized original value if no JWT pattern is found
 */
export function extractJwtToken(value: string | undefined): string {
  if (!value) return '';
  
  // First, try to extract a complete JWT token (all three parts)
  // Match exactly 3 parts of base64url format with dot separators
  const jwtRegex = /([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)/g;
  const matches = [...value.matchAll(jwtRegex)];
  
  // Find the longest match if multiple exist (most likely to be a complete JWT)
  if (matches.length > 0) {
    // Sort matches by length in descending order
    matches.sort((a, b) => b[0].length - a[0].length);
    return matches[0][0];
  }
  
  // If no JWT pattern is found, just apply normal sanitization
  return value
    .replace(/"/g, '')
    .replace(/;/g, '')
    .replace(/,/g, '')
    .replace(/\\/g, '')
    .trim();
}

/**
 * Safely sets a cookie with a sanitized value
 * Special handling for auth tokens to preserve JWT format
 * 
 * @param name - Cookie name
 * @param value - Cookie value (will be sanitized)
 * @param options - Cookie options
 */
export function setCookieSafely(
  Cookies: any, // js-cookie library
  name: string, 
  value: string | undefined,
  options?: any
): void {
  if (!Cookies || !name) return;
  
  // Special handling for known auth token cookies to preserve JWT format
  if (name === 'auth-token' || name === 'authToken' || name.toLowerCase().includes('jwt')) {
    // Extract JWT if present, otherwise sanitize normally
    const cleanValue = extractJwtToken(value);
    Cookies.set(name, cleanValue, options);
    return;
  }
  
  // Normal sanitization for other cookies
  const sanitizedValue = sanitizeCookieValue(value);
  Cookies.set(name, sanitizedValue, options);
}

/**
 * Get a cookie and parse it safely
 * 
 * @param name - Cookie name
 * @returns The cookie value or undefined if not found
 */
export function getCookieSafely(
  Cookies: any, // js-cookie library
  name: string
): string | undefined {
  if (!Cookies || !name) return undefined;
  
  try {
    return Cookies.get(name);
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return undefined;
  }
}

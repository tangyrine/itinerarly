
function sanitizeCookieValue(value) {
  if (!value) return '';

  if (value.includes('.')) {
    const jwtRegex = /([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)/g;
    const matches = [...value.matchAll(jwtRegex)];
    
    if (matches.length > 0) {
      matches.sort((a, b) => b[0].length - a[0].length);
      return matches[0][0];
    }
  }
  
  return value
    .replace(/"/g, '') 
    .replace(/;/g, '') 
    .replace(/,/g, '') 
    .replace(/\\/g, '') 
    .trim(); 
}

function extractJwtToken(value) {
  if (!value) return '';
  
  const jwtRegex = /([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)/g;
  const matches = [...value.matchAll(jwtRegex)];

  if (matches.length > 0) {
    matches.sort((a, b) => b[0].length - a[0].length);
    return matches[0][0];
  }

  return value
    .replace(/"/g, '')
    .replace(/;/g, '')
    .replace(/,/g, '')
    .replace(/\\/g, '')
    .trim();
}

function setCookieSafely(Cookies, name, value, options) {
  if (!Cookies || !name) return;
  
  if (name === 'auth-token' || name === 'authToken' || name.toLowerCase().includes('jwt')) {
    const cleanValue = extractJwtToken(value);
    Cookies.set(name, cleanValue, options);
    return;
  }
  
  const sanitizedValue = sanitizeCookieValue(value);
  Cookies.set(name, sanitizedValue, options);
}

function getCookieSafely(Cookies, name) {
  if (!Cookies || !name) return undefined;
  
  try {
    return Cookies.get(name);
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return undefined;
  }
}

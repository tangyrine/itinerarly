// Test cookie sanitization
// Create a simplified version of the cookie sanitization function for testing
function sanitizeCookieValue(value) {
  if (!value) return '';
  
  return value
    .replace(/"/g, '') // Remove double quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/,/g, '') // Remove commas
    .replace(/\\/g, '') // Remove backslashes
    .trim(); // Remove leading/trailing whitespace
}

// Test with various problematic values
const testValues = {
  'normal': 'simple-value',
  'with-quotes': '"quoted-value"',
  'with-semicolons': 'value;with;semicolons',
  'with-commas': 'value,with,commas',
  'with-backslashes': 'value\\with\\backslashes',
  'complex': '"complex;value,with\\all"characters'
};

console.log('Cookie Sanitization Test Results:');
console.log('=================================');

for (const [name, value] of Object.entries(testValues)) {
  const sanitized = sanitizeCookieValue(value);
  console.log(`${name}: "${value}" → "${sanitized}"`);
}

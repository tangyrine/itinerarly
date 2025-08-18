#!/bin/bash

# Test script to verify the cookie handling updates

echo "🍪 Testing Cookie Handling Updates"
echo "==================================="

# Check if all required files exist
echo "Checking for required files..."
FILES_TO_CHECK=(
  "./lib/cookie-utils.ts"
  "./components/Navbar.tsx"
  "./components/StateDetailsModal.tsx"
  "./lib/debug-auth.ts"
  "./public/cookie-utils.js"
  "./public/auth-test.html"
)

for file in "${FILES_TO_CHECK[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Missing file: $file"
    exit 1
  fi
  echo "✅ Found $file"
done

# Check for getCookieSafely usage in updated components
echo -e "\nChecking for getCookieSafely in components..."
grep -q "getCookieSafely" ./components/Navbar.tsx
if [ $? -eq 0 ]; then
  echo "✅ Navbar.tsx is using getCookieSafely"
else
  echo "❌ Navbar.tsx is NOT using getCookieSafely"
fi

grep -q "getCookieSafely" ./components/StateDetailsModal.tsx
if [ $? -eq 0 ]; then
  echo "✅ StateDetailsModal.tsx is using getCookieSafely"
else
  echo "❌ StateDetailsModal.tsx is NOT using getCookieSafely"
fi

grep -q "getCookieSafely" ./lib/debug-auth.ts
if [ $? -eq 0 ]; then
  echo "✅ debug-auth.ts is using getCookieSafely"
else
  echo "❌ debug-auth.ts is NOT using getCookieSafely"
fi

# Check for cookie-utils.js usage in auth-test.html
echo -e "\nChecking for cookie-utils.js in auth-test.html..."
grep -q "cookie-utils.js" ./public/auth-test.html
if [ $? -eq 0 ]; then
  echo "✅ auth-test.html is including cookie-utils.js"
else
  echo "❌ auth-test.html is NOT including cookie-utils.js"
fi

grep -q "setCookieSafely" ./public/auth-test.html
if [ $? -eq 0 ]; then
  echo "✅ auth-test.html is using setCookieSafely"
else
  echo "❌ auth-test.html is NOT using setCookieSafely"
fi

# Test token extraction with problematic values
echo -e "\nTesting JWT token extraction with problematic values..."
node -e "
const { extractJwtToken } = require('./lib/cookie-utils');

const testCases = [
  { 
    input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    expectedOutput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Clean JWT token'
  },
  { 
    input: '\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\"',
    expectedOutput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT with double quotes'
  },
  { 
    input: 'something=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    expectedOutput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT with prefix'
  }
];

let passed = 0;
let failed = 0;

testCases.forEach(test => {
  const result = extractJwtToken(test.input);
  if (result === test.expectedOutput) {
    console.log(`✅ PASSED: ${test.description}`);
    passed++;
  } else {
    console.log(`❌ FAILED: ${test.description}`);
    console.log(`  Expected: ${test.expectedOutput}`);
    console.log(`  Got:      ${result}`);
    failed++;
  }
});

console.log(\`\nTests completed: \${passed} passed, \${failed} failed\`);
"

echo -e "\n🎉 Cookie handling verification completed!"

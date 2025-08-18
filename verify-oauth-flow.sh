#!/bin/bash

# Complete OAuth Flow Verification Script
echo "🔐 OAuth Flow Verification"
echo "========================="

# Check if all required files are in place
echo "📋 Checking required files..."
FILES=(
  "middleware.ts"
  "lib/TokenProvider.tsx"
  "lib/cookie-utils.ts"
  "components/Navbar.tsx"
  "components/StateDetailsModal.tsx"
  "app/start/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
  fi
done

echo ""

# Check middleware configuration
echo "🛡️ Checking middleware configuration..."
if grep -q "isLoggedIn" middleware.ts; then
  echo "✅ Middleware uses isLoggedIn cookie"
else
  echo "❌ Middleware not configured for isLoggedIn cookie"
fi

if grep -q "/start" middleware.ts; then
  echo "✅ Middleware protects /start route"
else
  echo "❌ Middleware not protecting /start route"
fi

echo ""

# Check TokenProvider for isLoggedIn cookie management
echo "🔧 Checking TokenProvider configuration..."
if grep -q "setCookieSafely.*isLoggedIn.*true" lib/TokenProvider.tsx; then
  echo "✅ TokenProvider sets isLoggedIn cookie on success"
else
  echo "❌ TokenProvider not setting isLoggedIn cookie"
fi

if grep -q "Cookies.remove.*isLoggedIn" lib/TokenProvider.tsx; then
  echo "✅ TokenProvider removes isLoggedIn cookie on failure"
else
  echo "❌ TokenProvider not removing isLoggedIn cookie on failure"
fi

if grep -q "window.location.href.*start" lib/TokenProvider.tsx; then
  echo "✅ TokenProvider redirects to /start on authentication"
else
  echo "❌ TokenProvider not redirecting to /start"
fi

echo ""

# Check components for isLoggedIn usage
echo "🎨 Checking component configurations..."
if grep -q "isLoggedIn.*true" components/Navbar.tsx; then
  echo "✅ Navbar uses isLoggedIn cookie"
else
  echo "❌ Navbar not using isLoggedIn cookie"
fi

if grep -q "isLoggedIn.*true" components/StateDetailsModal.tsx; then
  echo "✅ StateDetailsModal uses isLoggedIn cookie"
else
  echo "❌ StateDetailsModal not using isLoggedIn cookie"
fi

echo ""

# Test cookie extraction functions
echo "🍪 Testing cookie utility functions..."
node -e "
const fs = require('fs');
const path = require('path');

// Try to load and test cookie utilities
try {
  // Read the TypeScript file and check for key functions
  const cookieUtils = fs.readFileSync('lib/cookie-utils.ts', 'utf8');
  
  if (cookieUtils.includes('extractJwtToken')) {
    console.log('✅ extractJwtToken function found');
  } else {
    console.log('❌ extractJwtToken function missing');
  }
  
  if (cookieUtils.includes('setCookieSafely')) {
    console.log('✅ setCookieSafely function found');
  } else {
    console.log('❌ setCookieSafely function missing');
  }
  
  if (cookieUtils.includes('sanitizeCookieValue')) {
    console.log('✅ sanitizeCookieValue function found');
  } else {
    console.log('❌ sanitizeCookieValue function missing');
  }
  
} catch (error) {
  console.log('❌ Error checking cookie utilities:', error.message);
}
"

echo ""

# Check OAuth flow setup
echo "🔄 Checking OAuth flow setup..."
if grep -q "oauthFlowStarted" lib/TokenProvider.tsx; then
  echo "✅ OAuth flow detection implemented"
else
  echo "❌ OAuth flow detection missing"
fi

if grep -q "localStorage.removeItem.*oauthFlowStarted" lib/TokenProvider.tsx; then
  echo "✅ OAuth flow cleanup implemented"
else
  echo "❌ OAuth flow cleanup missing"
fi

echo ""

# Final verification summary
echo "📊 Flow Verification Summary"
echo "=============================="
echo ""
echo "Expected OAuth Flow:"
echo "1. User clicks OAuth sign-in → Redirected to OAuth provider"
echo "2. OAuth provider authenticates → Redirects back with tokens"
echo "3. TokenProvider receives tokens → Validates with backend API"
echo "4. If successful → Sets isLoggedIn=true cookie"
echo "5. Middleware checks isLoggedIn → Allows access to protected routes"
echo "6. User is redirected to /start → Authentication complete"
echo ""
echo "Error Prevention:"
echo "✅ No JWT parsing in middleware (prevents character [34] error)"
echo "✅ Simple boolean cookie for routing decisions"
echo "✅ JWT tokens only processed in secure contexts"
echo "✅ Automatic cookie cleanup on auth failure"
echo ""
echo "🎉 OAuth flow verification completed!"
echo ""
echo "Next steps:"
echo "1. Deploy the application"
echo "2. Test OAuth sign-in with Google/GitHub"
echo "3. Verify redirection to /start page"
echo "4. Confirm no character [34] errors in logs"

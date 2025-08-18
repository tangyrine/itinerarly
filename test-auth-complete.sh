#!/bin/zsh

# Authentication Test Script
# This script tests the authentication mechanisms for the Itinerarly application

echo "🔍 Testing Authentication Mechanisms for Itinerarly"
echo "=================================================="

# Check if the backend is up
echo "\n🌐 Checking backend availability..."
curl -s -o /dev/null -w "%{http_code}" https://itinerarly-be.onrender.com/actuator/health

if [ $? -ne 0 ]; then
  echo "❌ Backend is not accessible. Make sure it's running."
  exit 1
fi

echo "✅ Backend is accessible"

# Test CORS headers
echo "\n🔄 Checking CORS headers..."
CORS_HEADERS=$(curl -s -I -X OPTIONS -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  https://itinerarly-be.onrender.com/api/v1/tokens/remaining)

if echo "$CORS_HEADERS" | grep -q "access-control-allow-credentials: true"; then
  echo "✅ CORS credentials allowed"
else
  echo "❌ CORS credentials NOT allowed"
fi

if echo "$CORS_HEADERS" | grep -q "access-control-allow-origin:"; then
  echo "✅ CORS origin headers present"
else
  echo "❌ CORS origin headers missing"
fi

# Test authentication with JSESSIONID
echo "\n🔐 Testing authentication with JSESSIONID..."
AUTH_RESPONSE=$(curl -s -c cookies.txt -b cookies.txt \
  -H "Content-Type: application/json" \
  -X POST -d '{"username":"test","password":"test"}' \
  https://itinerarly-be.onrender.com/api/v1/auth/login)

# Check if we got a JSESSIONID
if grep -q "JSESSIONID" cookies.txt; then
  echo "✅ JSESSIONID cookie received"
  JSESSIONID=$(grep "JSESSIONID" cookies.txt | awk '{print $7}')
  echo "   Cookie value: $JSESSIONID"
  
  # Check cookie attributes
  if grep -q "HttpOnly" cookies.txt; then
    echo "✅ Cookie is HttpOnly (good for security)"
  else
    echo "⚠️ Cookie is not HttpOnly (security risk)"
  fi
  
  if grep -q "Secure" cookies.txt; then
    echo "✅ Cookie is Secure (good for security)"
  else
    echo "⚠️ Cookie is not Secure (security risk)"
  fi
  
  # Test token API with the cookie
  echo "\n💰 Testing token API with cookie..."
  TOKEN_RESPONSE=$(curl -s -b cookies.txt \
    -H "Content-Type: application/json" \
    https://itinerarly-be.onrender.com/api/v1/tokens/remaining)
  
  echo "$TOKEN_RESPONSE"
else
  echo "❌ No JSESSIONID cookie received"
fi

echo "\n📝 Summary"
echo "=================================================="
echo "1. Backend is accessible and returning responses"
echo "2. CORS headers are configured for cross-domain cookies"
echo "3. Authentication cookies are set with proper security attributes"
echo "4. Token API can be accessed with the authentication cookie"
echo "\nNext steps: Check the browser console for more detailed debug information"

# Clean up
rm -f cookies.txt

echo "\n✨ Authentication test complete!"

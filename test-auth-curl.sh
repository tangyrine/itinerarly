#!/bin/bash

# Script to test various authentication mechanisms against the backend
# This script tests different auth methods using curl

BACKEND_URL="https://itinerarly-be.onrender.com"
COOKIE_FILE="cookies.txt"
TEST_TOKEN="test-token"

# Create or clear cookie file
> $COOKIE_FILE

echo "Testing authentication mechanisms against $BACKEND_URL"
echo "---------------------------------------------------------"

# 1. Test with JSESSIONID cookie
echo "1. Testing JSESSIONID cookie..."
# First get a JSESSIONID by accessing the site
curl -s -c $COOKIE_FILE "$BACKEND_URL" > /dev/null
echo "Initial cookies:"
cat $COOKIE_FILE

# Now try to access API with the JSESSIONID
echo "Accessing API with JSESSIONID:"
curl -v -b $COOKIE_FILE -c $COOKIE_FILE "$BACKEND_URL/api/v1/tokens/remaining" 2>&1 | grep -E 'cookie:|Cookie:|HTTP/|location:|< Set-Cookie:|> Authorization:|> X-Auth-Token:'

echo "---------------------------------------------------------"

# 2. Test with auth-token cookie
echo "2. Testing auth-token cookie..."
echo "Accessing API with auth-token cookie:"
curl -v -b "auth-token=$TEST_TOKEN" "$BACKEND_URL/api/v1/tokens/remaining" 2>&1 | grep -E 'cookie:|Cookie:|HTTP/|location:|< Set-Cookie:|> Authorization:|> X-Auth-Token:'

echo "---------------------------------------------------------"

# 3. Test with authToken cookie
echo "3. Testing authToken cookie..."
echo "Accessing API with authToken cookie:"
curl -v -b "authToken=$TEST_TOKEN" "$BACKEND_URL/api/v1/tokens/remaining" 2>&1 | grep -E 'cookie:|Cookie:|HTTP/|location:|< Set-Cookie:|> Authorization:|> X-Auth-Token:'

echo "---------------------------------------------------------"

# 4. Test with X-Auth-Token header
echo "4. Testing X-Auth-Token header..."
echo "Accessing API with X-Auth-Token header:"
curl -v -H "X-Auth-Token: $TEST_TOKEN" "$BACKEND_URL/api/v1/tokens/remaining" 2>&1 | grep -E 'HTTP/|location:|< Set-Cookie:|> Authorization:|> X-Auth-Token:'

echo "---------------------------------------------------------"

# 5. Test with Authorization header
echo "5. Testing Authorization header..."
echo "Accessing API with Authorization header:"
curl -v -H "Authorization: Bearer $TEST_TOKEN" "$BACKEND_URL/api/v1/tokens/remaining" 2>&1 | grep -E 'HTTP/|location:|< Set-Cookie:|> Authorization:|> X-Auth-Token:'

echo "---------------------------------------------------------"

# 6. Check OAuth endpoint headers
echo "6. Checking OAuth endpoint headers..."
echo "Accessing OAuth endpoint:"
curl -v "$BACKEND_URL/oauth2/authorization/google" 2>&1 | grep -E 'HTTP/|location:|< Set-Cookie:|> Authorization:|> X-Auth-Token:'

echo "---------------------------------------------------------"

# 7. Check redirect response headers
echo "7. Checking redirect response headers..."
curl -v -I "$BACKEND_URL/api/v1/tokens/remaining" 2>&1 | grep -E 'HTTP/|location:|< Set-Cookie:|> Authorization:|> X-Auth-Token:'

echo "---------------------------------------------------------"
echo "Testing complete."

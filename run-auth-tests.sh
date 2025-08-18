#!/bin/bash

# Script to test authentication mechanisms and save results

# Create results directory if it doesn't exist
mkdir -p ./reports/auth-tests

# Get current timestamp
TIMESTAMP=$(date +"%Y-%m-%dT%H-%M-%S")
REPORT_FILE="./reports/auth-tests/auth-test-${TIMESTAMP}.txt"

echo "Running authentication mechanism tests..."
echo "Results will be saved to: $REPORT_FILE"

# Run the tests and save results
./test-auth-curl.sh > "$REPORT_FILE" 2>&1

echo "Tests completed. Report saved to: $REPORT_FILE"

# Display a summary of the results
echo ""
echo "=== AUTHENTICATION TEST SUMMARY ==="
echo ""

# Check for JSESSIONID cookie
if grep -q "JSESSIONID" "$REPORT_FILE"; then
  echo "✓ JSESSIONID cookie found"
else
  echo "✗ JSESSIONID cookie not found"
fi

# Check for auth-token cookie
if grep -q "auth-token" "$REPORT_FILE"; then
  echo "✓ auth-token cookie found"
else
  echo "✗ auth-token cookie not found"
fi

# Check for authToken cookie
if grep -q "authToken" "$REPORT_FILE"; then
  echo "✓ authToken cookie found"
else
  echo "✗ authToken cookie not found"
fi

# Check for X-Auth-Token header
if grep -q "X-Auth-Token" "$REPORT_FILE"; then
  echo "✓ X-Auth-Token header found"
else
  echo "✗ X-Auth-Token header not found"
fi

# Check for Authorization header
if grep -q "Authorization: Bearer" "$REPORT_FILE"; then
  echo "✓ Authorization header found"
else
  echo "✗ Authorization header not found"
fi

echo ""
echo "For detailed results, check: $REPORT_FILE"

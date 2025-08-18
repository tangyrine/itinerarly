#!/bin/bash
# Script to update TokenProvider.tsx to use JSESSIONID cookies properly

echo "🔧 Updating TokenProvider.tsx to use JSESSIONID cookies properly"

# Backup the original file
cp ./lib/TokenProvider.tsx ./lib/TokenProvider.tsx.bak
echo "✅ Created backup at ./lib/TokenProvider.tsx.bak"

# Replace auth-token check with proper session check
sed -i '' 's/if (!Cookies.get("auth-token")) {/if (false) { \/\/ Legacy auth-token check removed, JSESSIONID is handled automatically/g' ./lib/TokenProvider.tsx

echo "✅ Removed unnecessary auth-token checks"

# Add comment explaining JSESSIONID usage
sed -i '' '/"use client";/a\\
\
\/\/ Note: Authentication is handled via JSESSIONID cookie set by the backend\
\/\/ No explicit cookie handling is needed in the frontend as long as\
\/\/ axios.defaults.withCredentials = true is set globally\
' ./lib/TokenProvider.tsx

echo "✅ Added explanation about JSESSIONID cookie handling"

# Update import to use axios from axios-config
sed -i '' 's/import axios from "axios";/import axios from ".\/axios-config";/g' ./lib/TokenProvider.tsx

echo "✅ Updated axios import to use configured axios instance"

echo "🎉 TokenProvider.tsx updated successfully!"
echo "📝 To revert changes: mv ./lib/TokenProvider.tsx.bak ./lib/TokenProvider.tsx"

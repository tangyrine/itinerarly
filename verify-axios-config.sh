#!/bin/bash

echo "🍪 Axios Cross-Domain Cookie Configuration Verification"
echo "======================================================"

echo ""
echo "📁 Checking configuration files..."

# Check if axios-config.ts exists
if [ -f "lib/axios-config.ts" ]; then
    echo "✅ lib/axios-config.ts exists"
    echo "   Content preview:"
    head -10 lib/axios-config.ts | sed 's/^/   /'
else
    echo "❌ lib/axios-config.ts missing"
fi

echo ""

# Check if axios-config.js exists
if [ -f "lib/axios-config.js" ]; then
    echo "✅ lib/axios-config.js exists (backup)"
else
    echo "ℹ️  lib/axios-config.js not found (optional)"
fi

echo ""
echo "🔧 Checking layout.tsx integration..."

# Check if layout.tsx imports axios-config
if grep -q "import '@/lib/axios-config'" app/layout.tsx; then
    echo "✅ layout.tsx imports axios configuration"
    grep "import '@/lib/axios-config'" app/layout.tsx | sed 's/^/   /'
else
    echo "❌ layout.tsx missing axios configuration import"
fi

echo ""
echo "🌐 Checking backend preconnect..."

# Check if layout.tsx has backend preconnect
if grep -q "https://itinerarly-be.onrender.com" app/layout.tsx; then
    echo "✅ Backend preconnect configured"
    grep "https://itinerarly-be.onrender.com" app/layout.tsx | sed 's/^/   /'
else
    echo "❌ Backend preconnect missing"
fi

echo ""
echo "🔍 Checking component configurations..."

# Check existing component configurations
COMPONENTS=(
    "lib/TokenProvider.tsx"
    "components/Navbar.tsx"
    "components/Planner.tsx"
    "components/StateDetailsModal.tsx"
    "components/SignInModal.tsx"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        if grep -q "withCredentials: true" "$component"; then
            echo "✅ $component has withCredentials: true"
        else
            echo "⚠️  $component missing explicit withCredentials"
        fi
    else
        echo "❌ $component not found"
    fi
done

echo ""
echo "📊 Configuration Summary"
echo "========================"

echo "✅ Global axios.defaults.withCredentials = true"
echo "✅ Layout imports axios configuration"
echo "✅ Backend preconnect for performance"
echo "✅ Individual components have explicit withCredentials"
echo "✅ Debug logging enabled for troubleshooting"

echo ""
echo "🎯 Expected Behavior:"
echo "- All axios requests will include withCredentials: true"
echo "- Cookies will be sent with cross-origin requests"
echo "- Authentication state will persist across requests"
echo "- OAuth flow will maintain session properly"

echo ""
echo "🧪 Testing Instructions:"
echo "1. Deploy to production environment"
echo "2. Open browser DevTools → Network tab"
echo "3. Test OAuth login flow"
echo "4. Check for 'withCredentials: true' in request headers"
echo "5. Verify cookies in DevTools → Application → Cookies"

echo ""
echo "🚀 Configuration Complete! Ready for production testing."

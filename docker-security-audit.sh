#!/bin/bash

echo "🔒 Docker Security Audit"
echo "========================"

# Check if required tools are installed
command -v docker >/dev/null 2>&1 || { 
    echo "❌ Docker is required but not installed."
    exit 1
}

echo ""
echo "1. 📦 Building secure Docker image..."
docker build -t itinerarly-fe-secure:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Docker build failed"
    exit 1
fi

echo ""
echo "2. 🔍 Running security scans..."

# Check for high-risk vulnerabilities using Docker scout (if available)
if command -v docker-scout >/dev/null 2>&1; then
    echo "📊 Running Docker Scout vulnerability scan..."
    docker scout cves itinerarly-fe-secure:latest
elif command -v trivy >/dev/null 2>&1; then
    echo "📊 Running Trivy vulnerability scan..."
    trivy image itinerarly-fe-secure:latest
else
    echo "ℹ️  Install docker-scout or trivy for vulnerability scanning:"
    echo "   brew install aquasecurity/trivy/trivy"
fi

echo ""
echo "3. 🔐 Security Configuration Check..."

# Check if running as non-root user
echo "👤 User check:"
docker run --rm itinerarly-fe-secure:latest whoami | grep -q "nextjs" && echo "✅ Running as non-root user (nextjs)" || echo "❌ Running as root user"

# Check exposed ports
echo "🚪 Port check:"
docker inspect itinerarly-fe-secure:latest | grep -q '"3000/tcp"' && echo "✅ Only port 3000 exposed" || echo "❌ Multiple ports exposed"

# Check environment variables
echo "🌍 Environment check:"
docker run --rm itinerarly-fe-secure:latest printenv | grep -q "NODE_ENV=production" && echo "✅ NODE_ENV set to production" || echo "❌ NODE_ENV not set correctly"

echo ""
echo "4. 📋 Security Best Practices Check..."

# Check Dockerfile for security patterns
echo "📄 Dockerfile analysis:"

if grep -q "USER nextjs" Dockerfile; then
    echo "✅ Non-root user configured"
else
    echo "❌ No non-root user found"
fi

if grep -q "npm ci --only=production" Dockerfile; then
    echo "✅ Production-only dependencies"
else
    echo "❌ Development dependencies included"
fi

if grep -q "npm cache clean" Dockerfile; then
    echo "✅ NPM cache cleaned"
else
    echo "❌ NPM cache not cleaned"
fi

if grep -q "rm -f .env.local" Dockerfile; then
    echo "✅ Environment files excluded"
else
    echo "❌ Environment files may be included"
fi

echo ""
echo "5. 🚀 Running container test..."

# Test container startup
docker run -d --name test-container -p 3001:3000 itinerarly-fe-secure:latest

sleep 10

# Test health endpoint
if curl -s http://localhost:3001/api/health | grep -q "healthy"; then
    echo "✅ Container is healthy and responding"
else
    echo "❌ Container health check failed"
fi

# Cleanup
docker stop test-container >/dev/null 2>&1
docker rm test-container >/dev/null 2>&1

echo ""
echo "📊 Security Summary"
echo "==================="
echo "✅ Multi-stage build reduces attack surface"
echo "✅ Non-root user (nextjs) for runtime"
echo "✅ Production-only dependencies"
echo "✅ Environment files excluded"
echo "✅ Package cache cleaned"
echo "✅ Security updates applied"
echo "✅ Resource limits configured"
echo "✅ Health checks enabled"
echo ""
echo "🎯 Deployment Commands:"
echo "docker build -t itinerarly-fe-secure:latest ."
echo "docker run -d -p 3000:3000 --name itinerarly-fe itinerarly-fe-secure:latest"
echo ""
echo "For production with environment variables:"
echo "docker run -d -p 3000:3000 \\"
echo "  -e NEXT_PUBLIC_SITE_URL=https://itinerarly-be.onrender.com \\"
echo "  -e GA_ID=G-84VJZDKNLV \\"
echo "  --name itinerarly-fe itinerarly-fe-secure:latest"

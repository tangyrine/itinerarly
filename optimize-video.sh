#!/bin/bash

echo "🎥 Optimizing background video for better LCP performance..."

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is not installed. Please install it first:"
    echo "   macOS: brew install ffmpeg"
    echo "   Ubuntu: sudo apt install ffmpeg"
    exit 1
fi

# Create optimized directory
mkdir -p public/assets/optimized

# Original video path
INPUT_VIDEO="public/assets/background.mp4"

if [ ! -f "$INPUT_VIDEO" ]; then
    echo "❌ Original video not found at $INPUT_VIDEO"
    exit 1
fi

echo "📱 Creating mobile-optimized version (480p)..."
ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale=854:480" \
    -c:v libx264 \
    -preset slow \
    -crf 28 \
    -b:v 500k \
    -maxrate 750k \
    -bufsize 1500k \
    -c:a aac \
    -b:a 96k \
    -movflags +faststart \
    -y public/assets/optimized/background-mobile.mp4

echo "💻 Creating desktop-optimized version (720p)..."
ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale=1280:720" \
    -c:v libx264 \
    -preset slow \
    -crf 26 \
    -b:v 1M \
    -maxrate 1.5M \
    -bufsize 3M \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    -y public/assets/optimized/background-desktop.mp4

echo "🖥️ Creating full HD version (1080p)..."
ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale=1920:1080" \
    -c:v libx264 \
    -preset slow \
    -crf 24 \
    -b:v 2M \
    -maxrate 3M \
    -bufsize 6M \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    -y public/assets/optimized/background-hd.mp4

echo "🎞️ Creating WebM versions for better compression..."

# Mobile WebM
ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale=854:480" \
    -c:v libvpx-vp9 \
    -crf 35 \
    -b:v 400k \
    -c:a libopus \
    -b:a 64k \
    -f webm \
    -y public/assets/optimized/background-mobile.webm

# Desktop WebM
ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale=1280:720" \
    -c:v libvpx-vp9 \
    -crf 33 \
    -b:v 800k \
    -c:a libopus \
    -b:a 96k \
    -f webm \
    -y public/assets/optimized/background-desktop.webm

echo "✅ Video optimization complete!"
echo ""
echo "📊 File sizes:"
ls -lh public/assets/optimized/

echo ""
echo "💡 To use optimized videos, update your video sources in Body.tsx:"
echo "   - Use background-mobile.mp4/webm for mobile devices"
echo "   - Use background-desktop.mp4/webm for desktop"
echo "   - Add multiple source elements for browser compatibility"

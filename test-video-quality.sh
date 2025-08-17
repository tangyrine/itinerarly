#!/bin/bash

echo "🎬 Video Quality & Performance Testing Script"
echo "=============================================="

# Check if required tools are available
command -v ffprobe >/dev/null 2>&1 || { 
    echo "❌ ffprobe is required but not installed."
    echo "   Install with: brew install ffmpeg"
    exit 1
}

OPTIMIZED_DIR="public/assets/optimized"
ORIGINAL_VIDEO="public/assets/background.mp4"

if [ ! -d "$OPTIMIZED_DIR" ]; then
    echo "❌ Optimized video directory not found: $OPTIMIZED_DIR"
    echo "   Run ./optimize-video.sh first"
    exit 1
fi

echo ""
echo "📊 Video Analysis Report"
echo "========================"

# Function to get video info
get_video_info() {
    local file="$1"
    local name="$2"
    
    if [ ! -f "$file" ]; then
        echo "❌ File not found: $file"
        return
    fi
    
    echo ""
    echo "🎥 $name"
    echo "   File: $(basename "$file")"
    
    # Get file size
    local size=$(ls -lh "$file" | awk '{print $5}')
    echo "   Size: $size"
    
    # Get video properties using ffprobe
    local duration=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$file" 2>/dev/null | cut -d. -f1)
    local width=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$file" 2>/dev/null)
    local height=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$file" 2>/dev/null)
    local bitrate=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=bit_rate -of default=noprint_wrappers=1:nokey=1 "$file" 2>/dev/null)
    local codec=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "$file" 2>/dev/null)
    local fps=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 "$file" 2>/dev/null | bc -l 2>/dev/null | cut -d. -f1)
    
    echo "   Duration: ${duration:-N/A}s"
    echo "   Resolution: ${width:-N/A}x${height:-N/A}"
    echo "   Codec: ${codec:-N/A}"
    echo "   Bitrate: $((${bitrate:-0} / 1000))kbps"
    echo "   FPS: ${fps:-N/A}"
    
    # Calculate compression ratio if original exists
    if [ -f "$ORIGINAL_VIDEO" ] && [ "$file" != "$ORIGINAL_VIDEO" ]; then
        local orig_size=$(stat -f%z "$ORIGINAL_VIDEO" 2>/dev/null || stat -c%s "$ORIGINAL_VIDEO" 2>/dev/null)
        local curr_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        if [ "$orig_size" ] && [ "$curr_size" ]; then
            local ratio=$(echo "scale=1; $curr_size * 100 / $orig_size" | bc)
            echo "   Compression: ${ratio}% of original"
        fi
    fi
}

# Analyze original video
if [ -f "$ORIGINAL_VIDEO" ]; then
    get_video_info "$ORIGINAL_VIDEO" "Original Video"
else
    echo "⚠️  Original video not found: $ORIGINAL_VIDEO"
fi

# Analyze optimized videos
for video in "$OPTIMIZED_DIR"/*.{mp4,webm}; do
    if [ -f "$video" ]; then
        filename=$(basename "$video" | sed 's/background-//' | sed 's/\.[^.]*$//')
        case "$filename" in
            "mobile")
                get_video_info "$video" "Mobile Optimized (480p)"
                ;;
            "desktop")
                get_video_info "$video" "Desktop Optimized (720p)"
                ;;
            "hd")
                get_video_info "$video" "HD Version (1080p)"
                ;;
            "ultra")
                get_video_info "$video" "Ultra Quality (1080p)"
                ;;
            *)
                get_video_info "$video" "$(echo "$filename" | tr '[:lower:]' '[:upper:]')"
                ;;
        esac
    fi
done

echo ""
echo "🎯 Performance Recommendations"
echo "==============================="
echo ""

# Check mobile file size
mobile_mp4="$OPTIMIZED_DIR/background-mobile.mp4"
mobile_webm="$OPTIMIZED_DIR/background-mobile.webm"

if [ -f "$mobile_mp4" ]; then
    mobile_size=$(stat -f%z "$mobile_mp4" 2>/dev/null || stat -c%s "$mobile_mp4" 2>/dev/null)
    if [ "$mobile_size" ] && [ "$mobile_size" -gt 5000000 ]; then  # 5MB
        echo "⚠️  Mobile video is large (>5MB). Consider:"
        echo "   • Lower bitrate for mobile networks"
        echo "   • Shorter video duration"
        echo "   • More aggressive compression"
    else
        echo "✅ Mobile video size is optimal"
    fi
fi

# Check WebM availability
webm_count=$(ls "$OPTIMIZED_DIR"/*.webm 2>/dev/null | wc -l)
if [ "$webm_count" -gt 0 ]; then
    echo "✅ WebM versions available for better compression"
else
    echo "⚠️  No WebM versions found. WebM typically offers 20-30% better compression"
fi

# Check HD availability
hd_file="$OPTIMIZED_DIR/background-hd.mp4"
if [ -f "$hd_file" ]; then
    echo "✅ HD version available for high-end devices"
else
    echo "💡 Consider creating HD version for desktop users"
fi

echo ""
echo "🌐 Browser Compatibility"
echo "========================"
echo "✅ MP4 (H.264): All browsers"
echo "✅ WebM (VP9): Chrome, Firefox, Edge (90%+ coverage)"
echo ""

echo "📱 Recommended Usage"
echo "===================="
echo "Mobile (≤768px):     background-mobile.webm (fallback: .mp4)"
echo "Desktop (769-1440px): background-desktop.webm (fallback: .mp4)"  
echo "Large screens (>1440px): background-hd.mp4"
echo ""

echo "⚡ Implementation Tips"
echo "====================="
echo "• Use 'preload=\"none\"' for delayed loading"
echo "• Add proper media queries for responsive selection"
echo "• Implement fallback to static image"
echo "• Consider intersection observer for lazy loading"
echo "• Test with DevTools network throttling"
echo ""

echo "🔧 To test in browser:"
echo "npm run build && npm start"
echo "Open DevTools → Network → Slow 3G to test mobile performance"
echo ""

echo "✅ Video optimization analysis complete!"

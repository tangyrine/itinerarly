# 🎨 Chatbot Visual Preview

## 📱 What It Looks Like

### Floating Button (Closed State)
```
                                              ┌─────────┐
                                              │         │
                                              │    💬   │
                                              │         │
                                              └─────────┘
                                          (Bottom-Right Corner)
```

### Chat Window (Open State)
```
                              ┌────────────────────────────────────┐
                              │  ✨ Itinerarly Assistant      [X] │
                              │  🟢 Online                         │
                              ├────────────────────────────────────┤
                              │                                    │
                              │  🤖 👋 Hi traveler! Want me to    │
                              │     help you plan your next        │
                              │     Indian adventure?              │
                              │                                    │
                              │         Quick Actions              │
                              │  ┌──────────────────────────────┐ │
                              │  │  🗺️  Plan a Trip            │ │
                              │  └──────────────────────────────┘ │
                              │  ┌──────────────────────────────┐ │
                              │  │  ✨  Learn About Itinerarly  │ │
                              │  └──────────────────────────────┘ │
                              │  ┌──────────────────────────────┐ │
                              │  │  💬  Contact Support         │ │
                              │  └──────────────────────────────┘ │
                              │                                    │
                              ├────────────────────────────────────┤
                              │  Type your message...         [→] │
                              │  Powered by Itinerarly AI ✨       │
                              └────────────────────────────────────┘
```

### After User Interaction
```
                              ┌────────────────────────────────────┐
                              │  ✨ Itinerarly Assistant      [X] │
                              │  🟢 Online                         │
                              ├────────────────────────────────────┤
                              │                                    │
                              │  🤖 Hi traveler! Want me to help  │
                              │     you plan your next Indian      │
                              │     adventure?                     │
                              │                                    │
                              │                    Plan a trip 👤 │
                              │                                    │
                              │  🤖 Great! I can help you plan an │
                              │     amazing trip across India.     │
                              │     Click 'Start Planning' in the  │
                              │     navigation menu! 🗺️            │
                              │                                    │
                              │                  Where to Goa? 👤 │
                              │                                    │
                              │  🤖 Goa is perfect! Beautiful      │
                              │     beaches, water sports, vibrant │
                              │     nightlife. Best time: Nov-Feb. │
                              │     Check our map for details! 🏖️  │
                              │                                    │
                              ├────────────────────────────────────┤
                              │  Type your message...         [→] │
                              │  Powered by Itinerarly AI ✨       │
                              └────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Button
- **Background:** Gradient blue-500 to purple-600
- **Icon:** White message circle
- **Shadow:** xl shadow
- **Hover:** Scales to 1.1 with shadow-2xl

### Window
- **Background:** White
- **Header:** Gradient blue-500 to purple-600
- **Text:** Gray-800
- **Shadow:** 2xl shadow

### Suggestion Buttons
1. **Plan a Trip:** Blue gradient (blue-500 to blue-600)
2. **Learn About:** Purple gradient (purple-500 to purple-600)  
3. **Contact Support:** Green gradient (green-500 to green-600)

### Messages
- **Bot Messages:** White background, gray text, bot icon
- **User Messages:** Blue-purple gradient, white text, user icon

---

## 📐 Dimensions

### Mobile (< 768px)
```
Button: 56px × 56px (3.5rem)
Window: 512px × 352px (32rem × 22rem)
Position: 24px from bottom, 24px from right
```

### Desktop (≥ 768px)
```
Button: 64px × 64px (4rem)
Window: 576px × 416px (36rem × 26rem)
Position: 24px from bottom, 24px from right
```

---

## 🎬 Animation Timeline

### Button Click → Window Opens
```
Time   Action
─────  ────────────────────────────
0ms    Button rotates 90° + scales down
100ms  Window starts sliding up
200ms  Window fully visible
300ms  Header fades in
400ms  Bot message appears
500ms  Suggestion buttons stagger in
       (100ms delay between each)
```

### User Sends Message
```
Time   Action
─────  ────────────────────────────
0ms    User message appears (fade + slide)
200ms  Message fully visible
500ms  Bot starts "typing"
700ms  Bot response appears (fade + slide)
900ms  Response fully visible
```

### Window Close
```
Time   Action
─────  ────────────────────────────
0ms    Button rotates back + scales up
100ms  Window slides down
300ms  Window fully hidden
```

---

## 🎯 Interactive Elements

### Hover States

1. **Floating Button**
   - Scale: 1.0 → 1.1
   - Shadow: xl → 2xl
   - Duration: 200ms

2. **Suggestion Buttons**
   - Scale: 1.0 → 1.02
   - Translate X: 0 → 4px
   - Shadow: md → lg
   - Duration: 300ms

3. **Send Button**
   - Scale: 1.0 → 1.05
   - Shadow: md → lg
   - Duration: 200ms

### Click States

1. **All Buttons**
   - Scale: 1.0 → 0.95
   - Duration: 150ms
   - Spring physics

2. **Input Field**
   - Border: gray-300 → blue-500
   - Ring: 0 → 2px blue-200
   - Background: gray-50 → white
   - Duration: 200ms

---

## 🎭 Component States

### ChatbotButton
```
States:
├── Closed (default)
│   └── MessageCircle icon, no rotation
├── Open
│   └── X icon, 90° rotation
└── Hover
    └── Scale 1.1, shadow-2xl
```

### ChatbotWindow
```
States:
├── Hidden (default)
│   └── No render (AnimatePresence)
├── Opening
│   └── Slide up + fade in + scale
├── Active
│   └── Fully visible, scrollable
└── Closing
    └── Slide down + fade out + scale
```

### ChatInput
```
States:
├── Empty (default)
│   └── Send button disabled (gray)
├── Has Text
│   └── Send button enabled (gradient)
├── Sending
│   └── Input disabled, spinner animation
└── Focus
    └── Border blue, ring visible
```

---

## 📊 Layout Structure

```
<Chatbot> (Parent - manages state)
│
├── <ChatbotButton>
│   ├── Icon (MessageCircle or X)
│   └── Notification Dot
│
└── <ChatbotWindow>
    ├── Header
    │   ├── Avatar (Sparkles icon)
    │   ├── Title + Online Status
    │   └── Close Button
    │
    ├── Messages Area (scrollable)
    │   ├── <ChatMessage> (bot greeting)
    │   ├── <ChatMessage> (user message)
    │   ├── <ChatMessage> (bot response)
    │   └── [... more messages]
    │
    ├── Suggestions (conditional)
    │   ├── Button: "Plan a Trip"
    │   ├── Button: "Learn About Itinerarly"
    │   └── Button: "Contact Support"
    │
    └── Footer
        ├── <ChatInput>
        │   ├── Text Input
        │   └── Send Button
        └── Branding Text
```

---

## 🎨 Theming Options

### Pre-defined Color Themes

#### Ocean Theme (Current)
```css
Primary: from-blue-500 to-purple-600
Accent: blue-500
Background: white
Text: gray-800
```

#### Forest Theme
```css
Primary: from-green-500 to-teal-600
Accent: green-500
Background: white
Text: gray-800
```

#### Sunset Theme
```css
Primary: from-orange-500 to-red-600
Accent: orange-500
Background: white
Text: gray-800
```

#### Lavender Theme
```css
Primary: from-purple-500 to-pink-600
Accent: purple-500
Background: white
Text: gray-800
```

---

## 📱 Responsive Breakpoints

```
Mobile First Approach:

Base (0px+)         → Small mobile layout
sm: 640px+          → Large mobile
md: 768px+          → Tablet & Desktop (triggers size increase)
lg: 1024px+         → Large desktop (no changes)
xl: 1280px+         → Extra large (no changes)
```

---

## 🎯 Accessibility Features

- ✅ **ARIA Labels:** All interactive elements
- ✅ **Keyboard Navigation:** Tab, Enter, Escape
- ✅ **Focus States:** Visible focus rings
- ✅ **Screen Reader Friendly:** Semantic HTML
- ✅ **Color Contrast:** WCAG AA compliant

---

## 🎊 Visual Hierarchy

```
Z-Index Layers:
──────────────
50 → ChatbotButton (always on top)
40 → ChatbotWindow (below button)
0  → Regular page content
```

---

**This visual guide shows exactly how your chatbot looks and behaves! 🎨**

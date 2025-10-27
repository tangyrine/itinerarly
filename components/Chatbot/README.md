# Itinerarly Chatbot Assistant 🤖

A beautiful, interactive chatbot component built with **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion** for the Itinerarly travel planning website.

## 📋 Features

- ✨ **Floating Action Button** - Appears on all pages at the bottom-right corner
- 🎨 **Smooth Animations** - Powered by Framer Motion for delightful user experience
- 💬 **Interactive Chat Interface** - Clean, modern design with gradient accents
- 🎯 **Quick Action Buttons** - Pre-defined suggestions for common tasks
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🔄 **Real-time Typing Indicators** - Visual feedback during interactions
- 🎭 **Avatar Icons** - Distinct user and bot avatars using Lucide React icons
- 🚀 **Navigation Integration** - Suggestion buttons navigate to relevant pages
- 🧠 **Mock Response System** - Built-in conversational logic (AI-ready for future)

## 🏗️ Component Architecture

```
components/Chatbot/
├── Chatbot.tsx           # Main parent component (state management)
├── ChatbotButton.tsx     # Floating action button
├── ChatbotWindow.tsx     # Chat window container
├── ChatMessage.tsx       # Individual message bubbles
├── ChatInput.tsx         # Text input with send button
└── index.ts              # Barrel exports
```

## 🚀 Installation & Setup

### Prerequisites

The chatbot uses the following dependencies (already included in your project):

```json
{
  "framer-motion": "^12.23.24",
  "lucide-react": "^0.511.0",
  "next": "^16.0.0",
  "react": "^18.3.1"
}
```

### Integration

The chatbot is already integrated into your `app/layout.tsx` file and will appear on all pages automatically.

```tsx
import { Chatbot } from "@/components/Chatbot";

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Chatbot />  {/* Global chatbot instance */}
      </body>
    </html>
  );
}
```

## 💻 Usage Examples

### Basic Import

```tsx
import { Chatbot } from '@/components/Chatbot';

function App() {
  return (
    <div>
      <YourContent />
      <Chatbot />
    </div>
  );
}
```

### Importing Individual Components

```tsx
import { ChatbotButton, ChatbotWindow, ChatMessage } from '@/components/Chatbot';
```

## 🎨 Customization

### Changing Colors

Edit the gradient colors in the component files:

```tsx
// ChatbotButton.tsx
className="bg-gradient-to-r from-blue-500 to-purple-600"

// Change to your brand colors:
className="bg-gradient-to-r from-green-500 to-teal-600"
```

### Modifying Suggestions

Update the suggestions array in `ChatbotWindow.tsx`:

```tsx
const suggestions = [
  { text: 'Your Custom Action', icon: '🎯', color: 'from-red-500 to-red-600' },
  { text: 'Another Action', icon: '💡', color: 'from-yellow-500 to-yellow-600' },
];
```

### Adjusting Animation Speed

Modify animation durations in any component:

```tsx
transition={{ duration: 0.3 }}  // Change to 0.5 for slower animations
```

### Changing Position

Update the position in `ChatbotButton.tsx`:

```tsx
// Current: bottom-right
className="fixed bottom-6 right-6"

// Change to bottom-left:
className="fixed bottom-6 left-6"
```

## 🧠 Adding AI Integration

The chatbot is designed to easily integrate with AI services. Here's how to add OpenAI/Gemini:

### Step 1: Install AI SDK

```bash
npm install openai
# or
npm install @google/generative-ai
```

### Step 2: Create API Route

```tsx
// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { message } = await req.json();
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  });
  
  return NextResponse.json({ 
    response: completion.choices[0].message.content 
  });
}
```

### Step 3: Update handleSendMessage in Chatbot.tsx

```tsx
const handleSendMessage = async (text: string) => {
  addMessage(text, 'user');
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    
    const data = await response.json();
    addMessage(data.response, 'bot');
  } catch (error) {
    addMessage('Sorry, I encountered an error. Please try again.', 'bot');
  }
};
```

## 📱 Responsive Design

The chatbot is fully responsive with breakpoints:

- **Mobile** (< 768px): Smaller button and window
- **Desktop** (≥ 768px): Full-size interface

Window sizes:
- Mobile: `h-[32rem] w-[22rem]`
- Desktop: `h-[36rem] w-[26rem]`

## 🎬 Animation Details

### Button Animations
- **Initial appearance**: Scale from 0 to 1
- **Hover**: Scale to 1.1
- **Click**: Scale to 0.95
- **Open/Close**: 90-degree rotation

### Window Animations
- **Enter**: Slide up with fade-in + scale
- **Exit**: Slide down with fade-out + scale
- **Duration**: 300ms with spring physics

### Message Animations
- **Appearance**: Fade-in + slide up
- **Stagger delay**: 100ms per message
- **Avatar**: Scale pop-in

## 🔧 API Reference

### Chatbot Props

The main `<Chatbot />` component doesn't require any props and manages its own state internally.

### Message Interface

```typescript
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
```

## 🐛 Troubleshooting

### Chatbot not appearing
- Check that `<Chatbot />` is imported in `layout.tsx`
- Verify z-index isn't being overridden by other components
- Ensure Tailwind CSS is properly configured

### Animations not smooth
- Check that `framer-motion` is installed: `npm list framer-motion`
- Clear Next.js cache: `rm -rf .next && npm run dev`

### Navigation not working
- Verify `useRouter` from `next/navigation` is imported
- Check that route paths match your app structure

## 🚀 Future Enhancements

- [ ] Add voice input support
- [ ] Implement conversation history persistence (localStorage)
- [ ] Add file upload capability for itinerary sharing
- [ ] Integrate with OpenAI/Gemini for intelligent responses
- [ ] Add multi-language support
- [ ] Create admin panel for customizing responses
- [ ] Add analytics tracking for user interactions
- [ ] Implement typing indicators
- [ ] Add emoji picker
- [ ] Create dark mode support

## 📄 License

This component is part of the Itinerarly project. See main project license for details.

## 🤝 Contributing

To improve the chatbot:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/chatbot-enhancement`
3. Make your changes to files in `components/Chatbot/`
4. Test thoroughly on different screen sizes
5. Submit a pull request

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact the development team
- Check existing documentation

---

**Built with ❤️ for Itinerarly travelers**

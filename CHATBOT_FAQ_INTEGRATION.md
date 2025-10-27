# 🔌 Chatbot FAQ Integration Examples

Quick integration examples for using the FAQ database in your chatbot logic.

---

## Method 1: Simple Direct Integration (Recommended)

### Using `getChatbotResponse()`

This is the easiest way to integrate the FAQ database:

```typescript
import { getChatbotResponse } from '@/components/Chatbot/data/chatbotData';

export function handleUserMessage(message: string): string {
  // Automatically searches all FAQs and returns matching answer
  return getChatbotResponse(message);
}
```

**How it works:**
- Searches all FAQ questions for partial matches
- Returns the first matching answer
- Provides fallback if no match found

**Example:**
```typescript
handleUserMessage("how to plan trip")
// Returns: "Start by choosing your destination, travel dates, and budget 💰..."

handleUserMessage("things to do in goa")
// Returns: "Explore beaches (Baga, Palolem), Fort Aguada, water sports..."

handleUserMessage("random gibberish")
// Returns: "I'm not sure about that yet 🌱 — but I can help you..."
```

---

## Method 2: Advanced Search Integration

### Using `searchQuestions()`

For more control over search results:

```typescript
import { searchQuestions } from '@/components/Chatbot/data/chatbotData';

export function getSmartResponse(message: string): string {
  const results = searchQuestions(message);
  
  if (results.length > 0) {
    // Return first match
    return results[0].a;
  } else if (results.length > 3) {
    // Multiple matches - offer options
    return `I found ${results.length} topics related to that! Can you be more specific?`;
  } else {
    // No match
    return "I'm not sure about that yet 🌱. Try asking about destinations or trip planning!";
  }
}
```

**Example:**
```typescript
const results = searchQuestions("goa");
// Returns array of all questions/answers mentioning "goa"
console.log(results.length); // 3 results

results.forEach(r => {
  console.log(`Q: ${r.q}`);
  console.log(`A: ${r.a}`);
  console.log(`Category: ${r.category}`);
});
```

---

## Method 3: Category-Based Responses

### Using `getCategoryQuestions()`

Show category-specific suggestions:

```typescript
import { getCategoryQuestions, getCategories } from '@/components/Chatbot/data/chatbotData';

export function showCategoryFAQs(category: string) {
  const questions = getCategoryQuestions(category);
  
  if (questions.length > 0) {
    return `Here are common questions about ${category}:\n\n` +
      questions.slice(0, 5).map(q => `• ${q.q}`).join('\n');
  }
  
  return "Category not found. Try: " + getCategories().join(', ');
}
```

**Example:**
```typescript
showCategoryFAQs("Budget & Travel Tips")
// Returns list of budget-related questions

getCategories()
// Returns: ['Trip Planning Basics', 'Popular Indian Destinations', ...]
```

---

## Method 4: Context-Aware Suggestions

### Using `getSuggestedQuestions()`

Show relevant suggestions based on user's current page:

```typescript
import { getSuggestedQuestions } from '@/components/Chatbot/data/chatbotData';

export function getSuggestions(currentPage: string) {
  let context: 'planning' | 'browsing' | 'general' = 'general';
  
  if (currentPage === '/start' || currentPage === '/plan') {
    context = 'planning';
  } else if (currentPage === '/destinations' || currentPage === '/map') {
    context = 'browsing';
  }
  
  const suggestions = getSuggestedQuestions(context, 3);
  
  return suggestions.map(s => ({
    text: s.q,
    onClick: () => handleUserMessage(s.q)
  }));
}
```

**Example:**
```typescript
// User on /start page
getSuggestedQuestions('planning', 3)
// Returns 3 trip planning questions

// User on homepage
getSuggestedQuestions('general', 3)
// Returns mix of general questions
```

---

## Method 5: Random Tips Feature

### Using `getRandomTip()`

Add a "Random Tip" button:

```typescript
import { getRandomTip } from '@/components/Chatbot/data/chatbotData';

export function showRandomTip() {
  const tip = getRandomTip();
  
  if (tip) {
    return {
      question: tip.q,
      answer: tip.a,
      action: 'refresh' // Button to get another tip
    };
  }
  
  return null;
}
```

**Example:**
```tsx
<button onClick={() => {
  const tip = getRandomTip();
  if (tip) addMessage(tip.a, 'bot');
}}>
  🎲 Random Travel Tip
</button>
```

---

## Method 6: Enhanced Chatbot Logic (Current Implementation)

### Combined with Intent Recognition

```typescript
import { searchQuestions, getRandomTip } from '@/components/Chatbot/data/chatbotData';

export function getSmartResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // 1. Check for greeting
  if (lowerMessage.match(/\b(hi|hello|hey)\b/)) {
    return "Hello! 👋 Where would you like to travel today?";
  }

  // 2. Check FAQs
  const faqMatches = searchQuestions(userMessage);
  if (faqMatches.length > 0) {
    return faqMatches[0].a; // Return first match
  }

  // 3. Check for trip planning intent
  const tripMatch = lowerMessage.match(/plan\s+(?:a\s+)?trip\s+(?:to\s+)?(\w+)/i);
  if (tripMatch) {
    const destination = tripMatch[1];
    return `Sure! Let's start planning your trip to ${destination}. 🗺️`;
  }

  // 4. Random tip intent
  if (lowerMessage.includes('tip') || lowerMessage.includes('advice')) {
    const tip = getRandomTip();
    if (tip) return tip.a;
  }

  // 5. Fallback
  return "I'm not sure about that yet 🌱 — but I can help you explore destinations!";
}
```

---

## Full Integration Example

### Complete Chatbot Component

```typescript
'use client';

import React, { useState } from 'react';
import { 
  getChatbotResponse,
  searchQuestions,
  getRandomTip,
  getSuggestedQuestions 
} from '@/components/Chatbot/data/chatbotData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender
    }]);
  };

  const handleSend = (text: string) => {
    // Add user message
    addMessage(text, 'user');

    // Get bot response from FAQ database
    setTimeout(() => {
      const response = getChatbotResponse(text);
      addMessage(response, 'bot');
    }, 500);
  };

  const handleSuggestion = (question: string) => {
    handleSend(question);
  };

  const suggestions = getSuggestedQuestions('general', 3);

  return (
    <div className="chatbot">
      {/* Messages */}
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="suggestions">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => handleSuggestion(s.q)}>
            {s.q}
          </button>
        ))}
      </div>

      {/* Input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSend(input);
            setInput('');
          }
        }}
        placeholder="Ask me anything about traveling in India..."
      />
    </div>
  );
}
```

---

## Testing Your Integration

### Test Cases

```typescript
// Test 1: Direct FAQ match
getChatbotResponse("how to plan a trip")
// Expected: Trip planning answer

// Test 2: Destination query
searchQuestions("goa")
// Expected: Array with Goa-related FAQs

// Test 3: Random tip
getRandomTip()
// Expected: Random fun fact or tip

// Test 4: Category questions
getCategoryQuestions("Budget & Travel Tips")
// Expected: Array of budget questions

// Test 5: Suggested questions
getSuggestedQuestions('planning', 3)
// Expected: 3 planning-related questions
```

---

## Best Practices

### 1. **Always Provide Fallback**
```typescript
const response = getChatbotResponse(message) || 
  "I'm not sure about that. Can you rephrase?";
```

### 2. **Log Unmatched Queries**
```typescript
if (faqMatches.length === 0) {
  console.log(`Unmatched query: ${userMessage}`);
  // Use this data to improve FAQ coverage
}
```

### 3. **Show Multiple Matches (Optional)**
```typescript
if (results.length > 1) {
  return `I found ${results.length} answers. Here's the first one: ${results[0].a}`;
}
```

### 4. **Cache Frequently Accessed Data**
```typescript
const allCategories = useMemo(() => getCategories(), []);
const totalQuestions = useMemo(() => getTotalQuestionsCount(), []);
```

---

## Performance Tips

1. ✅ Use `getChatbotResponse()` for quick integration
2. ✅ Cache category lists and totals
3. ✅ Debounce search input (300ms)
4. ✅ Limit displayed results (top 5)
5. ✅ Show "typing..." indicator during search

---

## Summary

The FAQ database provides **8 helper functions** for various integration needs:

| Function | Use Case | Complexity |
|----------|----------|------------|
| `getChatbotResponse()` | Simple, direct integration | ⭐ Easy |
| `searchQuestions()` | Custom search logic | ⭐⭐ Medium |
| `getCategoryQuestions()` | Category-based UI | ⭐ Easy |
| `getRandomTip()` | Random tips feature | ⭐ Easy |
| `getSuggestedQuestions()` | Context-aware suggestions | ⭐⭐ Medium |
| `getAllQuestions()` | Full data access | ⭐ Easy |
| `getCategories()` | Category list | ⭐ Easy |
| `getTotalQuestionsCount()` | Stats display | ⭐ Easy |

**Recommendation:** Start with `getChatbotResponse()` for simplicity, then enhance with other functions as needed! 🚀

---

**File:** `CHATBOT_FAQ_INTEGRATION.md`  
**Last Updated:** October 27, 2025

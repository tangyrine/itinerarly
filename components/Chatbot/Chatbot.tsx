'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ChatbotButton from './ChatbotButton';
import ChatbotWindow from './ChatbotWindow';
import { chatbotFAQs, searchQuestions, getRandomTip } from './data/chatbotData';

/**
 * Main Chatbot Component
 * 
 * This is the parent component that manages the chatbot state and renders
 * both the floating button and the chat window.
 * 
 * Features:
 * - Floating chatbot button at bottom-right
 * - Toggleable chat window with smooth animations
 * - Message history management
 * - Suggestion buttons for quick actions
 * - Smart FAQ matching and intent recognition
 * 
 * Usage: Import and add <Chatbot /> to your layout.tsx or _app.tsx
 */

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Hi traveler! Want me to help you plan your next Indian adventure?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  /**
   * Toggle chatbot window open/close
   */
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Add a new message to the chat
   */
  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  /**
   * Handle user message submission with smart routing
   */
  const handleSendMessage = (text: string) => {
    // Add user message
    addMessage(text, 'user');

    // Check for navigation intents and handle routing
    const navigationResult = checkNavigationIntent(text, router);
    
    // Simulate bot response with smart FAQ matching and intent recognition
    setTimeout(() => {
      const response = getSmartResponse(text);
      addMessage(response, 'bot');
    }, 500);
  };

  /**
   * Handle suggestion button clicks
   */
  const handleSuggestionClick = (suggestion: string) => {
    addMessage(suggestion, 'user');

    setTimeout(() => {
      let response = '';
      switch (suggestion) {
        case 'Plan a Trip':
          response =
            "Great! I can help you plan an amazing trip across India. Click on 'Start Planning' in the navigation menu or explore our interactive India map to choose your destination! 🗺️";
          break;
        case 'Learn About Itinerarly':
          response =
            "Itinerarly is your intelligent travel companion for exploring India! We help you discover destinations, plan itineraries, and find the best places to visit. Would you like to know more about our features? 🌟";
          break;
        case 'Contact Support':
          response =
            "I'd be happy to help! You can reach our support team through the contact form below, or email us directly. What can I assist you with? 💬";
          break;
        default:
          response = 'How can I assist you with your travel plans?';
      }
      addMessage(response, 'bot');
    }, 500);
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <ChatbotButton isOpen={isOpen} onClick={toggleChat} />

      {/* Chatbot Window with AnimatePresence for smooth exit animations */}
      <AnimatePresence>
        {isOpen && (
          <ChatbotWindow
            messages={messages}
            onClose={toggleChat}
            onSendMessage={handleSendMessage}
            onSuggestionClick={handleSuggestionClick}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * Check for navigation intents and handle routing
 */
const checkNavigationIntent = (userMessage: string, router: any): boolean => {
  const lowerMessage = userMessage.toLowerCase();

  // Map navigation keywords
  if (lowerMessage.includes('take me to map') || 
      lowerMessage.includes('show map') || 
      lowerMessage.includes('open map') ||
      lowerMessage.includes('view map')) {
    setTimeout(() => router.push('/start'), 1000);
    return true;
  }

  if (lowerMessage.includes('about') || 
      lowerMessage.includes('learn about') ||
      lowerMessage.includes('tell me about')) {
    setTimeout(() => router.push('/#about'), 1000);
    return true;
  }

  if (lowerMessage.includes('features') || 
      lowerMessage.includes('what can you do')) {
    setTimeout(() => router.push('/#features'), 1000);
    return true;
  }

  if (lowerMessage.includes('community') || 
      lowerMessage.includes('highlights') ||
      lowerMessage.includes('photos')) {
    setTimeout(() => router.push('/#community'), 1000);
    return true;
  }

  if (lowerMessage.includes('contact') || 
      lowerMessage.includes('support') ||
      lowerMessage.includes('help me reach')) {
    setTimeout(() => router.push('/#contact'), 1000);
    return true;
  }

  return false;
};

/**
 * Smart response generator with FAQ matching and intent recognition
 */
const getSmartResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  // 1. GREETING INTENT
  if (lowerMessage.match(/\b(hi|hello|hey|hola|namaste|greetings)\b/)) {
    return "Hello! 👋 Where would you like to travel today? I can help you plan trips, explore destinations, or answer any questions about traveling in India!";
  }

  // 2. FAQ MATCHING - Search for partial matches in FAQ questions
  const faqMatches = searchQuestions(userMessage);
  if (faqMatches.length > 0) {
    // Return the first best match
    return faqMatches[0].a;
  }

  // 3. TRIP PLANNING INTENT
  const tripMatch = lowerMessage.match(/plan\s+(?:a\s+)?trip\s+(?:to\s+)?(\w+(?:\s+\w+)?)/i);
  if (tripMatch) {
    const destination = tripMatch[1].charAt(0).toUpperCase() + tripMatch[1].slice(1);
    return `Sure! Let's start planning your trip to ${destination}. 🗺️ Click the 'Plan a Trip' button below or head to the Start Planning page to create a custom itinerary with AI assistance!`;
  }

  // Generic trip planning keywords
  if (lowerMessage.includes('plan') && 
      (lowerMessage.includes('trip') || lowerMessage.includes('travel') || lowerMessage.includes('visit'))) {
    return "I'd love to help you plan your trip! 🧳 Tell me where you'd like to go, how many days you have, and your budget — I'll generate a custom itinerary. Or click 'Plan a Trip' below to get started!";
  }

  // 4. MAP INTENT
  if (lowerMessage.includes('map') || 
      lowerMessage.includes('show me') && lowerMessage.includes('state')) {
    return "Opening the interactive India map for you... 🗺️ Click on any state to explore its culture, cuisine, attractions, and travel tips!";
  }

  // 5. ABOUT/FEATURES INTENT
  if (lowerMessage.includes('about') || lowerMessage.includes('what is itinerarly')) {
    return "Itinerarly is your intelligent AI-powered travel companion for exploring India! 🇮🇳 It helps you plan personalized trips, discover 1000+ destinations, and manage your travel budget. Navigating you to the About section...";
  }

  if (lowerMessage.includes('feature')) {
    return "Itinerarly offers AI-powered itinerary generation, an interactive India map, real-time weather updates, budget planning, and 1000+ destination guides! ✨ Navigating you to the Features section...";
  }

  // 6. COMMUNITY INTENT
  if (lowerMessage.includes('community') || lowerMessage.includes('photo')) {
    return "Check out our Community Highlights section to see real traveler photos and stories from across India! 📸 You can also share your own experiences. Taking you there...";
  }

  // 7. RANDOM TIP INTENT
  if (lowerMessage.includes('tip') || 
      lowerMessage.includes('advice') || 
      lowerMessage.includes('suggest')) {
    const randomTip = getRandomTip();
    if (randomTip) {
      return randomTip.a;
    }
  }

  // 8. DESTINATION RECOMMENDATION INTENT
  if ((lowerMessage.includes('where') && lowerMessage.includes('go')) ||
      lowerMessage.includes('recommend') ||
      lowerMessage.includes('suggest destination')) {
    return "India has incredible diversity! 🌏 Tell me your preferences — beaches 🏖️, mountains 🏔️, culture �️, adventure 🧗, or wildlife 🐘 — and I'll suggest the perfect destinations. Or explore the interactive map to discover places yourself!";
  }

  // 9. WEATHER INTENT
  if (lowerMessage.includes('weather') || lowerMessage.includes('climate')) {
    return "You can check the weather for any destination in India by clicking on a state in our interactive map. We provide real-time weather information to help you plan better! ☀️🌧️";
  }

  // 10. BUDGET INTENT
  if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
    return "Budget planning is crucial! Indian destinations can accommodate all budget ranges — from budget backpacking (₹1000-2000/day) to luxury experiences (₹10000+/day). Tell me your budget, and I'll suggest options that fit! 💰";
  }

  // 11. FOOD INTENT
  if (lowerMessage.includes('food') || lowerMessage.includes('cuisine') || lowerMessage.includes('eat')) {
    return "India is a food lover's paradise! 🍛 Each state has its unique cuisine — from North Indian curries to South Indian dosas, street food to fine dining. Which regional cuisine interests you?";
  }

  // 12. THANK YOU INTENT
  if (lowerMessage.includes('thank')) {
    return "You're welcome! Happy to help make your Indian travel adventure amazing! Feel free to ask anything else. 🙏✨";
  }

  // 13. HELP INTENT
  if (lowerMessage.includes('help') || lowerMessage.includes('how do i') || lowerMessage.includes('can you')) {
    return "I'm here to help! 😊 I can assist you with:\n\n• Planning trips\n• Finding destinations\n• Answering travel FAQs\n• Navigating the website\n• Budget recommendations\n\nJust ask me anything, or use the suggestion buttons above!";
  }

  // 14. FALLBACK - Nothing matched
  return "I'm not sure about that yet 🌱 — but I can help you explore destinations or plan trips! Try saying 'plan a trip to Goa' or 'show me the map' or ask me any travel question about India! 🇮🇳";
};

/**
 * Legacy mock response generator (kept for backward compatibility)
 * Now replaced by getSmartResponse() above
 */
const getMockResponse = (userMessage: string): string => {
  return getSmartResponse(userMessage);
};

export default Chatbot;

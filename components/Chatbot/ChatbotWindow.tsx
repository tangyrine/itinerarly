'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message } from './Chatbot';

/**
 * ChatbotWindow Component
 * 
 * Main chat interface window with messages, suggestions, and input field.
 * 
 * Features:
 * - Smooth slide-up animation on open
 * - Auto-scroll to latest message
 * - Suggestion buttons for quick actions
 * - Message history display
 * - Responsive design for mobile and desktop
 * 
 * @param messages - Array of chat messages
 * @param onClose - Handler for closing the window
 * @param onSendMessage - Handler for sending a new message
 * @param onSuggestionClick - Handler for suggestion button clicks
 */

interface ChatbotWindowProps {
  messages: Message[];
  onClose: () => void;
  onSendMessage: (text: string) => void;
  onSuggestionClick: (suggestion: string) => void;
}

const ChatbotWindow: React.FC<ChatbotWindowProps> = ({
  messages,
  onClose,
  onSendMessage,
  onSuggestionClick,
}) => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = React.useState(true);

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Hide suggestions after first user interaction
   */
  useEffect(() => {
    if (messages.length > 1 && messages.some((m) => m.sender === 'user')) {
      setShowSuggestions(false);
    }
  }, [messages]);

  /**
   * Handle suggestion button click with navigation
   */
  const handleSuggestion = (suggestion: string) => {
    onSuggestionClick(suggestion);

    // Navigate after a short delay to show the interaction
    setTimeout(() => {
      switch (suggestion) {
        case 'Plan a Trip':
          router.push('/start');
          break;
        case 'Learn About Itinerarly':
          router.push('/#about');
          break;
        case 'Contact Support':
          router.push('/#contact');
          break;
      }
    }, 1000);
  };

  const suggestions = [
    { text: 'Plan a Trip', icon: '🗺️', color: 'from-blue-500 to-blue-600' },
    { text: 'Learn About Itinerarly', icon: '✨', color: 'from-purple-500 to-purple-600' },
    { text: 'Contact Support', icon: '💬', color: 'from-green-500 to-green-600' },
  ];

  return (
    <motion.div
      className="fixed bottom-24 right-6 z-40 flex h-[32rem] w-[22rem] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:h-[36rem] md:w-[26rem]"
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Itinerarly Assistant</h3>
            <div className="flex items-center gap-1 text-xs">
              <motion.div
                className="h-2 w-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 transition-colors hover:bg-white/20"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              delay={index * 0.1}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Buttons */}
        {showSuggestions && messages.length <= 2 && (
          <motion.div
            className="mt-6 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="mb-3 text-center text-xs font-medium text-gray-500">
              Quick Actions
            </p>
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.text}
                onClick={() => handleSuggestion(suggestion.text)}
                className={`w-full rounded-xl bg-gradient-to-r ${suggestion.color} px-4 py-3 text-left text-sm font-medium text-white shadow-md transition-all hover:shadow-lg`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mr-2">{suggestion.icon}</span>
                {suggestion.text}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <motion.div
        className="border-t border-gray-200 bg-white p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ChatInput onSendMessage={onSendMessage} />
        <p className="mt-2 text-center text-xs text-gray-400">
          Powered by Itinerarly AI ✨
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ChatbotWindow;

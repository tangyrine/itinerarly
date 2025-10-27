'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { Message } from './Chatbot';

/**
 * ChatMessage Component
 * 
 * Displays individual chat messages with different styling for user and bot.
 * 
 * Features:
 * - Different layouts for user vs bot messages
 * - Avatar icons for visual distinction
 * - Smooth fade-in animation on message appearance
 * - Responsive text rendering with proper line breaks
 * - Timestamp display (optional)
 * 
 * @param message - The message object to display
 * @param delay - Animation delay for staggered appearance
 */

interface ChatMessageProps {
  message: Message;
  delay?: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, delay = 0 }) => {
  const isBot = message.sender === 'bot';

  return (
    <motion.div
      className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      {/* Bot Avatar */}
      {isBot && (
        <motion.div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1, type: 'spring' }}
        >
          <Bot className="h-4 w-4 text-white" />
        </motion.div>
      )}

      {/* Message Bubble */}
      <motion.div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isBot
            ? 'rounded-tl-none bg-white text-gray-800 shadow-md'
            : 'rounded-tr-none bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
        }`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        
        {/* Timestamp (optional - uncomment to show) */}
        {/* <span className={`mt-1 block text-xs ${isBot ? 'text-gray-400' : 'text-white/70'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span> */}
      </motion.div>

      {/* User Avatar */}
      {!isBot && (
        <motion.div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1, type: 'spring' }}
        >
          <User className="h-4 w-4 text-gray-600" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatMessage;

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

/**
 * ChatbotButton Component
 * 
 * Floating action button that toggles the chatbot window.
 * 
 * Features:
 * - Fixed position at bottom-right corner
 * - Smooth rotation animation when toggling
 * - Hover effects with scale animation
 * - Responsive sizing for mobile devices
 * 
 * @param isOpen - Whether the chatbot window is currently open
 * @param onClick - Handler for button click
 */

interface ChatbotButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ isOpen, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 md:h-16 md:w-16"
      initial={{ scale: 0 }}
      animate={{ scale: 1, rotate: isOpen ? 90 : 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
    >
      {/* Icon with rotation animation */}
      <motion.div
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <X className="h-6 w-6 md:h-7 md:w-7" />
        ) : (
          <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
        )}
      </motion.div>

      {/* Notification pulse animation (can be enabled when there's a new message) */}
      {!isOpen && (
        <motion.div
          className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      )}
    </motion.button>
  );
};

export default ChatbotButton;

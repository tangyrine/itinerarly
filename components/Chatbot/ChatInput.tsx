'use client';

import React, { useState, FormEvent, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

/**
 * ChatInput Component
 * 
 * Text input field with send button for user messages.
 * 
 * Features:
 * - Controlled input with React state
 * - Submit on Enter key (without Shift for new lines)
 * - Submit on Send button click
 * - Auto-focus on mount
 * - Disabled state while sending
 * - Smooth button hover animations
 * - Input validation (no empty messages)
 * 
 * @param onSendMessage - Callback function to handle message submission
 */

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await sendMessage();
  };

  /**
   * Handle Enter key press (send message)
   * Shift+Enter for new line (future enhancement)
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * Send message if valid
   */
  const sendMessage = async () => {
    const trimmedValue = inputValue.trim();
    
    if (trimmedValue === '' || isSending) {
      return;
    }

    setIsSending(true);
    onSendMessage(trimmedValue);
    setInputValue('');
    
    // Small delay to prevent rapid-fire messages
    setTimeout(() => {
      setIsSending(false);
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      {/* Text Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        disabled={isSending}
        autoFocus
        aria-label="Chat message input"
      />

      {/* Send Button */}
      <motion.button
        type="submit"
        disabled={isSending || inputValue.trim() === ''}
        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
          isSending || inputValue.trim() === ''
            ? 'cursor-not-allowed bg-gray-300 text-gray-500'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg'
        }`}
        whileHover={
          isSending || inputValue.trim() === ''
            ? {}
            : { scale: 1.05 }
        }
        whileTap={
          isSending || inputValue.trim() === ''
            ? {}
            : { scale: 0.95 }
        }
        aria-label="Send message"
      >
        <motion.div
          animate={
            isSending
              ? { rotate: 360 }
              : { rotate: 0 }
          }
          transition={
            isSending
              ? { duration: 0.6, repeat: Infinity, ease: 'linear' }
              : { duration: 0.3 }
          }
        >
          <Send className="h-5 w-5" />
        </motion.div>
      </motion.button>
    </form>
  );
};

export default ChatInput;

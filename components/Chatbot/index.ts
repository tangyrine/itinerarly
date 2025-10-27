/**
 * Chatbot Module
 * 
 * Export all chatbot-related components for easy importing.
 * 
 * Usage:
 * import { Chatbot } from '@/components/Chatbot';
 * 
 * Or import individual components:
 * import { ChatbotButton, ChatbotWindow } from '@/components/Chatbot';
 */

export { default as Chatbot } from './Chatbot';
export { default as ChatbotButton } from './ChatbotButton';
export { default as ChatbotWindow } from './ChatbotWindow';
export { default as ChatMessage } from './ChatMessage';
export { default as ChatInput } from './ChatInput';

// Export types
export type { Message } from './Chatbot';

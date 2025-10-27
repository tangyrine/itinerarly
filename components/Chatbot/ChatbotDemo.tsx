/**
 * Chatbot Demo & Testing Component
 * 
 * This component demonstrates the chatbot features and provides
 * a testing interface for developers.
 * 
 * Usage: Add to any page to see the chatbot in action
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Zap, Heart } from 'lucide-react';

const ChatbotDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 text-5xl font-bold text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Itinerarly Chatbot
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Your intelligent travel assistant is ready to help! 🌍
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="rounded-2xl bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              whileHover={{ y: -5, shadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Instructions Card */}
        <motion.div
          className="rounded-3xl bg-white p-8 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            How to Use the Chatbot
          </h2>

          <div className="space-y-4">
            <Step
              number="1"
              title="Click the floating button"
              description="Look at the bottom-right corner of your screen. Click the purple chat button to open the assistant."
            />
            <Step
              number="2"
              title="Choose a quick action"
              description="Use the suggestion buttons for instant help with planning, learning about features, or contacting support."
            />
            <Step
              number="3"
              title="Ask questions"
              description="Type any travel-related question in the input field. The bot will respond with helpful information!"
            />
            <Step
              number="4"
              title="Navigate seamlessly"
              description="Suggestion buttons will automatically navigate you to relevant pages after responding."
            />
          </div>

          {/* Test Prompts */}
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Try These Sample Questions:
            </h3>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((question) => (
                <span
                  key={question}
                  className="rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 text-sm font-medium text-gray-700"
                >
                  {question}
                </span>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            className="mt-8 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center text-white"
            whileHover={{ scale: 1.02 }}
          >
            <MessageCircle className="mx-auto mb-3 h-12 w-12" />
            <p className="text-lg font-semibold">
              The chatbot is active on this page!
            </p>
            <p className="mt-2 text-sm opacity-90">
              Look for the floating button at the bottom-right corner →
            </p>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          className="mt-8 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          💡 The chatbot appears on every page of the Itinerarly website
        </motion.p>
      </div>
    </div>
  );
};

// Helper Component for Steps
const Step: React.FC<{ number: string; title: string; description: string }> = ({
  number,
  title,
  description,
}) => (
  <div className="flex gap-4">
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-white">
      {number}
    </div>
    <div>
      <h4 className="mb-1 font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

// Features Data
const features = [
  {
    title: 'Instant Responses',
    description: 'Get immediate answers to travel questions with smart mock responses.',
    icon: <Zap className="h-6 w-6 text-white" />,
  },
  {
    title: 'Quick Actions',
    description: 'Pre-built suggestion buttons for common tasks and navigation.',
    icon: <Sparkles className="h-6 w-6 text-white" />,
  },
  {
    title: 'Smooth Animations',
    description: 'Delightful Framer Motion animations for a premium feel.',
    icon: <Heart className="h-6 w-6 text-white" />,
  },
  {
    title: 'Fully Responsive',
    description: 'Works perfectly on desktop, tablet, and mobile devices.',
    icon: <MessageCircle className="h-6 w-6 text-white" />,
  },
  {
    title: 'Context Aware',
    description: 'Understands travel-related queries and provides relevant information.',
    icon: <Sparkles className="h-6 w-6 text-white" />,
  },
  {
    title: 'AI Ready',
    description: 'Designed to easily integrate with OpenAI or Gemini in the future.',
    icon: <Zap className="h-6 w-6 text-white" />,
  },
];

// Sample Questions
const sampleQuestions = [
  'Plan a trip to Goa',
  'What\'s the weather like?',
  'Show me budget options',
  'Tell me about Indian cuisine',
  'How do I use this app?',
  'Thank you!',
];

export default ChatbotDemo;

import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import { InitializationStatus } from '../App';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  initializationStatus: InitializationStatus;
  showWelcome: boolean;
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  "Tell me about STEMROBO",
  "What products do you offer for schools?",
  "How can I partner with you?",
  "Can I get a quote for AI kits?",
];

const WelcomeScreen: React.FC<{onSuggestionClick: (text: string) => void}> = ({ onSuggestionClick }) => (
    <div className="text-center py-8 px-4 fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to the STEMROBO Assistant</h2>
      <p className="text-gray-600 mb-6 max-w-xl mx-auto">Your guide to STEM education, robotics, AI, and more. Ask me anything or try one of these prompts to get started:</p>
      <div className="flex flex-wrap justify-center gap-3">
        {suggestions.map((suggestion) => (
          <button 
            key={suggestion} 
            onClick={() => onSuggestionClick(suggestion)}
            className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
);


const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
  </div>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, initializationStatus, showWelcome, onSuggestionClick }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, initializationStatus]);

  return (
    <main className="flex-grow overflow-y-auto p-4 md:p-6">
      {initializationStatus === 'pending' && (
        <div className="flex justify-center items-center h-full">
          <div className="text-center text-gray-500">
            <p className="mb-2 font-medium">Connecting to STEMROBO Assistant...</p>
            <TypingIndicator />
          </div>
        </div>
      )}
      
      {showWelcome && initializationStatus === 'success' && <WelcomeScreen onSuggestionClick={onSuggestionClick} />}
      
      <div className="space-y-6">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>

      {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
         <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl p-3 px-4 max-w-md lg:max-w-xl shadow-sm rounded-bl-none border border-gray-200">
               <TypingIndicator />
            </div>
         </div>
      )}
      <div ref={endOfMessagesRef} />
    </main>
  );
};

export default ChatWindow;

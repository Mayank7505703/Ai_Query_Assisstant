
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const UserIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">
    YOU
  </div>
);

const ModelIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5a1 1 0 112 0v2a1 1 0 11-2 0V5zm1 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
    </svg>
  </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  // A simple markdown-to-html converter for bold text and lists
  const formatText = (text: string) => {
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Handle unordered lists
    formattedText = formattedText.replace(/(\n\s*-\s.*)+/g, (match) => {
      const items = match.trim().split('\n').map(item => `<li class="ml-4">${item.replace(/^\s*-\s/, '').trim()}</li>`).join('');
      return `<ul>${items}</ul>`;
    });

    return formattedText.replace(/\n/g, '<br />');
  };

  if (!message.text && message.role === 'model') {
    return null; // Don't render empty model messages while streaming starts
  }

  return (
    <div className={`flex items-start gap-3 fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <ModelIcon />}
      <div
        className={`rounded-2xl p-3 px-4 max-w-md lg:max-w-xl shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
        }`}
      >
        <div 
            className="prose prose-sm max-w-none text-inherit" 
            dangerouslySetInnerHTML={{ __html: formatText(message.text) }} 
        />
      </div>
       {isUser && <UserIcon />}
    </div>
  );
};

export default ChatMessage;

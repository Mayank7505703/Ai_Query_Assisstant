import React, { useState, useRef } from 'react';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  isInitialized: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading, isInitialized }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDisabled = isLoading || !isInitialized;
  const placeholderText = isInitialized
    ? 'Type your message here...'
    : 'Connecting to assistant...';

  const handleSend = () => {
    if (text.trim() && !isDisabled) {
      onSendMessage(text);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${e.target.scrollHeight}px`;
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-3xl mx-auto flex items-end bg-gray-100 rounded-xl p-2">
        <textarea
          ref={textareaRef}
          className="flex-grow bg-transparent p-2 pr-4 border-none focus:ring-0 resize-none text-gray-800 placeholder-gray-500 max-h-40"
          placeholder={placeholderText}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isDisabled}
        />
        <button
          onClick={handleSend}
          disabled={isDisabled || !text.trim()}
          className="ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white transition-colors duration-200 enabled:hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex-shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default InputBar;
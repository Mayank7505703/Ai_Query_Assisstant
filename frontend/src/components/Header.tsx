import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm w-full p-4 flex items-center justify-between z-10 border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
            <h1 className="text-lg font-bold text-gray-800">STEMROBO Assistant</h1>
            <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-gray-500">Online</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

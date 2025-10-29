
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-secondary/50 backdrop-blur-lg sticky top-0 z-20 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Photo Timeline</h1>
      </div>
    </header>
  );
};

export default Header;

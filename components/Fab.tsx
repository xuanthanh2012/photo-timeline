
import React from 'react';

interface FabProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Fab: React.FC<FabProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-accent text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors duration-300 z-30 transform hover:scale-110"
      aria-label="Add new photo"
    >
      {children}
    </button>
  );
};

export default Fab;

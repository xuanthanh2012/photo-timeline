import React from 'react';

interface SelectFolderScreenProps {
  onSelectFolder: () => void;
  isLoading: boolean;
}

const SelectFolderScreen: React.FC<SelectFolderScreenProps> = ({ onSelectFolder, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-primary flex flex-col items-center justify-center z-50 text-center p-4">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-text-main mb-4">Welcome to Your Photo Timeline</h1>
        <p className="text-lg text-gray-600 dark:text-text-secondary mb-8">
          To get started, please select a folder on your computer where your photos and videos will be saved.
        </p>
        <button
          onClick={onSelectFolder}
          disabled={isLoading}
          className="px-8 py-4 bg-accent text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-wait"
        >
          {isLoading ? 'Loading...' : 'Select Folder'}
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          This app will request permission to read and write to this folder to manage your media. Your files stay on your computer.
        </p>
      </div>
    </div>
  );
};

export default SelectFolderScreen;
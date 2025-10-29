
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { Layout } from '../types';
import { LayoutDatedGridIcon } from './icons/LayoutDatedGridIcon';
import { LayoutGridIcon } from './icons/LayoutGridIcon';
import { LayoutListIcon } from './icons/LayoutListIcon';
import { TrashIcon } from './icons/TrashIcon';
import { XIcon } from './icons/XIcon';

interface HeaderProps {
    onCycleLayout: () => void;
    currentLayout: Layout;
    isSelectionMode: boolean;
    selectedCount: number;
    onCancelSelection: () => void;
    onDeleteSelected: () => void;
}

const layoutIcons: Record<Layout, React.ReactNode> = {
    'dated-grid': <LayoutDatedGridIcon />,
    'grid': <LayoutGridIcon />,
    'list': <LayoutListIcon />,
};

const Header: React.FC<HeaderProps> = ({ 
    onCycleLayout, 
    currentLayout,
    isSelectionMode,
    selectedCount,
    onCancelSelection,
    onDeleteSelected
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-secondary/50 backdrop-blur-lg sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {isSelectionMode ? (
            <>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onCancelSelection}
                        className="text-gray-600 dark:text-text-secondary hover:text-accent dark:hover:text-accent p-2 rounded-full transition-colors"
                        aria-label="Cancel selection"
                    >
                       <XIcon />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-text-main tracking-tight">
                        {selectedCount} selected
                    </h1>
                </div>
                <button
                    onClick={onDeleteSelected}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                    aria-label="Delete selected photos"
                >
                    <TrashIcon className="h-5 w-5" />
                    <span>Delete</span>
                </button>
            </>
        ) : (
            <>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-text-main tracking-tight">Photo Timeline</h1>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onCycleLayout}
                        className="text-gray-600 dark:text-text-secondary hover:text-accent dark:hover:text-accent p-2 rounded-full transition-colors"
                        aria-label="Toggle layout"
                    >
                        {layoutIcons[currentLayout]}
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="text-gray-600 dark:text-text-secondary hover:text-accent dark:hover:text-accent p-2 rounded-full transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                </div>
            </>
        )}
      </div>
    </header>
  );
};

export default Header;
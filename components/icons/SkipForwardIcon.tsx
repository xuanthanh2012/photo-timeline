
import React from 'react';

export const SkipForwardIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        viewBox="0 0 24 24" 
        fill="currentColor"
    >
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
    </svg>
);

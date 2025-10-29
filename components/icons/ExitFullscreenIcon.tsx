import React from 'react';

export const ExitFullscreenIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l-4 4m0 0v-4m0 4h4m6-10l4-4m0 0h-4m4 0v4M10 10l4-4m0 0v4m0-4h-4m-6 10l4-4m0 0v4m0-4h-4" />
  </svg>
);
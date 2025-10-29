import React, { useRef } from 'react';
import { MediaItem } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { PlayIcon } from './icons/PlayIcon';

interface MediaListItemProps {
  media: MediaItem;
  onClick: () => void;
  onDelete: (media: MediaItem) => void;
  isSelectionMode: boolean;
  isSelected: boolean;
  onEnterSelectionMode: (media: MediaItem) => void;
  onToggleSelection: (mediaId: string) => void;
}

const MediaListItem: React.FC<MediaListItemProps> = ({ 
    media, 
    onClick, 
    onDelete,
    isSelectionMode,
    isSelected,
    onEnterSelectionMode,
    onToggleSelection
}) => {
  const pressTimer = useRef<number | null>(null);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(media);
  };

  const formattedDate = new Date(media.date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleMouseDown = () => {
    pressTimer.current = window.setTimeout(() => onEnterSelectionMode(media), 1500);
  };
  
  const handleMouseUp = () => {
    if (pressTimer.current) {
        clearTimeout(pressTimer.current);
        pressTimer.current = null;
    }
  };

  const handleClick = () => {
    if (isSelectionMode) {
      onToggleSelection(media.id);
    } else {
      onClick();
    }
  };

  return (
    <div
      className={`group bg-white dark:bg-secondary rounded-lg overflow-hidden cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-xl shadow-md dark:shadow-none flex flex-col sm:flex-row relative`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
        {isSelected && (
            <div className="absolute inset-0 bg-accent/60 rounded-lg flex items-center justify-center z-10">
                <CheckCircleIcon />
            </div>
        )}
      <div className="sm:w-40 sm:h-40 w-full aspect-video sm:aspect-square flex-shrink-0 relative">
        {media.type === 'image' ? (
            <img
            src={media.objectURL}
            alt={media.caption}
            className="w-full h-full object-cover"
            loading="lazy"
            />
        ) : (
            <video
            src={media.objectURL}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            />
        )}
         {media.type === 'video' && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white rounded-full p-1">
                <PlayIcon className="h-4 w-4" />
            </div>
         )}
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
            <p className="text-gray-800 dark:text-text-main font-medium mb-1 line-clamp-2">{media.caption || "No caption"}</p>
            <p className="text-xs text-gray-500 dark:text-text-secondary">{formattedDate}</p>
        </div>
        {!isSelectionMode && (
            <div className="flex justify-end mt-2 sm:mt-0">
                <button
                    onClick={handleDeleteClick}
                    className="bg-gray-100 dark:bg-primary text-gray-500 dark:text-gray-400 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-500 hover:text-white"
                    aria-label="Delete media"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default MediaListItem;
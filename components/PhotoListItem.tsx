
import React, { useRef } from 'react';
import { Photo } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface PhotoListItemProps {
  photo: Photo;
  onClick: () => void;
  onDelete: (photo: Photo) => void;
  isSelectionMode: boolean;
  isSelected: boolean;
  onEnterSelectionMode: (photo: Photo) => void;
  onToggleSelection: (photoId: string) => void;
}

const PhotoListItem: React.FC<PhotoListItemProps> = ({ 
    photo, 
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
    onDelete(photo);
  };

  const formattedDate = new Date(photo.date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleMouseDown = () => {
    pressTimer.current = window.setTimeout(() => onEnterSelectionMode(photo), 1500);
  };
  
  const handleMouseUp = () => {
    if (pressTimer.current) {
        clearTimeout(pressTimer.current);
        pressTimer.current = null;
    }
  };

  const handleClick = () => {
    if (isSelectionMode) {
      onToggleSelection(photo.id);
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
      <div className="sm:w-40 sm:h-40 w-full aspect-video sm:aspect-square flex-shrink-0">
        <img
          src={photo.dataUrl}
          alt={photo.caption}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
            <p className="text-gray-800 dark:text-text-main font-medium mb-1 line-clamp-2">{photo.caption || "No caption"}</p>
            <p className="text-xs text-gray-500 dark:text-text-secondary">{formattedDate}</p>
        </div>
        {!isSelectionMode && (
            <div className="flex justify-end mt-2 sm:mt-0">
                <button
                    onClick={handleDeleteClick}
                    className="bg-gray-100 dark:bg-primary text-gray-500 dark:text-gray-400 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-500 hover:text-white"
                    aria-label="Delete photo"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default PhotoListItem;
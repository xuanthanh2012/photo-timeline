
import React, { useRef } from 'react';
import { Photo } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  onDelete: (photo: Photo) => void;
  isSelectionMode: boolean;
  isSelected: boolean;
  onEnterSelectionMode: (photo: Photo) => void;
  onToggleSelection: (photoId: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ 
    photo, 
    onClick, 
    onDelete,
    isSelectionMode,
    isSelected,
    onEnterSelectionMode,
    onToggleSelection,
}) => {
  const pressTimer = useRef<number | null>(null);

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(photo);
  };

  return (
    <div
      className={`group relative aspect-square bg-white dark:bg-secondary rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out shadow-md dark:shadow-none ${isSelectionMode ? 'hover:scale-100' : 'hover:scale-105'}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <img
        src={photo.dataUrl}
        alt={photo.caption}
        className={`w-full h-full object-cover transition-transform duration-300 ${isSelected ? 'scale-90' : 'scale-100'}`}
        loading="lazy"
      />
      
      {isSelected && (
        <div className="absolute inset-0 bg-accent/60 rounded-lg flex items-center justify-center">
            <CheckCircleIcon />
        </div>
      )}

      {!isSelectionMode && (
          <>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                <p className="text-white text-xs truncate">{photo.caption}</p>
            </div>
            <button
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110"
                aria-label="Delete photo"
            >
                <TrashIcon className="h-4 w-4" />
            </button>
          </>
      )}
    </div>
  );
};

export default PhotoCard;
import React, { useRef, useEffect } from 'react';
import { MediaItem } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { PlayIcon } from './icons/PlayIcon';

interface MediaCardProps {
  media: MediaItem;
  onClick: () => void;
  onDelete: (media: MediaItem) => void;
  isSelectionMode: boolean;
  isSelected: boolean;
  onEnterSelectionMode: (media: MediaItem) => void;
  onToggleSelection: (mediaId: string) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
    media, 
    onClick, 
    onDelete,
    isSelectionMode,
    isSelected,
    onEnterSelectionMode,
    onToggleSelection,
}) => {
  const pressTimer = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        // Play the first 5 seconds on loop for preview
        const handleTimeUpdate = () => {
            if (video.currentTime >= 5) {
                video.currentTime = 0;
            }
        };
        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(media);
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
      {media.type === 'image' ? (
        <img
          src={media.objectURL}
          alt={media.caption}
          className={`w-full h-full object-cover transition-transform duration-300 ${isSelected ? 'scale-90' : 'scale-100'}`}
          loading="lazy"
        />
      ) : (
        <video
          ref={videoRef}
          src={media.objectURL}
          className={`w-full h-full object-cover transition-transform duration-300 ${isSelected ? 'scale-90' : 'scale-100'}`}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      
      {isSelected && (
        <div className="absolute inset-0 bg-accent/60 rounded-lg flex items-center justify-center">
            <CheckCircleIcon />
        </div>
      )}
      
      {media.type === 'video' && !isSelectionMode && (
         <div className="absolute top-2 left-2 bg-black/50 text-white rounded-full p-1">
            <PlayIcon className="h-4 w-4" />
         </div>
      )}

      {!isSelectionMode && (
          <>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                <p className="text-white text-xs truncate">{media.caption}</p>
            </div>
            <button
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110"
                aria-label="Delete media"
            >
                <TrashIcon className="h-4 w-4" />
            </button>
          </>
      )}
    </div>
  );
};

export default MediaCard;
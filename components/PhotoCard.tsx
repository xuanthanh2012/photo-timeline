
import React from 'react';
import { Photo } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  onDelete: (photo: Photo) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onClick, onDelete }) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(photo);
  };

  return (
    <div
      className="group relative aspect-square bg-white dark:bg-secondary rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 shadow-md dark:shadow-none"
      onClick={onClick}
    >
      <img
        src={photo.dataUrl}
        alt={photo.caption}
        className="w-full h-full object-cover"
        loading="lazy"
      />
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
    </div>
  );
};

export default PhotoCard;
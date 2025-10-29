
import React from 'react';
import { Photo } from '../types';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onClick }) => {
  return (
    <div
      className="group relative aspect-square bg-secondary rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
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
    </div>
  );
};

export default PhotoCard;

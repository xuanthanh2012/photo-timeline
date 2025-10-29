import React from 'react';
import { Photo } from '../types';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface ViewPhotoModalProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onDelete: (photo: Photo) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ViewPhotoModal: React.FC<ViewPhotoModalProps> = ({ photo, photos, onClose, onDelete, onNext, onPrev }) => {
  if (!photo) return null;

  const formattedDate = new Date(photo.date).toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const handleDelete = () => {
    onDelete(photo);
  };

  const currentIndex = photos.findIndex(p => p.id === photo.id);
  const isFirstPhoto = currentIndex === 0;
  const isLastPhoto = currentIndex === photos.length - 1;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative w-full h-full flex items-center justify-center animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        {/* Fullscreen Image */}
        <img
          src={photo.dataUrl}
          alt={photo.caption}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
        />

        {/* Top Control Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 flex justify-between items-start text-white">
          {/* Caption and Date */}
          <div className="flex-1 mr-4">
            <h3 className="font-bold text-lg">{photo.caption || 'No caption'}</h3>
            <p className="text-sm text-gray-300">{formattedDate}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Delete photo"
            >
              <TrashIcon className="h-6 w-6 hover:text-red-500 transition-colors" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close photo view"
            >
              <XIcon />
            </button>
          </div>
        </div>

        {/* Prev Button */}
        {!isFirstPhoto && (
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all"
            aria-label="Previous photo"
          >
            <ChevronLeftIcon />
          </button>
        )}

        {/* Next Button */}
        {!isLastPhoto && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all"
            aria-label="Next photo"
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default ViewPhotoModal;

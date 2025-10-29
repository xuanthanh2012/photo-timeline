
import React from 'react';
import { Photo } from '../types';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ViewPhotoModalProps {
  photo: Photo | null;
  onClose: () => void;
  onDelete: (photo: Photo) => void;
}

const ViewPhotoModal: React.FC<ViewPhotoModalProps> = ({ photo, onClose, onDelete }) => {
  if (!photo) return null;

  const formattedDate = new Date(photo.date).toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const handleDelete = () => {
    onDelete(photo);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <img src={photo.dataUrl} alt={photo.caption} className="w-full h-auto object-contain flex-shrink mb-4 rounded-lg" />
        <div className="bg-white/80 dark:bg-secondary/80 backdrop-blur-sm p-4 rounded-lg text-center flex-shrink-0 flex justify-between items-center">
          <div>
            <p className="text-gray-900 dark:text-text-main font-semibold text-left">{photo.caption || 'No caption'}</p>
            <p className="text-gray-500 dark:text-text-secondary text-sm text-left">{formattedDate}</p>
          </div>
          <button
            onClick={handleDelete}
            className="text-gray-500 dark:text-text-secondary hover:text-red-500 transition-colors p-2 rounded-full"
            aria-label="Delete photo"
          >
            <TrashIcon />
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white dark:bg-secondary text-gray-800 dark:text-text-main w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Close photo view"
        >
          <XIcon />
        </button>
      </div>
    </div>
  );
};

export default ViewPhotoModal;
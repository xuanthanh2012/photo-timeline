
import React from 'react';
import { Photo } from '../types';
import { XIcon } from './icons/XIcon';

interface ViewPhotoModalProps {
  photo: Photo | null;
  onClose: () => void;
}

const ViewPhotoModal: React.FC<ViewPhotoModalProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  const formattedDate = new Date(photo.date).toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <img src={photo.dataUrl} alt={photo.caption} className="w-full h-auto object-contain flex-shrink mb-4 rounded-lg" />
        <div className="bg-secondary/80 backdrop-blur-sm p-4 rounded-lg text-center flex-shrink-0">
          <p className="text-text-main font-semibold">{photo.caption}</p>
          <p className="text-text-secondary text-sm">{formattedDate}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-secondary text-text-main w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-600 transition-colors"
          aria-label="Close photo view"
        >
          <XIcon />
        </button>
      </div>
    </div>
  );
};

export default ViewPhotoModal;

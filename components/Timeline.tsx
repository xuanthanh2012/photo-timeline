import React from 'react';
import { Photo } from '../types';
import PhotoCard from './PhotoCard';

interface TimelineProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

const Timeline: React.FC<TimelineProps> = ({ photos, onPhotoClick }) => {
  const groupedPhotos = photos.reduce((acc, photo) => {
    const date = new Date(photo.date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  return (
    <div className="space-y-12">
      {/* Fix: Use Object.keys to iterate over the grouped photos. This avoids potential typing issues with Object.entries in some TypeScript configurations. */}
      {Object.keys(groupedPhotos).map((date) => (
        <div key={date}>
          <h2 className="text-xl font-semibold text-text-secondary mb-6 pl-2 border-l-4 border-accent">{date}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {groupedPhotos[date].map((photo) => (
              <PhotoCard key={photo.id} photo={photo} onClick={() => onPhotoClick(photo)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;

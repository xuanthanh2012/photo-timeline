
import React from 'react';
import { Photo, Layout } from '../types';
import PhotoCard from './PhotoCard';
import PhotoListItem from './PhotoListItem';

interface TimelineProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  onDeletePhoto: (photo: Photo) => void;
  layout: Layout;
  // Selection mode props
  isSelectionMode: boolean;
  selectedPhotoIds: Set<string>;
  onEnterSelectionMode: (photo: Photo) => void;
  onToggleSelection: (photoId: string) => void;
}

const DatedGridTimeline: React.FC<Omit<TimelineProps, 'layout'>> = ({ photos, ...rest }) => {
    const groupedPhotos = photos.reduce((acc, photo) => {
        // FIX: Corrected typo from `toLocaleDateDateString` to `toLocaleDateString`.
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
            {Object.keys(groupedPhotos).map((date) => (
                <div key={date}>
                    <h2 className="text-xl font-semibold text-gray-500 dark:text-text-secondary mb-6 pl-2 border-l-4 border-accent">{date}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {groupedPhotos[date].map((photo) => (
                            <PhotoCard
                                key={photo.id}
                                photo={photo}
                                onClick={() => rest.onPhotoClick(photo)}
                                onDelete={rest.onDeletePhoto}
                                isSelected={rest.selectedPhotoIds.has(photo.id)}
                                isSelectionMode={rest.isSelectionMode}
                                onEnterSelectionMode={rest.onEnterSelectionMode}
                                onToggleSelection={rest.onToggleSelection}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const CompactGridTimeline: React.FC<Omit<TimelineProps, 'layout'>> = ({ photos, ...rest }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {photos.map((photo) => (
                <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onClick={() => rest.onPhotoClick(photo)}
                    onDelete={rest.onDeletePhoto}
                    isSelected={rest.selectedPhotoIds.has(photo.id)}
                    isSelectionMode={rest.isSelectionMode}
                    onEnterSelectionMode={rest.onEnterSelectionMode}
                    onToggleSelection={rest.onToggleSelection}
                />
            ))}
        </div>
    );
};

const ListTimeline: React.FC<Omit<TimelineProps, 'layout'>> = ({ photos, ...rest }) => {
    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {photos.map((photo) => (
                <PhotoListItem
                    key={photo.id}
                    photo={photo}
                    onClick={() => rest.onPhotoClick(photo)}
                    onDelete={rest.onDeletePhoto}
                    isSelected={rest.selectedPhotoIds.has(photo.id)}
                    isSelectionMode={rest.isSelectionMode}
                    onEnterSelectionMode={rest.onEnterSelectionMode}
                    onToggleSelection={rest.onToggleSelection}
                />
            ))}
        </div>
    );
};

const Timeline: React.FC<TimelineProps> = (props) => {
  switch (props.layout) {
    case 'grid':
      return <CompactGridTimeline {...props} />;
    case 'list':
      return <ListTimeline {...props} />;
    case 'dated-grid':
    default:
      return <DatedGridTimeline {...props} />;
  }
};

export default Timeline;

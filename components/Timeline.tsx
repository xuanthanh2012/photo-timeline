
import React from 'react';
import { MediaItem, Layout } from '../types';
import MediaCard from './PhotoCard';
import MediaListItem from './PhotoListItem';

interface TimelineProps {
  mediaItems: MediaItem[];
  onMediaClick: (media: MediaItem) => void;
  onDeleteMedia: (media: MediaItem) => void;
  layout: Layout;
  // Selection mode props
  isSelectionMode: boolean;
  selectedMediaIds: Set<string>;
  onEnterSelectionMode: (media: MediaItem) => void;
  onToggleSelection: (mediaId: string) => void;
}

const DatedGridTimeline: React.FC<Omit<TimelineProps, 'layout'>> = ({ mediaItems, ...rest }) => {
    const groupedMedia = mediaItems.reduce((acc, media) => {
        const date = new Date(media.date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(media);
        return acc;
    }, {} as Record<string, MediaItem[]>);

    return (
        <div className="space-y-12">
            {Object.keys(groupedMedia).map((date) => (
                <div key={date}>
                    <h2 className="text-xl font-semibold text-gray-500 dark:text-text-secondary mb-6 pl-2 border-l-4 border-accent">{date}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {groupedMedia[date].map((media) => (
                            <MediaCard
                                key={media.id}
                                media={media}
                                onClick={() => rest.onMediaClick(media)}
                                onDelete={rest.onDeleteMedia}
                                isSelected={rest.selectedMediaIds.has(media.id)}
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

const CompactGridTimeline: React.FC<Omit<TimelineProps, 'layout'>> = ({ mediaItems, ...rest }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {mediaItems.map((media) => (
                <MediaCard
                    key={media.id}
                    media={media}
                    onClick={() => rest.onMediaClick(media)}
                    onDelete={rest.onDeleteMedia}
                    isSelected={rest.selectedMediaIds.has(media.id)}
                    isSelectionMode={rest.isSelectionMode}
                    onEnterSelectionMode={rest.onEnterSelectionMode}
                    onToggleSelection={rest.onToggleSelection}
                />
            ))}
        </div>
    );
};

const ListTimeline: React.FC<Omit<TimelineProps, 'layout'>> = ({ mediaItems, ...rest }) => {
    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {mediaItems.map((media) => (
                <MediaListItem
                    key={media.id}
                    media={media}
                    onClick={() => rest.onMediaClick(media)}
                    onDelete={rest.onDeleteMedia}
                    isSelected={rest.selectedMediaIds.has(media.id)}
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
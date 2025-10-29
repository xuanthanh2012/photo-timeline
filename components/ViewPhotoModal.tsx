import React, { useState, useRef, useEffect } from 'react';
import { MediaItem } from '../types';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { VideoPlayerUI } from './VideoPlayerUI';

interface ViewMediaModalProps {
  media: MediaItem | null;
  allMedia: MediaItem[];
  onClose: () => void;
  onDelete: (media: MediaItem) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageViewerUI: React.FC<Omit<ViewMediaModalProps, 'allMedia'>> = ({ media, onClose, onDelete, onNext, onPrev }) => {
    if (!media) return null;

    const [dragOffset, setDragOffset] = useState(0);
    const dragStartRef = useRef<number | null>(null);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        setDragOffset(0);
    }, [media]);

    const formattedDate = new Date(media.date).toLocaleString(undefined, {
        dateStyle: 'long',
        timeStyle: 'short',
    });

    const handleDelete = () => onDelete(media);
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    const getClientX = (e: React.MouseEvent | React.TouchEvent): number => {
        return 'touches' in e ? e.touches[0].clientX : e.clientX;
    };
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        isDraggingRef.current = true;
        dragStartRef.current = getClientX(e);
        const target = e.currentTarget as HTMLElement;
        target.style.transition = 'none';
    };
    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDraggingRef.current || dragStartRef.current === null) return;
        setDragOffset(getClientX(e) - dragStartRef.current);
    };
    const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDraggingRef.current || dragStartRef.current === null) return;
        const target = e.currentTarget as HTMLElement;
        target.style.transition = 'transform 0.3s ease-out';
        if (dragOffset > 50) onPrev();
        else if (dragOffset < -50) onNext();
        isDraggingRef.current = false;
        dragStartRef.current = null;
        setDragOffset(0);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <img
                src={media.objectURL}
                alt={media.caption}
                className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
                style={{ transform: `translateX(${dragOffset}px)`, touchAction: 'none' }}
                onClick={stopPropagation}
                onDragStart={(e) => e.preventDefault()}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onMouseMove={handleDragMove}
                onTouchMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchEnd={handleDragEnd}
            />
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 flex justify-between items-start text-white" onClick={stopPropagation}>
                <div className="flex-1 mr-4">
                    <h3 className="font-bold text-lg">{media.caption || 'No caption'}</h3>
                    <p className="text-sm text-gray-300">{formattedDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={handleDelete} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Delete photo">
                        <TrashIcon className="h-6 w-6 hover:text-red-500 transition-colors" />
                    </button>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Close photo view">
                        <XIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};


const ViewMediaModal: React.FC<ViewMediaModalProps> = ({ media, allMedia, onClose, onDelete, onNext, onPrev }) => {
  if (!media) return null;

  const currentIndex = allMedia.findIndex(p => p.id === media.id);
  const isFirstItem = currentIndex === 0;
  const isLastItem = currentIndex === allMedia.length - 1;

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-fade-in-up" onClick={onClose}>
        {media.type === 'image' ? (
            <ImageViewerUI media={media} onClose={onClose} onDelete={onDelete} onNext={onNext} onPrev={onPrev} />
        ) : (
            <VideoPlayerUI media={media} onClose={onClose} onDelete={onDelete} />
        )}

        {/* Navigation buttons work for both image and video */}
        {!isFirstItem && (
          <button
            onClick={(e) => { stopPropagation(e); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all z-10"
            aria-label="Previous media"
          >
            <ChevronLeftIcon />
          </button>
        )}
        {!isLastItem && (
          <button
            onClick={(e) => { stopPropagation(e); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all z-10"
            aria-label="Next media"
          >
            <ChevronRightIcon />
          </button>
        )}
    </div>
  );
};

export default ViewMediaModal;
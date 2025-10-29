import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MediaItem } from '../types';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { SkipForwardIcon } from './icons/SkipForwardIcon';
import { SkipBackwardIcon } from './icons/SkipBackwardIcon';

interface VideoPlayerUIProps {
  media: MediaItem;
  onClose: () => void;
  onDelete: (media: MediaItem) => void;
}

const formatTime = (time: number) => {
  if (isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const VideoPlayerUI: React.FC<VideoPlayerUIProps> = ({ media, onClose, onDelete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  const hideControls = () => setIsControlsVisible(false);

  const resetControlsTimeout = useCallback(() => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(hideControls, 3000);
  }, []);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout, media]);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
      resetControlsTimeout();
    }
  }, [resetControlsTimeout]);

  const skip = useCallback((amount: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime += amount;
      resetControlsTimeout();
    }
  }, [resetControlsTimeout]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        skip(5);
      } else if (e.code === 'ArrowLeft') {
        skip(-5);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, skip]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setProgress(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };
  
  const handleProgressScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Number(e.target.value);
      setProgress(video.currentTime);
    }
  };

  const formattedDate = new Date(media.date).toLocaleString(undefined, {
    dateStyle: 'long', timeStyle: 'short',
  });

  return (
    <div
      className="relative w-full h-full flex items-center justify-center bg-black"
      onMouseMove={resetControlsTimeout}
      onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
    >
      <video
        ref={videoRef}
        src={media.objectURL}
        className="max-w-full max-h-full object-contain"
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <div
        className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 flex justify-between items-start text-white transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 mr-4">
          <h3 className="font-bold text-lg">{media.caption || 'No caption'}</h3>
          <p className="text-sm text-gray-300">{formattedDate}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => onDelete(media)} className="p-2 rounded-full hover:bg-white/10" aria-label="Delete video">
            <TrashIcon className="h-6 w-6 hover:text-red-500" />
          </button>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10" aria-label="Close video view">
            <XIcon />
          </button>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <span className="text-sm">{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={progress}
            onChange={handleProgressScrub}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <span className="text-sm">{formatTime(duration)}</span>
        </div>
        <div className="flex items-center justify-center gap-8 mt-2">
          <button onClick={() => skip(-5)} className="p-2 rounded-full hover:bg-white/10"><SkipBackwardIcon /></button>
          <button onClick={togglePlayPause} className="p-2 rounded-full hover:bg-white/10">{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
          <button onClick={() => skip(5)} className="p-2 rounded-full hover:bg-white/10"><SkipForwardIcon /></button>
        </div>
      </div>
    </div>
  );
};
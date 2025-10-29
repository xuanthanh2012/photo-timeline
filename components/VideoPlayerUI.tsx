import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MediaItem } from '../types';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { SkipForwardIcon } from './icons/SkipForwardIcon';
import { SkipBackwardIcon } from './icons/SkipBackwardIcon';
import { FullscreenIcon } from './icons/FullscreenIcon';
import { ExitFullscreenIcon } from './icons/ExitFullscreenIcon';

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
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  // FIX: Initialize useRef with a value. The call was missing an argument.
  const keyboardHandlerRef = useRef<((e: KeyboardEvent) => void) | undefined>(undefined);

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const resetControlsTimeout = useCallback(() => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
        setIsControlsVisible(false);
    }, 3000);
  }, []);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout, media]);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
  
  const toggleFullscreen = useCallback(() => {
    const playerContainer = playerContainerRef.current;
    if (!playerContainer) return;

    if (!document.fullscreenElement) {
        playerContainer.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const skip = useCallback((amount: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime += amount;
      resetControlsTimeout();
    }
  }, [resetControlsTimeout]);

  // Effect to update the ref with the latest handlers on each render
  useEffect(() => {
    keyboardHandlerRef.current = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skip(5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skip(-5);
      }
    };
  });

  // Effect to attach the event listener once
  useEffect(() => {
    const eventListener = (e: KeyboardEvent) => {
      if (keyboardHandlerRef.current) {
        keyboardHandlerRef.current(e);
      }
    };
    window.addEventListener('keydown', eventListener);
    return () => {
      window.removeEventListener('keydown', eventListener);
    };
  }, []);

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
      ref={playerContainerRef}
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
          <button onClick={(e) => { e.stopPropagation(); skip(-5); }} className="p-2 rounded-full hover:bg-white/10"><SkipBackwardIcon /></button>
          <button onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} className="p-2 rounded-full hover:bg-white/10">{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
          <button onClick={(e) => { e.stopPropagation(); skip(5); }} className="p-2 rounded-full hover:bg-white/10"><SkipForwardIcon /></button>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} 
            className="absolute right-4 bottom-4 p-2 rounded-full hover:bg-white/10"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};
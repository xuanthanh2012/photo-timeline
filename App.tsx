import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MediaItem, MediaItemMetadata, Filters } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { useLayout } from './hooks/useLayout';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Fab from './components/Fab';
import UploadModal from './components/UploadModal';
import ViewMediaModal from './components/ViewPhotoModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import { PlusIcon } from './components/icons/PlusIcon';
import SearchAndFilter from './components/SearchAndFilter';
import * as db from './db';

const App: React.FC = () => {
  useTheme();
  const { layout, cycleLayout } = useLayout();
  
  const [mediaMetadata, setMediaMetadata] = useLocalStorage<MediaItemMetadata[]>('mediaItemsMetadata', []);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);
  const [mediaItemsToDelete, setMediaItemsToDelete] = useState<MediaItem[]>([]);
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMediaItemIds, setSelectedMediaItemIds] = useState<Set<string>>(new Set());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({ dateRange: { start: '', end: '' } });

  useEffect(() => {
    let active = true;
    const loadMediaFiles = async () => {
      setIsLoading(true);
      const itemsWithURLs: MediaItem[] = await Promise.all(
        mediaMetadata.map(async (meta) => {
          const file = await db.getMediaFile(meta.id);
          const objectURL = file ? URL.createObjectURL(file) : '';
          return { ...meta, objectURL };
        })
      );

      if (active) {
        setMediaItems(currentItems => {
          // Revoke old URLs before setting new state to prevent memory leaks
          currentItems.forEach(item => URL.revokeObjectURL(item.objectURL));
          return itemsWithURLs.filter(item => item.objectURL); // Filter out items where file was not found
        });
        setIsLoading(false);
      }
    };

    loadMediaFiles();

    return () => {
      active = false;
    };
  }, [mediaMetadata]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
        mediaItems.forEach(item => URL.revokeObjectURL(item.objectURL));
    };
  }, [mediaItems]);

  const sortedMediaItems = useMemo(() => {
    return [...mediaItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [mediaItems]);

  const filteredMediaItems = useMemo(() => {
    return sortedMediaItems.filter(media => {
      const searchLower = searchQuery.toLowerCase();
      const captionMatch = media.caption.toLowerCase().includes(searchLower);
      if (searchQuery && !captionMatch) return false;
      const mediaDate = new Date(media.date);
      if (filters.dateRange.start) {
        if (mediaDate < new Date(filters.dateRange.start)) return false;
      }
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (mediaDate > endDate) return false;
      }
      return true;
    });
  }, [sortedMediaItems, searchQuery, filters]);

  const handleAddMedia = useCallback(async ({ file, caption }: { file: File, caption: string }) => {
    const newId = crypto.randomUUID();
    const newMediaMeta: MediaItemMetadata = {
      id: newId,
      date: new Date().toISOString(),
      caption,
      type: file.type.startsWith('image/') ? 'image' : 'video',
    };

    await db.addMediaFile(newId, file);
    setMediaMetadata(prev => [...prev, newMediaMeta]);
    setIsUploadModalOpen(false);
  }, [setMediaMetadata]);

  const handleSelectMedia = useCallback((mediaItem: MediaItem) => setSelectedMediaItem(mediaItem), []);
  
  const handleDeleteRequest = useCallback((mediaItem: MediaItem) => setMediaItemsToDelete([mediaItem]), []);

  const handleConfirmDelete = useCallback(async () => {
    if (mediaItemsToDelete.length === 0) return;
    
    const idsToDelete = new Set(mediaItemsToDelete.map(item => item.id));

    for (const id of idsToDelete) {
      await db.deleteMediaFile(id);
    }
    
    setMediaMetadata(prev => prev.filter(meta => !idsToDelete.has(meta.id)));
    
    if (selectedMediaItem && idsToDelete.has(selectedMediaItem.id)) {
      setSelectedMediaItem(null);
    }
    setMediaItemsToDelete([]);
    setIsSelectionMode(false);
    setSelectedMediaItemIds(new Set());
  }, [mediaItemsToDelete, setMediaMetadata, selectedMediaItem]);

  const handleCancelDelete = useCallback(() => setMediaItemsToDelete([]), []);

  const handleNextMedia = useCallback(() => {
    if (!selectedMediaItem) return;
    const currentIndex = filteredMediaItems.findIndex(p => p.id === selectedMediaItem.id);
    if (currentIndex < filteredMediaItems.length - 1) setSelectedMediaItem(filteredMediaItems[currentIndex + 1]);
  }, [selectedMediaItem, filteredMediaItems]);

  const handlePrevMedia = useCallback(() => {
    if (!selectedMediaItem) return;
    const currentIndex = filteredMediaItems.findIndex(p => p.id === selectedMediaItem.id);
    if (currentIndex > 0) setSelectedMediaItem(filteredMediaItems[currentIndex - 1]);
  }, [selectedMediaItem, filteredMediaItems]);

  const handleEnterSelectionMode = useCallback((mediaItem: MediaItem) => {
    setIsSelectionMode(true);
    setSelectedMediaItemIds(new Set([mediaItem.id]));
  }, []);

  const handleToggleSelection = useCallback((mediaItemId: string) => {
    setSelectedMediaItemIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(mediaItemId)) newIds.delete(mediaItemId);
      else newIds.add(mediaItemId);
      if (newIds.size === 0) setIsSelectionMode(false);
      return newIds;
    });
  }, []);

  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedMediaItemIds(new Set());
  }, []);

  const handleDeleteSelectedRequest = useCallback(() => {
    setMediaItemsToDelete(mediaItems.filter(p => selectedMediaItemIds.has(p.id)));
  }, [mediaItems, selectedMediaItemIds]);

  return (
    <div className="min-h-screen">
      <Header 
        onCycleLayout={cycleLayout} currentLayout={layout} isSelectionMode={isSelectionMode}
        selectedCount={selectedMediaItemIds.size} onCancelSelection={handleCancelSelection}
        onDeleteSelected={handleDeleteSelectedRequest}
      />
      <main className="container mx-auto px-4 py-8">
        <SearchAndFilter
          searchQuery={searchQuery} onSearchChange={setSearchQuery} filters={filters}
          onFilterChange={setFilters} allMedia={sortedMediaItems}
        />
        {isLoading ? (
            <div className="text-center py-20 text-gray-600 dark:text-text-secondary">Loading your media...</div>
        ) : filteredMediaItems.length > 0 ? (
          <Timeline 
            mediaItems={filteredMediaItems} onMediaClick={handleSelectMedia} onDeleteMedia={handleDeleteRequest}
            layout={layout} isSelectionMode={isSelectionMode} onEnterSelectionMode={handleEnterSelectionMode}
            onToggleSelection={handleToggleSelection} selectedMediaIds={selectedMediaItemIds}
          />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-text-main mb-2">
              {mediaMetadata.length > 0 ? 'No media match your filters' : 'Your timeline is empty'}
            </h2>
            <p className="text-gray-600 dark:text-text-secondary">
              {mediaMetadata.length > 0 ? 'Try adjusting your search or filters.' : "Click the '+' button to add your first photo or video."}
            </p>
          </div>
        )}
      </main>

      {!isSelectionMode && <Fab onClick={() => setIsUploadModalOpen(true)}><PlusIcon /></Fab>}
      {isUploadModalOpen && <UploadModal onClose={() => setIsUploadModalOpen(false)} onUpload={handleAddMedia} />}
      {selectedMediaItem && <ViewMediaModal media={selectedMediaItem} allMedia={filteredMediaItems} onClose={() => setSelectedMediaItem(null)} onDelete={handleDeleteRequest} onNext={handleNextMedia} onPrev={handlePrevMedia} />}
      {mediaItemsToDelete.length > 0 && <ConfirmDeleteModal count={mediaItemsToDelete.length} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />}
    </div>
  );
};

export default App;

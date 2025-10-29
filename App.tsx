import React, { useState, useMemo, useCallback } from 'react';
import { Photo, Filters } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { useLayout } from './hooks/useLayout';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Fab from './components/Fab';
import UploadModal from './components/UploadModal';
import ViewPhotoModal from './components/ViewPhotoModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import { PlusIcon } from './components/icons/PlusIcon';
import SearchAndFilter from './components/SearchAndFilter';

const App: React.FC = () => {
  useTheme(); // Initialize theme management
  const { layout, cycleLayout } = useLayout();
  const [photos, setPhotos] = useLocalStorage<Photo[]>('photos', []);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  // State for single and multiple photo deletion
  const [photosToDelete, setPhotosToDelete] = useState<Photo[]>([]);

  // State for multiple selection mode
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    dateRange: { start: '', end: '' },
  });

  const sortedPhotos = useMemo(() => {
    const validPhotos = Array.isArray(photos) ? photos.filter(p => p && p.id && p.date && p.dataUrl) : [];
    return [...validPhotos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return sortedPhotos.filter(photo => {
      const searchLower = searchQuery.toLowerCase();
      
      const captionMatch = photo.caption ? photo.caption.toLowerCase().includes(searchLower) : false;
      
      if (searchQuery && !captionMatch) return false;
      
      const photoDate = new Date(photo.date);
      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start);
        if (photoDate < startDate) return false;
      }
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        endDate.setHours(23, 59, 59, 999); // Set to end of day
        if (photoDate > endDate) return false;
      }
      
      return true;
    });
  }, [sortedPhotos, searchQuery, filters]);

  const handleAddPhoto = useCallback((newPhoto: Omit<Photo, 'id'>) => {
    setPhotos(prevPhotos => [
      { ...newPhoto, id: `photo-${Date.now()}` },
      ...prevPhotos
    ]);
    setIsUploadModalOpen(false);
  }, [setPhotos]);

  const handleSelectPhoto = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
  }, []);
  
  const handleDeleteRequest = useCallback((photo: Photo) => {
    setPhotosToDelete([photo]);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (photosToDelete.length === 0) return;
    const idsToDelete = new Set(photosToDelete.map(p => p.id));
    setPhotos(prevPhotos => prevPhotos.filter(p => !idsToDelete.has(p.id)));
    
    if (selectedPhoto && idsToDelete.has(selectedPhoto.id)) {
      setSelectedPhoto(null);
    }
    setPhotosToDelete([]);
    setIsSelectionMode(false);
    setSelectedPhotoIds(new Set());
  }, [setPhotos, photosToDelete, selectedPhoto]);

  const handleCancelDelete = useCallback(() => {
    setPhotosToDelete([]);
  }, []);

  const handleNextPhoto = useCallback(() => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex > -1 && currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1]);
    }
  }, [selectedPhoto, filteredPhotos]);

  const handlePrevPhoto = useCallback(() => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1]);
    }
  }, [selectedPhoto, filteredPhotos]);

  // --- Multiple Selection Handlers ---
  const handleEnterSelectionMode = useCallback((photo: Photo) => {
    setIsSelectionMode(true);
    setSelectedPhotoIds(new Set([photo.id]));
  }, []);

  const handleToggleSelection = useCallback((photoId: string) => {
    setSelectedPhotoIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(photoId)) {
        newIds.delete(photoId);
      } else {
        newIds.add(photoId);
      }
      // If last item is deselected, exit selection mode
      if (newIds.size === 0) {
        setIsSelectionMode(false);
      }
      return newIds;
    });
  }, []);

  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedPhotoIds(new Set());
  }, []);

  const handleDeleteSelectedRequest = useCallback(() => {
    const photosToDelete = photos.filter(p => selectedPhotoIds.has(p.id));
    setPhotosToDelete(photosToDelete);
  }, [photos, selectedPhotoIds]);

  return (
    <div className="min-h-screen">
      <Header 
        onCycleLayout={cycleLayout} 
        currentLayout={layout}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedPhotoIds.size}
        onCancelSelection={handleCancelSelection}
        onDeleteSelected={handleDeleteSelectedRequest}
      />
      <main className="container mx-auto px-4 py-8">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={setFilters}
          allPhotos={sortedPhotos}
        />
        {filteredPhotos.length > 0 ? (
          <Timeline 
            photos={filteredPhotos} 
            onPhotoClick={handleSelectPhoto} 
            onDeletePhoto={handleDeleteRequest}
            layout={layout}
            isSelectionMode={isSelectionMode}
            onEnterSelectionMode={handleEnterSelectionMode}
            onToggleSelection={handleToggleSelection}
            selectedPhotoIds={selectedPhotoIds}
          />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-text-main mb-2">
              {photos.length > 0 ? 'No photos match your filters' : 'Your timeline is empty'}
            </h2>
            <p className="text-gray-600 dark:text-text-secondary">
              {photos.length > 0 ? 'Try adjusting your search or filters.' : "Click the '+' button to add your first photo."}
            </p>
          </div>
        )}
      </main>

      {!isSelectionMode && (
          <Fab onClick={() => setIsUploadModalOpen(true)}>
            <PlusIcon />
          </Fab>
      )}

      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleAddPhoto}
        />
      )}

      {selectedPhoto && (
        <ViewPhotoModal
          photo={selectedPhoto}
          photos={filteredPhotos}
          onClose={() => setSelectedPhoto(null)}
          onDelete={handleDeleteRequest}
          onNext={handleNextPhoto}
          onPrev={handlePrevPhoto}
        />
      )}

      {photosToDelete.length > 0 && (
        <ConfirmDeleteModal
          count={photosToDelete.length}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default App;
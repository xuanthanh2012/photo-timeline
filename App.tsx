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
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  
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
    setPhotoToDelete(photo);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!photoToDelete) return;
    setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoToDelete.id));
    if (selectedPhoto?.id === photoToDelete.id) {
      setSelectedPhoto(null);
    }
    setPhotoToDelete(null);
  }, [setPhotos, photoToDelete, selectedPhoto]);

  const handleCancelDelete = useCallback(() => {
    setPhotoToDelete(null);
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

  return (
    <div className="min-h-screen">
      <Header onCycleLayout={cycleLayout} currentLayout={layout} />
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

      <Fab onClick={() => setIsUploadModalOpen(true)}>
        <PlusIcon />
      </Fab>

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

      {photoToDelete && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default App;
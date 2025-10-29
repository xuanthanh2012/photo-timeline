import React, { useState, useMemo, useCallback } from 'react';
import { Photo } from './types';
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

const App: React.FC = () => {
  useTheme(); // Initialize theme management
  const { layout, cycleLayout } = useLayout();
  const [photos, setPhotos] = useLocalStorage<Photo[]>('photos', []);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);

  const sortedPhotos = useMemo(() => {
    // Filter out invalid photo objects to prevent crashes from malformed data
    // that might exist in localStorage from older versions of the app.
    const validPhotos = Array.isArray(photos) ? photos.filter(p => p && p.id && p.date && p.dataUrl) : [];
    return [...validPhotos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [photos]);

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
    const currentIndex = sortedPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex > -1 && currentIndex < sortedPhotos.length - 1) {
      setSelectedPhoto(sortedPhotos[currentIndex + 1]);
    }
  }, [selectedPhoto, sortedPhotos]);

  const handlePrevPhoto = useCallback(() => {
    if (!selectedPhoto) return;
    const currentIndex = sortedPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex > 0) {
      setSelectedPhoto(sortedPhotos[currentIndex - 1]);
    }
  }, [selectedPhoto, sortedPhotos]);

  return (
    <div className="min-h-screen">
      <Header onCycleLayout={cycleLayout} currentLayout={layout} />
      <main className="container mx-auto px-4 py-8">
        {sortedPhotos.length > 0 ? (
          <Timeline 
            photos={sortedPhotos} 
            onPhotoClick={handleSelectPhoto} 
            onDeletePhoto={handleDeleteRequest}
            layout={layout}
          />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-text-main mb-2">Your timeline is empty</h2>
            <p className="text-gray-600 dark:text-text-secondary">Click the '+' button to add your first photo.</p>
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
          photos={sortedPhotos}
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
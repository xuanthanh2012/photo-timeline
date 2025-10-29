
import React, { useState, useMemo, useCallback } from 'react';
import { Photo } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Fab from './components/Fab';
import UploadModal from './components/UploadModal';
import ViewPhotoModal from './components/ViewPhotoModal';
import { PlusIcon } from './components/icons/PlusIcon';

const App: React.FC = () => {
  const [photos, setPhotos] = useLocalStorage<Photo[]>('photos', []);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const sortedPhotos = useMemo(() => {
    return [...photos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
  
  const handleDeletePhoto = useCallback((photoId: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
    setSelectedPhoto(null); // Close modal after deletion
  }, [setPhotos]);

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {sortedPhotos.length > 0 ? (
          <Timeline photos={sortedPhotos} onPhotoClick={handleSelectPhoto} />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-text-main mb-2">Your timeline is empty</h2>
            <p className="text-text-secondary">Click the '+' button to add your first photo.</p>
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
          onClose={() => setSelectedPhoto(null)}
          onDelete={handleDeletePhoto}
        />
      )}
    </div>
  );
};

export default App;
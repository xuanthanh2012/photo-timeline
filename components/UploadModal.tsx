import React, { useState, useRef, useCallback } from 'react';
import { Photo } from '../types';
import { XIcon } from './icons/XIcon';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (photo: Omit<Photo, 'id'>) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleUpload = useCallback(() => {
    if (previewUrl) {
      onUpload({
        date: new Date().toISOString(),
        caption,
        dataUrl: previewUrl,
      });
    }
  }, [previewUrl, caption, onUpload]);

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 flex items-center justify-center z-40 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-secondary rounded-lg shadow-xl w-full max-w-2xl relative animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-text-main">Add New Photo</h2>
            <button onClick={onClose} className="text-gray-500 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-main">
              <XIcon />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
                <div
                    className="w-full aspect-square bg-gray-100 dark:bg-primary rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-500 dark:text-text-secondary cursor-pointer hover:border-accent hover:text-accent transition-colors relative"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span>Click to select image</span>
                        </>
                    )}
                </div>
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
            <div className="md:w-1/2 space-y-4">
                <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a caption..."
                    rows={3}
                    className="w-full bg-gray-100 dark:bg-primary text-gray-900 dark:text-text-main p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-shadow"
                />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-primary px-6 py-4 rounded-b-lg flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-800 dark:text-text-main bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
          <button
            onClick={handleUpload}
            disabled={!previewUrl}
            className="px-4 py-2 rounded-md text-white bg-accent hover:bg-blue-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
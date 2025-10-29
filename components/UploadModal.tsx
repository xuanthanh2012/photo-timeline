
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4" onClick={onClose}>
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-md relative animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-text-main">Add New Photo</h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text-main">
              <XIcon />
            </button>
          </div>

          <div className="space-y-4">
            {previewUrl ? (
              <div className="w-full aspect-video bg-primary rounded-md overflow-hidden flex items-center justify-center">
                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full" />
              </div>
            ) : (
               <div
                 className="w-full aspect-video bg-primary rounded-md border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-text-secondary cursor-pointer hover:border-accent hover:text-accent transition-colors"
                 onClick={() => fileInputRef.current?.click()}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>Click to select image</span>
               </div>
            )}
             <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add an optional caption..."
              rows={3}
              className="w-full bg-primary text-text-main p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-shadow"
            />
          </div>
        </div>

        <div className="bg-primary px-6 py-4 rounded-b-lg flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-text-main bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
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
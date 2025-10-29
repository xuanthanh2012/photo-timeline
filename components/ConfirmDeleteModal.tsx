import React from 'react';

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  count?: number;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ onConfirm, onCancel, count = 1 }) => {
  const message = count > 1 
    ? `Bạn có chắc chắn xoá ${count} tấm ảnh này không?`
    : "Bạn có chắc chắn xoá tấm ảnh này không?";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div 
        className="bg-white dark:bg-secondary rounded-lg shadow-xl w-full max-w-sm relative animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-text-main mb-4">{message}</h3>
        </div>
        <div className="bg-gray-50 dark:bg-primary px-6 py-4 rounded-b-lg flex justify-end space-x-3">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 rounded-md text-gray-800 dark:text-text-main bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            No
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
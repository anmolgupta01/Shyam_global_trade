import React from 'react';
import { X } from 'lucide-react';

const BannerModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  selectedFile,
  previewUrl,
  onFileChange,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl 
                       transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Replace Banner Image' : 'Add New Banner'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="banner-file" className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image *
                {isEditing && (
                  <span className="text-blue-600 font-normal"> (Select new image to replace)</span>
                )}
              </label>
              <input
                type="file"
                id="banner-file"
                accept="image/*"
                onChange={onFileChange}
                required={!isEditing}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                         file:rounded-full file:border-0 file:text-sm file:font-semibold 
                         file:bg-[#254F7E] file:text-white hover:file:bg-[#1e3f66]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF, WebP (max 5MB)
              </p>
            </div>

            {/* File info */}
            {selectedFile && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">File Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Name:</strong> {selectedFile.name}</p>
                  <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                </div>
              </div>
            )}

            {/* Preview */}
            {previewUrl && (
              <div className="text-center">
                <h4 className="font-medium text-gray-900 mb-3">
                  {isEditing && !selectedFile ? 'Current Image:' : 'Preview:'}
                </h4>
                <img
                  src={previewUrl}
                  alt="Banner preview"
                  className="max-w-full max-h-80 object-contain mx-auto border border-gray-200 rounded"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                         rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#254F7E] 
                         disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (!selectedFile && !isEditing)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#254F7E] border border-transparent 
                         rounded-md hover:bg-[#1e3f66] focus:outline-none focus:ring-2 focus:ring-[#254F7E] 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (isEditing ? 'Replace Banner' : 'Add Banner')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BannerModal;

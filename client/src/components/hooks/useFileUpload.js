import { useState, useCallback } from 'react';

export const useFileUpload = ({ maxSize = 5 * 1024 * 1024, allowedTypes = [] }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const validateFile = useCallback((file) => {
    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.includes(type.split('/')[1]))) {
      return { valid: false, error: 'Invalid file type' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit` };
    }

    return { valid: true };
  }, [maxSize, allowedTypes]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        e.target.value = '';
        setSelectedFile(null);
        setPreviewUrl('');
        return;
      }

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl('');
    }
  }, [validateFile]);

  const resetFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl('');
  }, []);

  return {
    selectedFile,
    previewUrl,
    handleFileChange,
    resetFile,
    validateFile
  };
};

import React, { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useBanners } from '../../hooks/useBanners';
import { useFileUpload } from '../../hooks/useFileUpload';
import BannerCard from './BannerCard';
import BannerModal from './BannerModal';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { EmptyState } from '../../ui/EmptyState';
import Toast from '../../ui/Toast';

const BannerManager = React.memo(() => {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [toast, setToast] = useState(null);

  // Use your existing hook with new CRUD methods
  const {
    banners = [], // Default to empty array to prevent undefined errors
    loading = false,
    error = null,
    createBanner,
    updateBanner,
    deleteBanner,
    fetchBanners
  } = useBanners() || {}; // Fallback if hook returns undefined

  const {
    selectedFile,
    previewUrl,
    handleFileChange,
    resetFile,
    validateFile
  } = useFileUpload({
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  }) || {}; // Fallback if hook returns undefined

  const bannerCount = useMemo(() => (banners ? banners.length : 0), [banners]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleOpenModal = useCallback(() => {
    setEditingBanner(null);
    if (resetFile) resetFile();
    setShowModal(true);
  }, [resetFile]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingBanner(null);
    if (resetFile) resetFile();
  }, [resetFile]);

  const handleEdit = useCallback((banner) => {
    if (!banner) {
      showToast('Invalid banner data', 'error');
      return;
    }
    setEditingBanner(banner);
    setShowModal(true);
  }, [showToast]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      showToast('Please select an image file', 'error');
      return;
    }

    // Check if validateFile function exists
    if (validateFile) {
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
        showToast(validation.error, 'error');
        return;
      }
    }

    try {
      if (editingBanner) {
        if (updateBanner) {
          await updateBanner(editingBanner._id, selectedFile);
          showToast('Banner updated successfully!');
        } else {
          throw new Error('Update function not available');
        }
      } else {
        if (createBanner) {
          await createBanner(selectedFile);
          showToast('Banner created successfully!');
        } else {
          throw new Error('Create function not available');
        }
      }
      
      handleCloseModal();
    } catch (error) {
      // Enhanced error handling for Cloudinary-specific errors
      let errorMessage = error?.message || 'Error saving banner';
      if (error?.message?.includes('cloud storage')) {
        errorMessage = 'Failed to upload image to cloud storage. Please try again.';
      }
      showToast(errorMessage, 'error');
      console.error('Banner operation failed:', error);
    }
  }, [selectedFile, editingBanner, updateBanner, createBanner, validateFile, showToast, handleCloseModal]);

  const handleDelete = useCallback(async (id) => {
    if (!id) {
      showToast('Invalid banner ID', 'error');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      if (deleteBanner) {
        await deleteBanner(id);
        showToast('Banner deleted successfully!');
      } else {
        throw new Error('Delete function not available');
      }
    } catch (error) {
      showToast(error?.message || 'Error deleting banner', 'error');
      console.error('Delete operation failed:', error);
    }
  }, [deleteBanner, showToast]);

  const handleRetry = useCallback(() => {
    if (fetchBanners) {
      fetchBanners();
    } else {
      showToast('Retry function not available', 'error');
    }
  }, [fetchBanners, showToast]);

  // Error boundary for hook failures
  if (!useBanners || !useFileUpload) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to initialize banner management. Please check your hooks.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Banner Management | Admin Dashboard</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Banner Management</h2>
            <p className="text-gray-600 mt-1">
              Manage banner images for your website carousel
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {bannerCount} banner{bannerCount !== 1 ? 's' : ''}
            </span>
            <button
              onClick={handleOpenModal}
              disabled={loading}
              className="px-4 py-2 bg-[#254F7E] text-white rounded-lg hover:bg-[#1e3f66] 
                       transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add New Banner
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Loading banners..." />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-[#254F7E] text-white rounded hover:bg-[#1e3f66] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : Array.isArray(banners) && banners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map(banner => (
              <BannerCard
                key={banner?._id || Math.random()} // Fallback key if _id is missing
                banner={banner}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🖼️"
            title="No banners found"
            description="Create your first banner to get started with your image carousel."
            action={
              <button
                onClick={handleOpenModal}
                className="px-6 py-3 bg-[#254F7E] text-white rounded-lg hover:bg-[#1e3f66] transition-colors"
              >
                Add First Banner
              </button>
            }
          />
        )}

        {/* Modal */}
        {showModal && (
          <BannerModal
            isOpen={showModal}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            isEditing={!!editingBanner}
            selectedFile={selectedFile}
            previewUrl={previewUrl || editingBanner?.image}
            onFileChange={handleFileChange}
            loading={loading}
          />
        )}

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
});

BannerManager.displayName = 'BannerManager';

export default BannerManager;

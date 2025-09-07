import React, { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useFeedback } from '../../hooks/useFeedback';
import FeedbackList from './FeedbackList';
import LoadingSpinner  from '../../ui/LoadingSpinner';
import  Toast  from '../../ui/Toast';
import { RefreshCw } from 'lucide-react';

const FeedbackManager = React.memo(() => {
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);

  const ITEMS_PER_PAGE = 10;

  // Custom hook for feedback management
  const {
    feedback,
    loading,
    stats,
    pagination,
    deleteFeedback,
    refetch,
    error
  } = useFeedback({ page: 1, limit: 10, isAdmin: true });


  // Toast management
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Memoized stats for performance
  const feedbackStats = useMemo(() => ({
    total: stats?.totalFeedback || 0,
    recent: stats?.recentFeedback || 0,
    today: stats?.todaysFeedback || 0
  }), [stats]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.pages || 1)) {
      setCurrentPage(newPage);
    }
  }, [pagination]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
      showToast('Feedback refreshed successfully!');
    } catch (error) {
      showToast('Failed to refresh feedback', 'error');
    }
  }, [refetch, showToast]);

  // Handle delete
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteFeedback(id);
      showToast('Feedback deleted successfully!');
      
      // Adjust page if current page becomes empty
      const remainingItems = feedback.length - 1;
      if (remainingItems === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      showToast(error.message || 'Failed to delete feedback', 'error');
    }
  }, [deleteFeedback, feedback.length, currentPage, showToast]);

  return (
    <>
      <Helmet>
        <title>Feedback Management | Admin Dashboard</title>
        <meta name="description" content="Manage customer feedback and reviews" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Feedback Management</h2>
            <p className="text-gray-600">Monitor and manage customer feedback</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="mt-4 md:mt-0 px-4 py-2 bg-[#254F7E] text-white rounded-lg hover:bg-[#1e3f66] 
                     transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

      

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="mb-2">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Feedback Content */}
        {loading && feedback.length === 0 ? (
          <LoadingSpinner message="Loading feedback..." />
        ) : (
          <FeedbackList
            feedback={feedback}
            loading={loading}
            pagination={pagination}
            currentPage={currentPage}
            onDelete={handleDelete}
            onPageChange={handlePageChange}
          />
        )}

        {/* Toast Notifications */}
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

FeedbackManager.displayName = 'FeedbackSection';

export default FeedbackManager;

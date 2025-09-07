import { useState, useCallback, useEffect } from 'react';

const API_CONFIG = {
  FEEDBACK_URL: `${process.env.REACT_APP_API_URL}/api/feedback`
};

export const useFeedback = (options = {}) => {
  // Existing state for feedback submission
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [error, setError] = useState(null);

  // New state for feedback management (admin)
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Extract options
  const { page = 1, limit = 10, isAdmin = false } = options;

  // Existing reset function
  const resetFeedback = useCallback(() => {
    setFeedbackMessage('');
    setSubmitStatus(null);
    setError(null);
  }, []);

  // Existing submit function
  const submitFeedback = useCallback(async () => {
    if (!feedbackMessage.trim() || feedbackMessage.trim().length < 5) {
      setError('Please enter at least 5 characters.');
      return false;
    }

    setIsSubmitting(true);
    setError(null);
    setSubmitStatus(null);

    try {
      const response = await fetch(API_CONFIG.FEEDBACK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: feedbackMessage.trim(),
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          page: 'home'
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setSubmitStatus('success');
      setTimeout(resetFeedback, 3000);
      return true;

    } catch (err) {
      setError(err.message);
      setSubmitStatus('error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [feedbackMessage, resetFeedback]);

  // NEW: Fetch feedback list for admin
  const fetchFeedbackList = useCallback(async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.FEEDBACK_URL}?page=${page}&limit=${limit}&sortBy=submittedAt&sortOrder=desc`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setFeedbackList(data.data.feedback || []);
        setPagination(data.data.pagination);
      } else {
        throw new Error('Failed to fetch feedback');
      }
    } catch (err) {
      setError(err.message || 'Failed to load feedback');
      setFeedbackList([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, isAdmin]);

  // NEW: Fetch feedback stats for admin
  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const response = await fetch(`${API_CONFIG.FEEDBACK_URL}/stats`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data.overview);
        }
      }
    } catch (err) {
      console.error('Failed to fetch feedback stats:', err);
    }
  }, [isAdmin]);

  // NEW: Delete feedback for admin
  const deleteFeedback = useCallback(async (id) => {
    if (!isAdmin) return;

    const response = await fetch(`${API_CONFIG.FEEDBACK_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete feedback');
    }

    // Refresh data after deletion
    await fetchFeedbackList();
    await fetchStats();
  }, [isAdmin, fetchFeedbackList, fetchStats]);

  // NEW: Refetch all admin data
  const refetch = useCallback(async () => {
    if (!isAdmin) return;

    await Promise.all([fetchFeedbackList(), fetchStats()]);
  }, [isAdmin, fetchFeedbackList, fetchStats]);

  // Auto-fetch data for admin
  useEffect(() => {
    if (isAdmin) {
      fetchFeedbackList();
      fetchStats();
    }
  }, [isAdmin, fetchFeedbackList, fetchStats]);

  // Return appropriate data based on usage
  if (isAdmin) {
    // Admin usage - return feedback management data
    return {
      // Admin-specific data
      feedback: feedbackList,
      loading,
      stats,
      pagination,
      deleteFeedback,
      refetch,
      error,
      
      // Still include submission functionality
      feedbackMessage,
      setFeedbackMessage,
      submitFeedback,
      resetFeedback,
      isSubmitting,
      submitStatus
    };
  } else {
    // Regular usage - return submission data only
    return {
      feedbackMessage,
      setFeedbackMessage,
      submitFeedback,
      resetFeedback,
      isSubmitting,
      submitStatus,
      error
    };
  }
};

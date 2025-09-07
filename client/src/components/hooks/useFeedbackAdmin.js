import { useState, useEffect, useCallback } from 'react';

const API_CONFIG = {
  FEEDBACK_URL:  'https://shyam-international.onrender.com/api/feedback'
};

export const useFeedbackAdmin = ({ page = 1, limit = 10 }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.FEEDBACK_URL}?page=${page}&limit=${limit}&sortBy=submittedAt&sortOrder=desc`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setFeedback(data.data.feedback || []);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load feedback');
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const fetchStats = useCallback(async () => {
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
  }, []);

  const deleteFeedback = useCallback(async (id) => {
    const response = await fetch(`${API_CONFIG.FEEDBACK_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete feedback');
    }

    await fetchFeedback();
    await fetchStats();
  }, [fetchFeedback, fetchStats]);

  const refetch = useCallback(async () => {
    await Promise.all([fetchFeedback(), fetchStats()]);
  }, [fetchFeedback, fetchStats]);

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, [fetchFeedback, fetchStats]);

  return {
    feedback,
    loading,
    error,
    stats,
    pagination,
    deleteFeedback,
    refetch
  };
};

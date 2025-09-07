import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

export const useContacts = ({ page = 1, status = 'all', search = '' }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [totalPages, setTotalPages] = useState(1);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(status !== 'all' && { status }),
        ...(search && { search })
      });

      const response = await api.get(`/contact/submissions?${params}`);
      
      if (response.data.success) {
        setContacts(response.data.data.contacts || []);
        setTotalPages(response.data.data.pagination?.pages || 1);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch contacts');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/contact/stats');
      if (response.data.success) {
        setStats(response.data.data || {});
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const deleteContact = useCallback(async (id) => {
    await api.delete(`/contact/${id}`);
    await fetchContacts();
    await fetchStats();
  }, [fetchContacts, fetchStats]);

  const updateContactStatus = useCallback(async (id, newStatus) => {
    await api.patch(`/contact/${id}/status`, { status: newStatus });
    
    // Update local state
    setContacts(prev => prev.map(contact => 
      contact._id === id ? { ...contact, status: newStatus } : contact
    ));
    
    await fetchStats();
  }, [fetchStats]);

  const getContactDetails = useCallback(async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data.data || response.data;
  }, []);

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [fetchContacts, fetchStats]);

  return {
    contacts,
    loading,
    error,
    stats,
    totalPages,
    deleteContact,
    updateContactStatus,
    getContactDetails,
    refetch: fetchContacts
  };
};

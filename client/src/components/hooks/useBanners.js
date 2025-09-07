import { useState, useEffect, useCallback } from 'react';

const API_CONFIG = {
  BANNERS_URL: `${process.env.REACT_APP_API_URL}/api/banners`
};


export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setConnectionStatus('connecting');
      
      const response = await fetch(API_CONFIG.BANNERS_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned HTML instead of JSON - check if your backend API is running');
      }
      
      const data = await response.json();
      
      let bannersArray;
      if (data.success && data.data) {
        bannersArray = Array.isArray(data.data) ? data.data : [data.data];
      } else if (Array.isArray(data)) {
        bannersArray = data;
      } else {
        bannersArray = [];
      }
      
      setBanners(bannersArray);
      setConnectionStatus('connected');
      
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching banners:', err);
      }
      setError(`Failed to load banners: ${err.message}`);
      setConnectionStatus('disconnected');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE: Add new banner
  const createBanner = useCallback(async (file) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(API_CONFIG.BANNERS_URL, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        // Enhanced error handling for Cloudinary-specific errors
        if (errorData.includes('Image upload failed')) {
          throw new Error('Failed to upload image to cloud storage. Please try again.');
        }
        throw new Error(`Failed to create banner: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Refresh banners list
      await fetchBanners();
      
      return result;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error creating banner:', err);
      }
      throw new Error(err.message || 'Failed to create banner');
    } finally {
      setLoading(false);
    }
  }, [fetchBanners]);

  // UPDATE: Update existing banner
  const updateBanner = useCallback(async (id, file) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_CONFIG.BANNERS_URL}/${id}`, {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        // Enhanced error handling for Cloudinary-specific errors
        if (errorData.includes('Image upload failed')) {
          throw new Error('Failed to upload image to cloud storage. Please try again.');
        }
        throw new Error(`Failed to update banner: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Refresh banners list
      await fetchBanners();
      
      return result;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating banner:', err);
      }
      throw new Error(err.message || 'Failed to update banner');
    } finally {
      setLoading(false);
    }
  }, [fetchBanners]);

  // DELETE: Delete banner
  const deleteBanner = useCallback(async (id) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_CONFIG.BANNERS_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete banner: ${response.status}`);
      }
      
      // Refresh banners list
      await fetchBanners();
      
      return true;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting banner:', err);
      }
      throw new Error(err.message || 'Failed to delete banner');
    } finally {
      setLoading(false);
    }
  }, [fetchBanners]);

  const testConnection = useCallback(async () => {
    try {
      const response = await fetch(API_CONFIG.BANNERS_URL);
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return { 
    banners, 
    loading, 
    error, 
    connectionStatus, 
    fetchBanners, 
    createBanner,
    updateBanner,
    deleteBanner,
    testConnection 
  };
};

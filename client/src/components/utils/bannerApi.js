// utils/bannerApi.js
import { useState } from 'react';

// Configuration - Updated to use consistent environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://shyam-international.onrender.com';

// Helper function to properly transform image URLs
const getCorrectImageUrl = (imagePath) => {
  if (!imagePath) {
    console.warn('No image path provided');
    return null;
  }

  // If it's already a full URL (http:// or https://), use it as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
   
    return imagePath;
  }
  
  // If it starts with '/', it's an absolute path from server root
  if (imagePath.startsWith('/')) {
    const fullUrl = `${API_BASE_URL}${imagePath}`;
    
    return fullUrl;
  }
  
  // Otherwise, it's a relative path that needs the uploads prefix
  const fullUrl = `${API_BASE_URL}/uploads/banners/${imagePath}`;

  return fullUrl;
};

// Helper function to check if server is running
const checkServerConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const bannerAPI = {
  // Get all banners with improved error handling
  getAllBanners: async () => {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/api/banners`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
  
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - Server took too long to respond');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Cannot connect to server. Please ensure the backend server is running on ' + API_BASE_URL);
      } else {
        console.error('Error fetching banners:', error);
        throw error;
      }
    }
  },

  // Get active banners only with flexible filtering
  getActiveBanners: async () => {
    try {
      const banners = await bannerAPI.getAllBanners();
    
      if (!Array.isArray(banners)) {
        console.warn('Banners is not an array:', banners);
        return [];
      }

      // More flexible filtering - if no status field exists, consider it active
      const activeBanners = banners.filter(banner => {
        if (!banner) return false;
        
        // If no status field, consider it active
        if (!banner.hasOwnProperty('status')) {
          return true;
        }
        
        // Check various status formats
        const status = banner.status;
        return status === 'active' || 
               status === 'Active' || 
               status === 'ACTIVE' ||
               status === true ||
               status === 1;
      });
      
    
      return activeBanners;
    } catch (error) {
      console.error('Error fetching active banners:', error);
      throw error;
    }
  },

  // Get banner by ID with error handling
  getBannerById: async (id) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL}/api/banners/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      console.error('Error fetching banner:', error);
      throw error;
    }
  },

  // FIXED: Transform banner data for ImageCarousel component with proper URL handling
  transformBannersForCarousel: (banners) => {
    if (!Array.isArray(banners)) {
      console.warn('Expected array of banners, received:', banners);
      return [];
    }

  
    const transformed = banners
      .filter(banner => {
        // More flexible status checking
        const isActive = !banner.status || 
                        banner.status === 'active' || 
                        banner.status === 'Active' || 
                        banner.status === 'ACTIVE' ||
                        banner.status === true ||
                        banner.status === 1;
        
     
        return banner && isActive;
      })
      .map((banner, index) => {
        // Get the raw image path from various possible fields
        const rawImagePath = banner.imageUrl || banner.image || banner.bannerImage || banner.src || banner.url;
        
        // Transform the URL properly
        const transformedSrc = getCorrectImageUrl(rawImagePath);
        
        const transformedBanner = {
          src: transformedSrc,
          alt: banner.alt || banner.title || 'Banner image',
          title: banner.title || '',
          description: banner.description || '',
          id: banner.id || banner._id || `banner-${index}`
        };
        
     
        
        return transformedBanner;
      })
      .filter(banner => {
        const hasValidSrc = banner.src && banner.src.trim() !== '';

        return hasValidSrc;
      });

    
    return transformed;
  },

  // Test connection to server
  testConnection: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/api/banners`, {
        method: 'HEAD', // Just check if endpoint exists
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok || response.status === 404; // 404 is OK, means server is running
    } catch (error) {
      return false;
    }
  },

  // Create a new banner (admin function)
  createBanner: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/banners`, {
        method: 'POST',
        body: formData, // FormData object for file upload
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },

  // Update banner (admin function)
  updateBanner: async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/banners/${id}`, {
        method: 'PUT',
        body: formData, // FormData object for file upload
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  },

  // Toggle banner status (admin function)
  toggleBannerStatus: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/banners/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling banner status:', error);
      throw error;
    }
  },

  // Delete banner (admin function)
  deleteBanner: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  }
};

// Custom hook for banner management with improved error handling
export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('unknown'); // 'connected', 'disconnected', 'unknown'

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First test the connection
      const isConnected = await bannerAPI.testConnection();
      if (!isConnected) {
        setConnectionStatus('disconnected');
        throw new Error('Backend server is not running or not accessible');
      }
      
      setConnectionStatus('connected');
      const data = await bannerAPI.getActiveBanners();
      const transformedBanners = bannerAPI.transformBannersForCarousel(data);
      setBanners(transformedBanners);
      
     
    } catch (err) {
      setError(err.message);
      setConnectionStatus('disconnected');
      setBanners([]); // Set empty array on error
      console.error('Banner fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshBanners = () => {
    fetchBanners();
  };

  // Test connection without setting loading state
  const testConnection = async () => {
    try {
      const isConnected = await bannerAPI.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      return isConnected;
    } catch (error) {
      setConnectionStatus('disconnected');
      return false;
    }
  };

  return {
    banners,
    loading,
    error,
    connectionStatus,
    refreshBanners,
    fetchBanners,
    testConnection
  };
};

export default bannerAPI;

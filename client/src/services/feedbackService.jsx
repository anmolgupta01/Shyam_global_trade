// feedbackService.js - Frontend service to handle API calls

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

class FeedbackService {
  static async submitFeedback(message, email = null, rating = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          email: email || undefined,
          rating: rating || undefined,
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          page: window.location.pathname
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to submit feedback');
      }

      return data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  static async getFeedback(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add optional filters
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.rating) {
        params.append('rating', filters.rating.toString());
      }
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
      }
      if (filters.sortOrder) {
        params.append('sortOrder', filters.sortOrder);
      }

      const response = await fetch(`${API_BASE_URL}/feedback?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch feedback');
      }

      return data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  }

  static async getFeedbackStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/stats`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch feedback statistics');
      }

      return data;
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      throw error;
    }
  }

  static async updateFeedbackStatus(id, status) {
    try {
      // Fixed: Use PUT method and correct endpoint path
      const response = await fetch(`${API_BASE_URL}/feedback/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update feedback status');
      }

      return data;
    } catch (error) {
      console.error('Error updating feedback status:', error);
      throw error;
    }
  }

  static async deleteFeedback(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to delete feedback');
      }

      return data;
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  }

  static async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }

  // Utility method to validate feedback data before submission
  static validateFeedback(message, email = null, rating = null) {
    const errors = [];

    if (!message || !message.trim()) {
      errors.push('Message is required');
    }

    if (message && message.length > 2000) {
      errors.push('Message is too long (maximum 2000 characters)');
    }

    if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.push('Invalid email address');
    }

    if (rating && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
      errors.push('Rating must be an integer between 1 and 5');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Utility method to format error messages
  static formatError(error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    return error.message || 'An unexpected error occurred';
  }
}

export default FeedbackService;

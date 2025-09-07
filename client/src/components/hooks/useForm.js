import { useState, useCallback } from 'react';

export const useForm = ({ initialData, apiEndpoint }) => {
  const [formData, setFormData] = useState(initialData);
  const [formState, setFormState] = useState({
    isSubmitting: false,
    isSubmitted: false,
    errors: {},
    message: '',
    emailSummary: null
  });

  const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    if (formState.errors[fieldName]) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [fieldName]: ''
        }
      }));
    }
  }, [formState.errors]);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.message?.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    return errors;
  }, [formData]);

  // Modified handleSubmit function using environment variable
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({ ...prev, errors }));
      return { success: false, errors };
    }

    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      errors: {},
      message: '',
      emailSummary: null
    }));

    try {
      const response = await fetch(`${API_BASE_URL}${apiEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
          isSubmitted: true,
          message: data.message,
          emailSummary: data.data?.emailSummary
        }));

        // Reset form
        setFormData(initialData);

        // Clear success message after 8 seconds
        setTimeout(() => {
          setFormState(prev => ({
            ...prev,
            isSubmitted: false,
            message: '',
            emailSummary: null
          }));
        }, 8000);

        return { success: true, data };

      } else {
        // Handle errors
        if (data.errors && Array.isArray(data.errors)) {
          const backendErrors = {};
          data.errors.forEach(error => {
            backendErrors[error.path] = error.msg;
          });
          setFormState(prev => ({
            ...prev,
            isSubmitting: false,
            errors: backendErrors
          }));
        } else {
          setFormState(prev => ({
            ...prev,
            isSubmitting: false,
            message: data.message || 'Something went wrong. Please try again.'
          }));
        }
        return { success: false, message: data.message };
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        message: 'Network error. Please check your connection and try again.'
      }));
      return { success: false, error: error.message };
    }
  }, [formData, validateForm, initialData, apiEndpoint, API_BASE_URL]);

  return {
    formData,
    formState,
    handleInputChange,
    handleSubmit,
    clearFieldError
  };
};

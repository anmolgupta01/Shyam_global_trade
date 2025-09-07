import React, { useCallback, useMemo, useState } from 'react';

import {FormField} from './form/FormField';
import {FormTextarea} from './form/FormTextarea';
import {SubmitButton} from './form/SubmitButton';
import StatusMessage from '../components/form/StatusMessage';
import ContactInfoSection from './form/ContactInfoSection';
import { useForm } from '../components/hooks/useForm';

const ContactForm = React.memo(({ variant = 'default', showContactInfo = false }) => {
  const [toast, setToast] = useState(null);

  const { formData, formState, handleInputChange, handleSubmit, clearFieldError } = useForm({
    initialData: { name: '', email: '', phone: '', company: '', message: '' },
    apiEndpoint: '/contact/submit'
  });

  const formFields = useMemo(() => [
    { name: 'name', type: 'text', placeholder: 'Name *', required: true },
    { name: 'email', type: 'email', placeholder: 'Email *', required: true },
    { name: 'phone', type: 'tel', placeholder: 'Phone Number *', required: true },
    { name: 'company', type: 'text', placeholder: 'Company Name', required: false }
  ], []);

  const showToast = useCallback((message, type = 'info') => setToast({ message, type }), []);
  const hideToast = useCallback(() => setToast(null), []);

  const onInputChange = useCallback((e) => {
    handleInputChange(e);
    clearFieldError(e.target.name);
  }, [handleInputChange, clearFieldError]);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const result = await handleSubmit(e);
      showToast(
        result.success ? 'Message sent successfully! We\'ll get back to you soon.' : 'Something went wrong. Please try again.',
        result.success ? 'success' : 'error'
      );
    } catch (error) {
      showToast(error.message || 'Failed to send message. Please try again.', 'error');
    }
  }, [handleSubmit, showToast]);

  const showValidationErrors = useCallback(() => {
    const firstError = Object.values(formState.errors)[0];
    if (firstError) showToast(firstError, 'warning');
  }, [formState.errors, showToast]);

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Quick Contact</h3>
          <p className="text-gray-600 text-sm">Get in touch for personalized assistance</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          {formFields.map((field) => (
            <FormField
              key={field.name}
              {...field}
              value={formData[field.name]}
              onChange={onInputChange}
              error={formState.errors[field.name]}
              disabled={formState.isSubmitting}
            />
          ))}

          <FormTextarea
            name="message"
            placeholder="Message *"
            rows={3}
            value={formData.message}
            onChange={onInputChange}
            error={formState.errors.message}
            disabled={formState.isSubmitting}
            required
          />

          <SubmitButton
            isSubmitting={formState.isSubmitting}
            variant="compact"
            onClick={showValidationErrors}
          />

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to receive email notifications from our team.
            </p>
          </div>
        </form>

        {toast && (
          <StatusMessage
            message={toast.message}
            type={toast.type}
            duration={5000}
            onClose={hideToast}
            position="top-center"
            showIcon={true}
            showClose={true}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us Now</h1>
      
      <div className="bg-white rounded-lg border p-4 mb-6">
        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          {formFields.map((field) => (
            <FormField
              key={field.name}
              {...field}
              value={formData[field.name]}
              onChange={onInputChange}
              error={formState.errors[field.name]}
              disabled={formState.isSubmitting}
            />
          ))}

          <FormTextarea
            name="message"
            placeholder="Message *"
            rows={4}
            value={formData.message}
            onChange={onInputChange}
            error={formState.errors.message}
            disabled={formState.isSubmitting}
            required
          />
          
          <SubmitButton
            isSubmitting={formState.isSubmitting}
            variant="full"
            onClick={showValidationErrors}
          />

          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to receive email notifications from our team.
              We typically respond within 24-48 hours.
            </p>
          </div>
        </form>
      </div>

      {showContactInfo && <ContactInfoSection />}

      {toast && (
        <StatusMessage
          message={toast.message}
          type={toast.type}
          duration={6000}
          onClose={hideToast}
          position="top-right"
          showIcon={true}
          showClose={true}
        />
      )}
    </div>
  );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm;
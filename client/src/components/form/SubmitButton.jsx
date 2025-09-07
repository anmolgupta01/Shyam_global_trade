import React from 'react';
import { Loader, Send } from 'lucide-react';

export const SubmitButton = React.memo(({ isSubmitting, variant = 'full' }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full bg-[#254F7E] text-white font-medium rounded-lg hover:bg-[#1e3f66] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center ${
        variant === 'compact' ? 'px-6 py-3' : 'px-6 py-3'
      }`}
    >
      {isSubmitting ? (
        <>
          <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
          Submitting...
        </>
      ) : variant === 'compact' ? (
        <>
          <Send className="w-4 h-4 mr-2" />
          Send Message
        </>
      ) : (
        'SUBMIT'
      )}
    </button>
  );
});

SubmitButton.displayName = 'SubmitButton';



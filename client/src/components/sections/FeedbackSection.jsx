import React from 'react';
import { useFeedback } from '../hooks/useFeedback';

const FeedbackSection = React.memo(() => {
  const {
    feedbackMessage,
    setFeedbackMessage,
    submitFeedback,
    isSubmitting,
    submitStatus,
    error
  } = useFeedback();

  return (
    <section className="py-4 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Leave Your Feedback</h3>
          <p className="text-gray-600">We value your thoughts and experiences.</p>
        </div>

        <div className="bg-gray-50 p-1 rounded-lg">
          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
              <div className="flex-shrink-0 text-green-600 text-lg">✓</div>
              <div className="text-green-800">
                <strong>Thank you!</strong> Your feedback has been saved to our database successfully.
              </div>
            </div>
          )}

          {(submitStatus === 'error' || error) && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <div className="flex-shrink-0 text-red-600 text-lg">⚠</div>
              <div className="text-red-800">
                <strong>Error:</strong> {error || 'Sorry, there was an error saving your feedback. Please try again.'}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700 mb-3">
                Your Feedback <span className="text-red-500">*</span>
              </label>
              <textarea 
                id="feedback-message"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Share your experience with us..." 
                rows={4}
                maxLength={2000}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#254F7E] focus:border-transparent resize-vertical ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                }`}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-red-500">
                  {feedbackMessage.trim().length > 0 && feedbackMessage.trim().length < 5 && 
                    'Minimum 5 characters required'
                  }
                </div>
                <div className="text-sm text-gray-500">
                  {feedbackMessage.length}/2000 characters
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button 
                onClick={submitFeedback}
                className={`bg-[#254F7E] text-white px-8 py-3 rounded hover:bg-[#1e3f66] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 mx-auto ${
                  (!feedbackMessage.trim() || feedbackMessage.trim().length < 5 || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!feedbackMessage.trim() || feedbackMessage.trim().length < 5 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

FeedbackSection.displayName = 'FeedbackSection';

export default FeedbackSection;
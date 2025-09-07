import React, { useState } from 'react';
import { Trash2, Calendar } from 'lucide-react';

const FeedbackCard = React.memo(({ feedback, onDelete, loading }) => {
  const [showFullMessage, setShowFullMessage] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateMessage = (message, maxLength = 150) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const handleDelete = () => onDelete(feedback._id);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDate(feedback.submittedAt)}
        </div>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg 
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete feedback"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Message */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {showFullMessage ? feedback.message : truncateMessage(feedback.message)}
        </p>
        {feedback.message.length > 150 && (
          <button
            onClick={() => setShowFullMessage(!showFullMessage)}
            className="mt-2 text-sm text-[#254F7E] hover:text-[#1e3f66] font-medium"
          >
            {showFullMessage ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500 font-mono">
          ID: {feedback._id.slice(-8)}
        </span>
        <div className="flex items-center space-x-2">
          {feedback.userAgent && (
            <span className="text-xs text-gray-500">
              {feedback.userAgent.includes('Mobile') ? '📱' : '💻'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

FeedbackCard.displayName = 'FeedbackCard';

export default FeedbackCard;

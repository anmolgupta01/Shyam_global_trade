import React from 'react';
import FeedbackCard from './FeedbackCard';
import Pagination from '../../ui/Pagination';
import { EmptyState } from '../../ui/EmptyState';
import { MessageSquare } from 'lucide-react';

const FeedbackList = React.memo(({
  feedback,
  loading,
  pagination,
  currentPage,
  onDelete,
  onPageChange
}) => {
  if (feedback.length === 0 && !loading) {
    return (
      <EmptyState
        icon={<MessageSquare className="w-12 h-12 text-gray-400" />}
        title="No feedback found"
        description="When customers submit feedback, it will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Feedback Cards */}
      <div className="space-y-4">
        {feedback.map((item) => (
          <FeedbackCard
            key={item._id}
            feedback={item}
            onDelete={onDelete}
            loading={loading}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-sm text-gray-600">
            Showing page {pagination.page} of {pagination.pages} 
            ({pagination.total} total items)
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
          />
        </div>
      )}
    </div>
  );
});

FeedbackList.displayName = 'FeedbackList';

export default FeedbackList;

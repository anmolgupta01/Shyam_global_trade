import React from 'react';

// Export as named export
export const ErrorDisplay = React.memo(({ error, onRetry }) => (
  <div className="text-center py-12">
    <p className="text-red-600 mb-6">{error}</p>
    {onRetry && (
      <button 
        onClick={onRetry} 
        className="px-6 py-3 bg-[#254F7E] text-white rounded hover:bg-[#1e3f66] transition-colors"
      >
        Retry
      </button>
    )}
  </div>
));

ErrorDisplay.displayName = 'ErrorDisplay';

// Also provide default export for compatibility
export default ErrorDisplay;

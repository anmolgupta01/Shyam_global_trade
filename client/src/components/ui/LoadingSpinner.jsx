// src/components/ui/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = React.memo(({ message = "Loading..." }) => (
  <div className="text-center py-12">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#254F7E] mb-4"></div>
    <p className="text-gray-600">{message}</p>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;  // ✅ Default export

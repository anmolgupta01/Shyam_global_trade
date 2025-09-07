import React from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const LoadingState = ({ message, icon }) => (
  <div className="flex flex-col items-center justify-center py-12">
    {icon && (
      <div className="text-4xl mb-4" role="img" aria-hidden="true">
        {icon}
      </div>
    )}
    <LoadingSpinner message={message} />
  </div>
);

export default LoadingState;

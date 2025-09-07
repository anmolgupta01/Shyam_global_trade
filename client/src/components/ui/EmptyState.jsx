import React from 'react';

// Export as named export
export const EmptyState = React.memo(({ icon, title, description, action }) => (
  <div className="text-center py-16 px-8">
    <div className="text-4xl mb-6">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
    {action}
  </div>
));

EmptyState.displayName = 'EmptyState';

// Also provide default export for compatibility
export default EmptyState;

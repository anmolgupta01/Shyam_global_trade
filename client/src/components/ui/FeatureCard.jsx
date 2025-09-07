import React from 'react';

export const FeatureCard = React.memo(({ feature }) => {
  const Icon = feature.icon;
  
  return (
    <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
      <div className="w-16 h-16 bg-[#254F7E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-8 h-8 text-[#254F7E]" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-4 text-sm">{feature.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

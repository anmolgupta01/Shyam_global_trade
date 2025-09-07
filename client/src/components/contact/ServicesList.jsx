import React from 'react';

const SERVICES = [
  'Product Consultation',
  'Custom Solutions',
  'Expert Support',
  '24/7 Customer Service'
];

const ServicesList = React.memo(() => {
  return (
    <div className="space-y-2 mb-6">
      {SERVICES.map((service) => (
        <div key={service} className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-[#254F7E] rounded-full flex-shrink-0"></div>
          <span className="text-sm text-gray-600">{service}</span>
        </div>
      ))}
    </div>
  );
});

ServicesList.displayName = 'ServicesList';

export default ServicesList;
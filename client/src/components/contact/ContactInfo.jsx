import React from 'react';
import { Star } from 'lucide-react';
import ServicesList from './ServicesList';
import ResponseGuarantee from './ResponseGuarantee';


const ContactInfo = React.memo(() => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Star className="w-6 h-6 text-[#254F7E]" />
          <h2 className="text-xl font-semibold text-gray-900">
            Get Personalized Assistance
          </h2>
        </div>
        
        <div className="text-gray-600 mb-6 leading-relaxed space-y-3">
          <p>Have a question or need a custom solution?</p>
          <p>We're here to help you find the right products and services.</p>
          <p>Fill out the form and we'll get back to you with the right solution.</p>
        </div>
      </div>

      {/* Services List */}
      <ServicesList />
      {/* Response Guarantee */}
      <ResponseGuarantee />
    </div>
  );
});

ContactInfo.displayName = 'ContactInfo';

export default ContactInfo;

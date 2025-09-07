import React from 'react';
import { Clock } from 'lucide-react';

const ResponseGuarantee = React.memo(() => {
  return (
    <div className="bg-[#254F7E]/5 border border-[#254F7E]/20 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Clock className="h-5 w-5 text-[#254F7E] flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-[#254F7E] mb-1">
            Quick Response Guarantee
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            We respond to all inquiries within 24-48 hours during business days with email confirmations.
          </p>
        </div>
      </div>
    </div>
  );
});

ResponseGuarantee.displayName = 'ResponseGuarantee';

export default ResponseGuarantee;
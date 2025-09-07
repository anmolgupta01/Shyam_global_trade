import React from 'react';
import { Star } from 'lucide-react';
import ContactForm from '../ContactForm';

const ContactSection = React.memo(() => {
  return (
    <section className="py-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Get In Touch</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-justify">
            Ready to explore our premium products? Contact us for personalized assistance and custom solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Side - Contact Form */}
          <ContactForm variant="compact" />
          
          {/* Right Side - Contact Info & Benefits */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Star className="w-6 h-6 text-[#254F7E]" />
                <h3 className="text-2xl font-semibold text-gray-900">Get Personalized Assistance</h3>
              </div>
              
              <p className="text-gray-600 leading-relaxed text-justify">
              Have a question or need a custom solution? Our team is here to guide you quickly and efficiently.
              Fill out the form and we’ll get back to you shortly with the right answers.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
  <div className="flex items-start space-x-4">
    <span className="text-[#254F7E] text-lg font-bold mt-0.5 flex-shrink-0">✓</span>
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">Fast Response</h4>
    </div>
  </div>
  
  <div className="flex items-start space-x-4">
    <span className="text-[#254F7E] text-lg font-bold mt-0.5 flex-shrink-0">✓</span>
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">Expert Support</h4>
    </div>
  </div>
  
  <div className="flex items-start space-x-4">
    <span className="text-[#254F7E] text-lg font-bold mt-0.5 flex-shrink-0">✓</span>
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">Custom Packaging</h4>
    </div>
  </div>
  
  <div className="flex items-start space-x-4">
    <span className="text-[#254F7E] text-lg font-bold mt-0.5 flex-shrink-0">✓</span>
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">Hassle-Free Process</h4>
    </div>
  </div>
</div>

            {/* Call to Action */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                Need immediate assistance?
              </p>
              <a href="tel:+919794226856" className="text-[#254F7E] hover:text-[#1e3f66] font-medium underline text-lg">
              +91 831 807 6180
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;

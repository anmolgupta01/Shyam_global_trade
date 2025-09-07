import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactHero = React.memo(() => {
  const contactMethods = [
    { icon: Phone, title: 'Call Us', content: '+91 9794226856', action: 'tel:+919794226856' },
    { icon: Mail, title: 'Email Us', content: 'info@shyaminternational.com', action: 'mailto:info@shyaminternational.com' },
    { icon: MapPin, title: 'Visit Us', content: 'Dostpur, Sultanpur (U.P.), India', action: 'https://maps.google.com/?q=Dostpur,+Sultanpur,+Uttar+Pradesh,+India' }
  ];

  return (
    <section className="bg-[#6683A4] text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Let's Start a Conversation
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Ready to explore our premium products? We're here to provide personalized assistance and answer all your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            
            return (
              <div
                key={index}
                className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
              >
                <Icon className="w-7 h-7 mx-auto mb-3 text-blue-200" />
                <a
                  href={method.action}
                  target={method.icon === MapPin ? '_blank' : '_self'}
                  rel={method.icon === MapPin ? 'noopener noreferrer' : undefined}
                  className="text-lg font-semibold mb-1 hover:text-blue-100 transition-colors cursor-pointer block"
                >
                  {method.title}
                </a>
                <p className="text-blue-100">{method.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

ContactHero.displayName = 'ContactHero';

export default ContactHero;

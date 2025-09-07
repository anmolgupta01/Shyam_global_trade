import React from 'react';
import FounderCard from './FounderCard';
// Import images from assets
import img1 from '../../Assets/Img1.png';
import img2 from '../../Assets/img2.jpeg';
import img3 from '../../Assets/img3.jpeg';

const FOUNDERS_DATA = [
  { 
    name: "RajKishor Gupta", 
    image: img1,
    role: "Co-Founder & Chairman"
  },
  { 
    name: "Rajat Gupta", 
    image: img2,
    role: "Co-Founder, Managing Director & CEO"
  },
  { 
    name: "Anmol Gupta", 
    image: img3,
    role: "Executive Director"
  }
];

const FoundersSection = React.memo(() => {
  return (
    <section className="py-4 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          Company Founders
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {FOUNDERS_DATA.map((founder) => (
            <FounderCard
              key={founder.name}
              name={founder.name}
              image={founder.image}
              role={founder.role}
            />
          ))}
        </div>
        
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-gray-600 leading-relaxed text-lg font-bold">
            "At Shyam Global, we don't just export goods—we export the story of Indian families, traditions, and resilience. We look forward to building long-term partnerships based on quality, trust, and shared growth."
            -- By Rajat Gupta (Co-Founder, Managing Director & CEO)
          </p>
        </div>
      </div>
    </section>
  );
});

FoundersSection.displayName = 'FoundersSection';

export default FoundersSection;

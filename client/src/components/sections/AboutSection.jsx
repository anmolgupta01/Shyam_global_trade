import React from 'react';
import { Link } from "react-router-dom";
import { ArrowRight } from 'lucide-react';
import aboutImg from '../../Assets/about-1.png'; // ✅ import your local image

const AboutSection = React.memo(() => {
  // Function to handle know more click and scroll to top
  const handleKnowMoreClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-3 sm:py-4 md:py-5 bg-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              About Us
            </h2>
            <div className="w-12 sm:w-14 md:w-16 h-1 bg-[#254F7E]"></div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
              Shyam International is a proudly Indian export company rooted in over 60 years of family legacy, trust, and entrepreneurship. Headquartered in Dostpur, Sultanpur (U.P.), we specialize in exporting unbreakable plastic household products and traditional Indian goods like cowdung product and attar.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
              From a small retail store founded in the 1960s by Sagar Seth to today's global ambitions, we've grown through dedication and quality. Our mission is to bring Indian tradition, durability, and value to homes worldwide. At Shyam International, we export more than products—we export heritage.
            </p>
            {/* ✅ Use Link with onClick handler */}
            <Link
              to="/aboutus"
              onClick={handleKnowMoreClick}
              className="bg-[#254F7E] text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded hover:bg-[#1e3f66] transition-colors duration-200 inline-flex items-center text-sm sm:text-base"
            >
              Know More About Us
              <ArrowRight className="ml-2 sm:ml-3 w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
          {/* Image */}
          <div className="order-first lg:order-last">
            <img
              src={aboutImg} // ✅ use imported image
              alt="About Shyam International"
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';
export default AboutSection;

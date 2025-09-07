import React from 'react';

const HeroSection = React.memo(() => {
  return (
    <section className="w-full px-2 py-2 flex items-center justify-center min-h-[40vh]">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 text-center">
          About Us
        </h1>
        <h2 className="text-lg font-semibold text-gray-800 mb-1 text-center">
          Exporting Trust, Tradition and Quality
        </h2>
        <div className="space-y-1 text-sm md:text-base">
          <p className="text-gray-600 leading-snug text-justify">At Shyam International, we export durable plastic household items and traditional Indian goods with a focus on quality and trust. Backed by 50+ years of business legacy, we ensure efficient logistics, custom packaging, strict quality checks, on-time delivery, and complete export documentation—offering a smooth and reliable export experience rooted in Indian values.
          </p>
          <p className="text-gray-600 leading-snug text-justify">
Shyam International is a proudly Indian export company rooted in a rich legacy of trust, entrepreneurship, and dedication spanning over six decades. Headquartered in Dostpur, Sultanpur (U.P.), India, we specialize in the export of high-quality unbreakable household plastic products, cowdung products, Attar and traditional Indian goods.
          </p>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;

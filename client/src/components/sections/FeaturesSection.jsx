import React, { useMemo } from 'react';
import { Clock, Package, Shield, DollarSign, FileText } from 'lucide-react';
import { FeatureCard } from '../ui/FeatureCard';

const FEATURES = [
  { icon: Clock, title: "EFFICIENT EXPORT LOGISTICS", description: "Streamlined processes for faster delivery" },
  { icon: Package, title: "CUSTOM PACKAGING", description: "Tailored packaging solutions for your needs" },
  { icon: Shield, title: "QUALITY ASSURANCE", description: "Rigorous quality checks at every step" },
  { icon: Clock, title: "TIMELY SHIPMENT", description: "On-time delivery guaranteed" },
  { icon: DollarSign, title: "COMPETITIVE PRICING", description: "Best prices in the market" },
  { icon: FileText, title: "COMPLETE DOCUMENTATION", description: "Full compliance and paperwork handled" }
];

// Small FeatureCard component with visible borders
const SmallFeatureCard = React.memo(({ feature }) => {
  const IconComponent = feature.icon;
  
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-3 hover:shadow-md transition-all duration-300 hover:border-[#254F7E] h-full">
      <div className="flex flex-col items-center text-center h-full">
        <div className="mb-2 p-2 bg-[#254F7E]/10 rounded-lg">
          <IconComponent className="w-6 h-6 text-[#254F7E]" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-tight">
          {feature.title}
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed flex-grow">
          {feature.description}
        </p>
      </div>
    </div>
  );
});

SmallFeatureCard.displayName = 'SmallFeatureCard';

const FeaturesSection = React.memo(() => {
  const featuresGrid = useMemo(() => 
    FEATURES.map((feature) => (
      <SmallFeatureCard key={feature.title} feature={feature} />
    )), 
    []
  );

  return (
    <section className="bg-gray-50 py-4" id="about">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            WHY US?
          </h2>
          <div className="w-20 h-1 bg-[#254F7E] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {featuresGrid}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';

export default FeaturesSection;
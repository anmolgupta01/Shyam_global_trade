import React from 'react';

const MissionVision = React.memo(() => {
  const sections = [
    {
      title: 'Our Mission',
      content: 'To deliver Indian quality, tradition, and durability to homes around the world through reliable export solutions.'
    },
    {
      title: 'Our Vision', 
      content: 'To become a globally trusted export house that reflects Indias manufacturing strength, cultural richness, and family business values.'
    }
  ];

  return (
    <section className="py-7 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {sections.map((section) => (
            <div key={section.title} className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {section.title}
              </h2>
              <p className="text-justify leading-relaxed text-lg">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

MissionVision.displayName = 'MissionVision';
export default MissionVision;

import React from 'react';

const FounderCard = React.memo(({ name, image, role }) => {
  return (
    <div className="text-center">
      <div className="w-40 h-40 mx-auto mb-3 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-1">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  );
});

FounderCard.displayName = 'FounderCard';

export default FounderCard;
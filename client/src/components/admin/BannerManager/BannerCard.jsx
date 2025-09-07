import React from 'react';

const BannerCard = React.memo(({ banner, onEdit, onDelete, loading }) => {
  const handleEdit = () => onEdit(banner);
  const handleDelete = () => onDelete(banner._id);

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden 
                   hover:shadow-md transition-all duration-200">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        {banner.image ? ( // CHANGED: Use banner.image instead of banner.imageUrl
          <img
            src={banner.image} // CHANGED: Use banner.image (contains Cloudinary URL)
            alt={`Banner ${banner._id}`}
            className="w-full h-48 object-cover"
            loading="lazy"
            onError={(e) => {
              console.error('Image failed to load:', banner.image);
              e.target.src = '/api/placeholder/400/300';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-48 bg-gray-100">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        
        {/* Overlay buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="px-3 py-2 bg-[#254F7E] text-white text-sm rounded hover:bg-[#1e3f66] 
                       transition-colors disabled:opacity-50"
            >
              Replace
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 
                       transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>ID: {banner._id.slice(-8)}</span>
          <span>
            {new Date(banner.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
});

BannerCard.displayName = 'BannerCard';

export default BannerCard;

import React from 'react';

const TabButton = React.memo(({ 
  id, 
  label, 
  icon, 
  isActive, 
  onClick, 
  onKeyDown 
}) => {
  const handleClick = () => onClick(id);
  const handleKeyDown = (event) => onKeyDown(event, id);

  return (
    <button
      id={`tab-${id}`}
      className={`
        group relative min-w-0 flex-1 overflow-hidden py-4 px-6 text-sm font-medium text-center 
        hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-[#254F7E] focus:ring-inset
        transition-all duration-200 ease-in-out rounded-lg
        ${isActive 
          ? 'bg-[#254F7E] text-white shadow-sm' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      tabIndex={isActive ? 0 : -1}
    >
      <div className="flex items-center justify-center space-x-2">
        <span className="text-base" role="img" aria-hidden="true">
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      
      {/* Active indicator */}
      {isActive && (
        <span 
          className="absolute inset-x-0 bottom-0 h-0.5 bg-white" 
          aria-hidden="true" 
        />
      )}
    </button>
  );
});

TabButton.displayName = 'TabButton';

export default TabButton;

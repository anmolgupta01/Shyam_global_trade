import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';

export const SearchBar = ({ 
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  debounceTime = 300,
  showClearButton = true,
  showSearchIcon = true,
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  suggestions = [],
  showSuggestions = false,
  onSuggestionClick,
  ariaLabel = 'Search input'
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const suggestionRefs = useRef([]);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (inputValue !== value && onChange) {
        onChange(inputValue);
      }
    }, debounceTime);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, onChange, value, debounceTime]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Show suggestions if available and input has value
    if (showSuggestions && suggestions.length > 0 && newValue.trim()) {
      setShowSuggestionsList(true);
      setActiveSuggestionIndex(-1);
    } else {
      setShowSuggestionsList(false);
    }
  };

  // Handle clear
  const handleClear = () => {
    setInputValue('');
    setShowSuggestionsList(false);
    setActiveSuggestionIndex(-1);
    
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange('');
    }
    
    // Focus back to input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion, index) => {
    setInputValue(suggestion);
    setShowSuggestionsList(false);
    setActiveSuggestionIndex(-1);
    
    if (onSuggestionClick) {
      onSuggestionClick(suggestion, index);
    } else if (onChange) {
      onChange(suggestion);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestionsList || suggestions.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[activeSuggestionIndex], activeSuggestionIndex);
        }
        break;
        
      case 'Escape':
        setShowSuggestionsList(false);
        setActiveSuggestionIndex(-1);
        break;
        
      default:
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestionsList(false);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Size configurations
  const sizeConfig = {
    sm: {
      input: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      height: 'h-8'
    },
    md: {
      input: 'px-4 py-2 text-sm',
      icon: 'w-4 h-4',
      height: 'h-10'
    },
    lg: {
      input: 'px-5 py-3 text-base',
      icon: 'w-5 h-5',
      height: 'h-12'
    }
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Filter suggestions based on input
  const filteredSuggestions = showSuggestions 
    ? suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 10) // Limit to 10 suggestions
    : [];

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      {/* Search Input Container */}
      <div className="relative">
        {/* Search Icon */}
        {showSearchIcon && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none`}>
            {loading ? (
              <div className="animate-spin">
                <Search className={config.icon} />
              </div>
            ) : (
              <Search className={config.icon} />
            )}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-expanded={showSuggestionsList}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="searchbox"
          className={`
            w-full rounded-lg border border-gray-300 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${config.input}
            ${config.height}
            ${showSearchIcon ? 'pl-10' : ''}
            ${(showClearButton && inputValue) ? 'pr-10' : ''}
            ${disabled ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-900'}
          `}
        />

        {/* Clear Button */}
        {showClearButton && inputValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label="Clear search"
          >
            <X className={config.icon} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestionsList && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <ul role="listbox" aria-label="Search suggestions">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                ref={el => suggestionRefs.current[index] = el}
                role="option"
                aria-selected={index === activeSuggestionIndex}
                className={`
                  px-4 py-2 cursor-pointer transition-colors duration-150
                  ${index === activeSuggestionIndex 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                  ${index === filteredSuggestions.length - 1 ? '' : 'border-b border-gray-100'}
                `}
                onClick={() => handleSuggestionClick(suggestion, index)}
                onMouseEnter={() => setActiveSuggestionIndex(index)}
              >
                <div className="flex items-center">
                  <Search className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="truncate">{suggestion}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};



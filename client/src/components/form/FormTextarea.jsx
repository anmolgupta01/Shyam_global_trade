import React from 'react';

export const FormTextarea = React.memo(({
  name,
  placeholder,
  rows,
  value,
  onChange,
  error,
  disabled,
  required
}) => {
  return (
    <div>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254F7E]/20 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors ${
          error 
            ? 'border-red-300 focus:border-red-500' 
            : 'border-gray-300 focus:border-[#254F7E]'
        }`}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';



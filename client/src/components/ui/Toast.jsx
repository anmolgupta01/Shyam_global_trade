// src/components/ui/Toast.jsx
import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle
  };
  
  const Icon = icons[type];
  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 border rounded-lg ${bgColor} ${textColor}`}>
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-2" />
        <span>{message}</span>
        <button onClick={onClose} className="ml-4">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;

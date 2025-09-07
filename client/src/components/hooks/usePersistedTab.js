import { useState, useEffect } from 'react';

export const usePersistedTab = (defaultTab = 'products', storageKey = 'adminActiveTab') => {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved || defaultTab;
    } catch {
      return defaultTab;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, activeTab);
    } catch {
      // Ignore localStorage errors
    }
  }, [activeTab, storageKey]);

  return [activeTab, setActiveTab];
};

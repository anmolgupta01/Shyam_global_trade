import React, { useState, useCallback, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import  LoadingSpinner  from '../ui/LoadingSpinner';
import TabButton from '../ui/TabButton';
import { usePersistedTab } from '../../components/hooks/usePersistedTab';

// Lazy load admin components for better performance
const ProductManager = lazy(() => import('../admin/ProductManager/ProductManager'));
const BannerManager = lazy(() => import('../admin/BannerManager/BannerManager'));
const FeedbackManager = lazy(() => import('../admin/FeedbackManager/FeedbackManager'));
const ContactManager = lazy(() => import('../admin/ContactManager/ContactManager'));

// Tab configuration
const TABS = [
  { id: 'products', label: 'Product Management', icon: '📦' },
  { id: 'banners', label: 'Banner Management', icon: '🖼️' },
  { id: 'feedback', label: 'Feedback Management', icon: '💬' },
  { id: 'contact', label: 'Contact Management', icon: '📧' }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = usePersistedTab('products');
  const { user } = useAuth();

  // Memoized tab change handler
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Keyboard navigation support
  const handleKeyDown = useCallback((event, tabId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveTab(tabId);
    }
  }, []);

  // Render active tab content
  const renderTabContent = () => {
    const commonProps = {
      fallback: <LoadingSpinner message={`Loading ${TABS.find(tab => tab.id === activeTab)?.label}...`} />
    };

    switch (activeTab) {
      case 'products':
        return (
          <Suspense {...commonProps}>
            <ProductManager />
          </Suspense>
        );
      case 'banners':
        return (
          <Suspense {...commonProps}>
            <BannerManager />
          </Suspense>
        );
      case 'feedback':
        return (
          <Suspense {...commonProps}>
            <FeedbackManager />
          </Suspense>
        );
      case 'contact':
        return (
          <Suspense {...commonProps}>
            <ContactManager />
          </Suspense>
        );
      default:
        return <div className="text-center py-8">Select a tab to get started</div>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Shyam International</title>
        <meta name="description" content="Manage products, banners, feedback, and contacts for Shyam International." />
      </Helmet>

      <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.username}!</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Admin Access
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-1 p-1" aria-label="Dashboard tabs" role="tablist">
              {TABS.map((tab) => (
                <TabButton
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  icon={tab.icon}
                  isActive={activeTab === tab.id}
                  onClick={handleTabChange}
                  onKeyDown={handleKeyDown}
                />
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useContacts } from '../../hooks/useContacts';
import { useDebounce } from '../../hooks/useDebounce';
import ContactFilters from './ContactFilters';
import ContactTable from './ContactTable';
import ContactModal from './ContactModal';
import  LoadingSpinner  from '../../ui/LoadingSpinner';
import  Toast  from '../../ui/Toast';

const ContactManager = React.memo(() => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Custom hook for contact management
  const {
    contacts,
    loading,
    error,
    stats,
    totalPages,
    deleteContact,
    updateContactStatus,
    getContactDetails,
    refetch
  } = useContacts({
    page: currentPage,
    status: statusFilter,
    search: debouncedSearchTerm
  });

  // Toast management
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Memoized filter options
  const filterOptions = useMemo(() => [
    { value: 'all', label: 'All', count: stats.totalSubmissions || 0 },
    { value: 'new', label: 'New', count: stats.newSubmissions || 0 },
    { value: 'read', label: 'Read', count: stats.readSubmissions || 0 },
    { value: 'responded', label: 'Responded', count: stats.respondedSubmissions || 0 },
    { value: 'closed', label: 'Closed', count: stats.closedSubmissions || 0 }
  ], [stats]);

  // Event handlers
  const handleFilterChange = useCallback((newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleViewContact = useCallback(async (id) => {
    try {
      const contactDetails = await getContactDetails(id);
      setSelectedContact(contactDetails);
      setShowModal(true);
      
      // Auto-mark as read if it's new
      if (contactDetails.status === 'new') {
        await updateContactStatus(id, 'read');
      }
    } catch (error) {
      showToast(error.message || 'Error loading contact details', 'error');
    }
  }, [getContactDetails, updateContactStatus, showToast]);

  const handleStatusUpdate = useCallback(async (id, newStatus) => {
    try {
      await updateContactStatus(id, newStatus);
      showToast('Status updated successfully!');
    } catch (error) {
      showToast(error.message || 'Error updating status', 'error');
    }
  }, [updateContactStatus, showToast]);

  const handleDeleteContact = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteContact(id);
      showToast('Contact deleted successfully!');
      
      // Close modal if the deleted contact was being viewed
      if (selectedContact?._id === id) {
        setShowModal(false);
        setSelectedContact(null);
      }
    } catch (error) {
      showToast(error.message || 'Error deleting contact', 'error');
    }
  }, [deleteContact, selectedContact, showToast]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedContact(null);
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact Management | Admin Dashboard</title>
        <meta name="description" content="Manage customer inquiries and contact submissions" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Management</h1>
          <p className="text-gray-600">Manage and respond to customer inquiries</p>
        </div>

       

        {/* Filters and Search */}
        <ContactFilters
          statusFilter={statusFilter}
          searchTerm={searchTerm}
          onFilterChange={handleFilterChange}
          onSearchChange={setSearchTerm}
          filterOptions={filterOptions}
        />

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button
              onClick={refetch}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Contacts Table */}
        {loading ? (
          <LoadingSpinner message="Loading contacts..." />
        ) : (
          <ContactTable
            contacts={contacts}
            currentPage={currentPage}
            totalPages={totalPages}
            onViewContact={handleViewContact}
            onStatusUpdate={handleStatusUpdate}
            onDeleteContact={handleDeleteContact}
            onPageChange={handlePageChange}
          />
        )}

        {/* Contact Details Modal */}
        {showModal && selectedContact && (
          <ContactModal
            contact={selectedContact}
            isOpen={showModal}
            onClose={handleCloseModal}
            onDelete={() => handleDeleteContact(selectedContact._id)}
            onStatusUpdate={(status) => handleStatusUpdate(selectedContact._id, status)}
          />
        )}

        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
});

ContactManager.displayName = 'ContactManager';

export default ContactManager;

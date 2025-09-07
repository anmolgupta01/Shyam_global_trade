import React, { useEffect } from 'react';
import { X, Mail, Phone, Building, Calendar, User, MessageSquare } from 'lucide-react';

const ContactViewModal = ({ isOpen, onClose, contact }) => {
  useEffect(() => {
    // Close modal on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !contact) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
            Contact Submission Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <p className="text-gray-800 font-medium">
                  {contact.name || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  <a 
                    href={`mailto:${contact.email}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                {contact.phone ? (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-green-600" />
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-green-600 hover:text-green-800 hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Company
                </label>
                <div className="flex items-center">
                  {contact.company ? (
                    <>
                      <Building className="w-4 h-4 mr-2 text-purple-600" />
                      <p className="text-gray-800">{contact.company}</p>
                    </>
                  ) : (
                    <p className="text-gray-500">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Message
            </h3>
            <div className="bg-white p-4 rounded border">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {contact.message || 'No message provided'}
              </p>
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Submission Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Submitted On
                </label>
                <p className="text-gray-800">
                  {formatDate(contact.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  contact.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                  contact.status === 'responded' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {contact.status?.charAt(0).toUpperCase() + contact.status?.slice(1) || 'New'}
                </span>
              </div>
            </div>
          </div>

          {/* Email Status */}
          {contact.emailSent !== undefined && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Email Status
              </h3>
              <p className={`flex items-center ${contact.emailSent ? 'text-green-700' : 'text-red-700'}`}>
                {contact.emailSent ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Email notification sent successfully
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Email notification failed
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactViewModal;

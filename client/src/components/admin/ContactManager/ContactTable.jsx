import React from 'react';
import ContactTableRow from './ContactTableRow';
import Pagination from '../../ui/Pagination';
import { EmptyState } from '../../ui/EmptyState';
import { Mail } from 'lucide-react';

const ContactTable = React.memo(({
  contacts,
  currentPage,
  totalPages,
  onViewContact,
  onStatusUpdate,
  onDeleteContact,
  onPageChange
}) => {
  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={<Mail className="w-12 h-12 text-gray-400" />}
        title="No contacts found"
        description="No contact submissions match your current filters."
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
               Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact) => (
              <ContactTableRow
                key={contact._id}
                contact={contact}
                onView={() => onViewContact(contact._id)}
                onStatusUpdate={(status) => onStatusUpdate(contact._id, status)}
                onDelete={() => onDeleteContact(contact._id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
});

ContactTable.displayName = 'ContactTable';

export default ContactTable;

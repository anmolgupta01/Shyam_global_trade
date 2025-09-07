import React from 'react';
import { Edit, Trash2, Eye, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

const ContactTableRow = ({ contact, onEdit, onDelete, onView, onStatusUpdate }) => {
  const { 
    _id, 
    name, 
    email, 
    phone, 
    company, 
    message, 
    status = 'new',
    createdAt,
    emailSent = false
  } = contact;

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-3 h-3" />, text: 'New' },
      read: { color: 'bg-yellow-100 text-yellow-800', icon: <Eye className="w-3 h-3" />, text: 'Read' },
      responded: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" />, text: 'Responded' },
      closed: { color: 'bg-gray-100 text-gray-800', icon: <XCircle className="w-3 h-3" />, text: 'Closed' }
    };

    const config = statusConfig[status] || statusConfig.new;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-1">{config.text}</span>
      </span>
    );
  };

  // Truncate message for display
  const truncateMessage = (text, maxLength = 50) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(_id, newStatus);
    }
  };

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      {/* Name */}

      {/* Email */}
      <td className="py-3 px-4">
        <a 
          href={`mailto:${email}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {email}
        </a>
      </td>

      {/* Phone */}
      <td className="py-3 px-4 text-gray-600">
        {phone ? (
          <a 
            href={`tel:${phone}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {phone}
          </a>
        ) : (
          '-'
        )}
      </td>

      {/* Company */}
      <td className="py-3 px-4 text-gray-600">
        {company || '-'}
      </td>

      {/* Message Preview */}
      <td className="py-3 px-4">
        <div 
          className="text-gray-600 cursor-pointer hover:text-gray-800"
          title={message}
          onClick={() => onView && onView(contact)}
        >
          {truncateMessage(message)}
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          {getStatusBadge(status)}
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </td>

      {/* Date */}
      <td className="py-3 px-4 text-gray-500 text-sm">
        {createdAt ? new Date(createdAt).toLocaleDateString() : '-'}
        <br />
        <span className="text-xs text-gray-400">
          {createdAt ? new Date(createdAt).toLocaleTimeString() : ''}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          {/* View Details */}
          <button
            onClick={() => onView && onView(contact)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>


          {/* Delete */}
          <button
            onClick={() => onDelete && onDelete(_id)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
            title="Delete Contact"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ContactTableRow;

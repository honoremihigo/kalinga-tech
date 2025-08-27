import React, { useState, useEffect } from 'react';
import { X, Eye,Trash2 } from 'lucide-react'; // Eye icon for view, X for delete
import { ContactService } from '../../../Services/Landing/ContactService'; // adjust path as needed
import Swal from 'sweetalert2';

const ContactMessageManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ContactService.getAllMessages();
      setMessages(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch contact messages');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (message) => {
    setCurrentMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setCurrentMessage(null);
    setShowModal(false);
  };

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  });

  if (!result.isConfirmed) return;

  setLoading(true);
  setError('');
  try {
    await ContactService.deleteMessage(id);
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    Swal.fire('Deleted!', 'Your message has been deleted.', 'success');
  } catch (err) {
    setError(err.message || 'Failed to delete message');
    Swal.fire('Error!', err.message || 'Failed to delete message', 'error');
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading messages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Message Management</h3>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Full Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Email</th>
               <th className="px-4 py-3 text-xs font-semibold text-gray-700">Phone</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Subject</th>

              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No messages found.
                </td>
              </tr>
            )}
            {messages.map((msg) => (
              <tr key={msg.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-xs text-gray-900">{msg.fullName}</td>
                <td className="px-4 py-2 text-xs text-gray-900">{msg.email}</td>
                  <td className="px-4 py-2 text-xs text-gray-900">{msg.phone}</td>
                <td className="px-4 py-2 text-xs text-gray-900">{msg.subject}</td>
                <td className="px-4 py-2 text-xs text-gray-900">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-xs flex space-x-4">
                  <button
                    onClick={() => openModal(msg)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    title="View message"
                  >
                    <Eye className="w-4 h-4 mr-1" /> 
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-red-600 hover:text-red-800 flex items-center"
                    title="Delete message"
                  >
                  <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing full message */}
      {showModal && currentMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            <h4 className="text-lg font-semibold mb-4">Contact Message Details</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Full Name:</strong> {currentMessage.fullName}</p>
              <p><strong>Email:</strong> {currentMessage.email}</p>
              <p><strong>Phone:</strong> {currentMessage.phone}</p>
              <p><strong>Subject:</strong> {currentMessage.subject}</p>
              <p><strong>Message:</strong></p>
              <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded">{currentMessage.message}</p>
              <p><strong>Received:</strong> {new Date(currentMessage.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessageManagement;

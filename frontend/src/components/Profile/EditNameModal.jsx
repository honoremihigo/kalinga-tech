/* eslint-disable react/prop-types */
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/ClientAuthContext";

const EditNameModal = ({ isOpen, onClose, currentUser, onUpdate, API_URL }) => {
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const { user,updateClient } = useAuth();


  const handleSubmit = async () => {
    const response = await updateClient({ lastName, firstName },)
    if (response) {
      // for now no verification just store it
      onUpdate({ ...user, ...response });
      toast.success("Name updated successfully");
      onClose(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={() => onClose(false)}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Edit Name
        </h2>
        <p className="mb-4">
          This is the name others will see when referring to you.
        </p>
        <div className="mb-4">
          <label className="block text-gray-600 text-md">First Name</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-gray-100 text-black border-2 border-transparent outline-none focus:border-black focus:ring-black"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value.trimStart())}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Last Name</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-gray-100 text-black border-2 border-transparent outline-none focus:border-black focus:ring-black"
            value={lastName}
            onChange={(e) => setLastName(e.target.value.trimStart())}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleSubmit();
            }}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Update
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default EditNameModal;

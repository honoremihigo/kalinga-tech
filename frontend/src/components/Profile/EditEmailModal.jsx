/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/ClientAuthContext";

const EditEmailModal = ({
  isOpen,
  onClose,
  currentUser,
  onUpdate,
  API_URL,
}) => {
  const { user,updateClient } = useAuth();

  const [email, setEmail] = useState(currentUser.email);


  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // check if an email submitted is not valid
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const response = await updateClient({email})
    if (response) {
      // for now no verification just store it
      onUpdate({ ...user, ...response });
      toast.success("Email updated successfully");

      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={() => onClose(false)}
      className="fixed w-full h-screen z-50 inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-white max-w-md sm:w-full p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center mb-2 justify-between px-2">
          <h2 className="text-2xl font-bold mb-2">Email</h2>
          <FaTimes className="cursor-pointer" onClick={() => onClose(false)} />
        </div>
        <p className="text-gray-600 mb-4">
          You’ll use this email to receive messages, sign in, and recover your
          account.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            placeholder="Enter your email"
            className="w-full p-3 border rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-xs text-gray-500 mt-1">
            A verification code will be sent to this email
          </p>
          <button
            type="submit"
            className="mt-4 w-full bg-black text-white py-3 rounded hover:bg-gray-800"
          >
            Update{" "}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmailModal;

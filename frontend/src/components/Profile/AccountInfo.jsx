import { useState } from "react";
import { FaCheckCircle, FaEdit, FaAngleRight } from "react-icons/fa";
import ProfileEditModal from "./ProfileEditModal";
import { ToastContainer } from "react-toastify";

import { Link } from "react-router-dom";
import EditNameModal from "./EditNameModal";
import EditPhoneNumber from "./EditPhoneNumber";
import EditEmailModal from "./EditEmailModal";
import { useAuth } from "../../context/ClientAuthContext";
import { ArrowLeftCircle } from "lucide-react";

function AccountInfo() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [userInfo, setUserInfo] = useState(user);
  console.log(userInfo);

  return (
    <div className="p-10 max-w-screen-md">
      <ToastContainer theme="dark" />

      <h2 className="text-2xl font-bold mb-6">Account Info</h2>
      <div className="flex items-center space-x-4">
        <div
          className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center relative cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          {userInfo?.profileImg ? (
            <img
              src={`${API_URL}/uploads/profile/${userInfo?.profileImg}`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            ""
          )}
          <FaEdit
            className="bg-white p-1 rounded-full text-xl absolute bottom-0 right-0"
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Basic Info</h3>
        <div className="mt-4 space-y-4">
          <div
            onClick={() => setEditName(true)}
            className="flex justify-between items-center cursor-pointer border-b pb-2"
          >
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-md flex items-center">
                {userInfo?.firstName} {userInfo?.lastName}{" "}
              </p>
              <p className="text-xs flex items-center text-gray-500">
                {!userInfo?.firstName && !userInfo?.lastName ? "add name" : null}
              </p>
            </div>
            <span className="text-gray-400">
              <FaAngleRight />
            </span>
          </div>

          <div
            onClick={() => setEditPhone(true)}
            className="flex justify-between items-center cursor-pointer border-b pb-2"
          >
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-md flex items-center">{userInfo.phone} </p>
              <p className="text-xs flex items-center text-gray-500">
                {!userInfo.phone ? "add phone" : null}
              </p>
            </div>
            <span className="text-gray-400">
              <FaAngleRight />
            </span>
          </div>

          <div
            onClick={() => setEditEmail(true)}
            className="flex justify-between items-center cursor-pointer border-b pb-2"
          >
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-md flex items-center">{userInfo.email}</p>
              <p className="text-gray-500 text-xs flex items-center">
                {!userInfo.email ? "add email" : null}
              </p>
            </div>
            <span className="text-gray-400">
              <FaAngleRight />
            </span>
          </div>
        </div>
      </div>
      <EditEmailModal
        isOpen={editEmail}
        API_URL={API_URL}
        onClose={setEditEmail}
        currentUser={userInfo}
        onUpdate={setUserInfo}
      />
      <EditPhoneNumber
        isOpen={editPhone}
        API_URL={API_URL}
        onClose={setEditPhone}
        currentUser={userInfo}
        onUpdate={setUserInfo}
      />
      <EditNameModal
        isOpen={editName}
        API_URL={API_URL}
        onClose={setEditName}
        currentUser={userInfo}
        onUpdate={setUserInfo}
      />
      <ProfileEditModal
        changeUser={setUserInfo}
        showModal={showModal}
        API_URL={API_URL}
        setShowModal={setShowModal}
        setProfileImage={setProfileImage}
      />
    </div>
  );
}

export default AccountInfo;

/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

import axios from "axios";
import { useAuth } from "../../context/ClientAuthContext";

function ProfileEditModal({
  showModal,
  changeUser,
  setShowModal,
  setProfileImage,
  API_URL,
}) {
  const { user, updateClient } = useAuth();
  const [userInfo, setUserInfo] = useState(user);

  // set an profile image to the image stored by user
  useEffect(() => {
    setProfileImage(userInfo.profileImg);
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // image size needed must be less that 5MBs

      if (file.size > maxSize) {
        toast.error("please image size must be under 5 MBS");
        return;
      }

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPG, JPEG, PNG).🙂");
        return;
      }

      try {
        const formdata = new FormData();
        formdata.append("profilePic", file);

        const response = await updateClient(formdata);
        toast.success("image uploaded successfully🎆🎇");

        if (response.data.updateUser) {
          toast.success("yes successfully🎆🎇");
          changeUser((pre) => ({ ...response.data.updateUser }));
        }

        setShowModal(null);

        console.log(`updated the user :`, response.data);
      } catch (error) {
        toast.error(
          error.message || "Please upload a valid image (JPG, JPEG, PNG).🙂",
        );
      }
    }
  };

  if (!showModal) return null;

  return createPortal(
    <div
      onClick={() => setShowModal(false)}
      className="fixed w-full h-screen inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center "
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-white p-6 rounded-lg sm:w-full sm:rounded-t-lg shadow-lg text-center max-w-md"
      >
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="text-xl font-semibold">Profile Photo</h3>
          <FaTimes
            className="cursor-pointer"
            onClick={() => setShowModal(false)}
          />
        </div>
        {userInfo.profileImg}
        <p className="mb-4">This is the photo you would like others to see.</p>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="upload"
          onChange={handleImageUpload}
        />
        <label
          htmlFor="upload"
          className="block w-full bg-black text-white p-3 rounded-lg cursor-pointer mb-2"
        >
          Update Photo
        </label>
        <button
          className="w-full p-3 border rounded-lg"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  );
}
export default ProfileEditModal;

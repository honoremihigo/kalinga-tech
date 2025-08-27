import React, { useRef, useState } from "react";
import Header from "../components/Header";
import StyledPhoneInput from "../components/auth/StyledPhoneInput";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const SignInUserFillInfo = () => {
  const [values, setValues] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const location = useLocation();
  const newuser = location.state;
  const phoneInputRef = useRef();
  const emailRef = useRef();

  const [errors, setErrors] = useState({
    firstName: {
      message: "",
      isNotValid: false,
    },
    lastName: {
      message: "",
      isNotValid: false,
    },
    email: {
      message: "",
      isNotValid: false,
    },
    phone: {
      message: "",
      isNotValid: false,
    },
  });

  const handleChangeVal = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    // Basic validation
    if (name === "firstName" || name === "lastName") {
      if (value.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          [name]: {
            message: `${name} is required`,
            isNotValid: true,
          },
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: {
            message: "",
            isNotValid: false,
          },
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/rideLogin", { replace: true });
      toast.error("You are not authenticated");
      return;
    }

    try {
      // Create FormData to handle file upload
      const formData = new FormData();

      // Append text fields
      Object.keys(values).forEach((key) => {
        if (values[key]) {
          formData.append(key, values[key]);
        }
      });

      // Append file if exists
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const response = await axios.put(
        `${API_URL}/users/update-profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(`response`, response.data);
      toast.success("Profile updated successfully");

      if (response.data.updateUser) {
        navigate("/booking", { replace: true });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="justify-center items-center w-full flex-col flex">
      <Header title={`Fill up your info`} />
      <div className="flex justify-center py-8 items-center w-full flex-col">
        <form
          onSubmit={handleSubmit}
          className="flex max-w-md justify-center gap-2 items-start p-4 w-full md:w-1/2 xl:w-1/3 border rounded-md flex-col"
          encType="multipart/form-data"
        >
          <h1 className="text-2xl uppercase font-semibold">User Info</h1>

          <label htmlFor="firstName" className="capitalize">
            First Name:
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={values.firstName}
            className={`p-2 border rounded-md focus:ring-2 text-gray-700 focus:ring-blue-500 w-full focus:border-blue-500 ${errors.firstName.isNotValid ? "border-red-500" : ""}`}
            onChange={handleChangeVal}
          />
          {errors.firstName.isNotValid && (
            <span className="text-red-500 text-sm">
              {errors.firstName.message}
            </span>
          )}

          <label htmlFor="lastName" className="capitalize">
            Last Name:
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={values.lastName}
            className={`p-2 border rounded-md focus:ring-2 text-gray-700 focus:ring-blue-500 w-full focus:border-blue-500 ${errors.lastName.isNotValid ? "border-red-500" : ""}`}
            onChange={handleChangeVal}
          />
          {errors.lastName.isNotValid && (
            <span className="text-red-500 text-sm">
              {errors.lastName.message}
            </span>
          )}

          <button
            type="submit"
            className="bg-primaryred p-2 w-full rounded-md border-2 text-white disabled:opacity-50 mt-4"
            disabled={errors.firstName.isNotValid || errors.lastName.isNotValid}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInUserFillInfo;

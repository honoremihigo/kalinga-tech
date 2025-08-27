import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import StyledPhoneInput from "../../../components/auth/StyledPhoneInput";
import AuthService from "../../../Services/ClientProcess/Auth";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const ClientLogin = () => {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isPhoneInput, setIsPhoneInput] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const otpRefs = useRef([]);
  const emailRef = useRef(null);
  const phoneInputRef = useRef(null);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\+?\d{10,15}$/.test(phone);
  const isProbablyEmail = (value) => value.includes("@");

  const showAlert = (message, type = "error") => {
    Swal.fire({
      icon: type,
      title: type === "error" ? "Error" : "Success",
      text: message,
    });
  };

  const maskIdentifier = (value, isPhone) => {
    if (!value) return "";
    if (isPhone) return `****${value.slice(-3)}`;
    const [user, domain] = value.split("@");
    return `${user.slice(0, 3)}***@***${domain.slice(-3)}`;
  };

  
  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setIdentifier(value);

    if (!value) {
      setError("This field is required.");
      setIsPhoneInput(false);
    } else if (/[a-zA-Z]/.test(value) || isProbablyEmail(value)) {
      setIsPhoneInput(false);
      setTimeout(() => emailRef.current?.focus(), 0);
      setError(isValidEmail(value) ? "" : "Enter a valid email address.");
    } else {
      setIsPhoneInput(true);
      setTimeout(() => phoneInputRef.current?.focus(), 0);
      setError(isValidPhone(value) ? "" : "Enter a valid phone number.");
    }
  };

  const handlePhoneChange = (value) => {
    const phoneValue = `+${value}`;
    setIdentifier(phoneValue);
    setTimeout(() => {
      setIsPhoneInput(!!value);
    }, 1000);
    setError(isValidPhone(phoneValue) ? "" : "Enter a valid phone number.");
  };

  
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error || !identifier) return;

    try {
      setLoading(true);
      await AuthService.sendOtp(identifier);
      setStep(2);
    } catch (err) {
      showAlert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6)
      return showAlert("Please enter the full 6-digit OTP.");

    try {
      setLoading(true);
      const response = await AuthService.verifyOtp(identifier, fullOtp);
      console.log("Auth Response:", response); // 🔍 Debugging

      const client = response.client || {};
      const profileComplete = client.firstName && client.lastName;

      if (response.isNewClient || !profileComplete) {
        setClient(client);
        setFormData({
          ...formData,
          email: client.email || "",
          phoneNumber: client.phoneNumber || "",
        });
        setStep(3);
      } else {
        showAlert("Login successful!", "success");
        navigate("/clientdashboard");
      }
    } catch (err) {
      showAlert(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await AuthService.completeProfile(formData);
      showAlert("Profile completed!", "success");
      navigate("/clientdashboard");
    } catch (err) {
      showAlert("Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFormInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/client/auth/google`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/client/auth/apple`;
  };


  return (
    <div className="flex min-h-[90vh] items-center justify-center overflow-hidden px-2 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full sm:w-[450px]">
        <h1 className="text-xl font-semibold mb-4 text-center">
          {step === 1
            ? "Enter phone number or email"
            : step === 2
            ? "Enter your 6-digit OTP"
            : "Complete Your Profile"}
        </h1>

        {step === 2 && (
          <p className="text-sm text-center text-gray-600 mb-6">
            We&apos;ve sent an OTP to your{" "}
            {isPhoneInput ? "phone number" : "email"}:{" "}
            <span className="font-semibold">
              {maskIdentifier(identifier, isPhoneInput)}
            </span>
          </p>
        )}

        {step === 1 && (
          <form onSubmit={handleSubmit}>
            {isPhoneInput ? (
              <StyledPhoneInput
                value={identifier}
                onChange={handlePhoneChange}
                error={error}
                inputRef={phoneInputRef}
              />
            ) : (
              <input
                type="text"
                value={identifier}
                onChange={handleIdentifierChange}
                ref={emailRef}
                placeholder="Enter phone or email"
                className={`w-full p-2 mb-2 border text-black rounded ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}
            {error && (
              <p className="text-red-500 text-sm mb-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !identifier}
              className="w-full bg-[#293751] text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="flex justify-between gap-2 mb-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, idx)
                  }
                  ref={(el) => (otpRefs.current[idx] = el)}
                  className="w-12 h-12 text-black text-center text-xl border border-gray-300 rounded"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#293751] text-white py-2 rounded hover:bg-gray-800"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleProfileSubmit}>
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleFormInput}
              className="w-full p-2 mb-2 border text-black rounded"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleFormInput}
              className="w-full p-2 mb-2 border text-black rounded"
            />
            {!client?.email && (
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleFormInput}
                className="w-full p-2 mb-2 border text-black rounded"
              />
            )}
            {!client?.phoneNumber && (
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleFormInput}
                className="w-full p-2 mb-2 border text-black rounded"
              />
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              {loading ? "Saving..." : "Complete Profile"}
            </button>
          </form>
        )}

                {step === 1 && (
                  <>
                    <div className="flex items-center my-4">
                      <hr className="flex-grow border-gray-300" />
                      <span className="mx-2 text-gray-500 text-sm">or</span>
                      <hr className="flex-grow border-gray-300" />
                    </div>
        
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center bg-gray-100 border border-gray-300 rounded py-2 mb-2 hover:bg-gray-200"
                    >
                      <FcGoogle className="mr-2" size={20} />
                      Continue with Google
                    </button>
        
                    <button
                      onClick={handleAppleLogin}
                      className="w-full flex items-center justify-center bg-gray-100 border border-gray-300 rounded py-2 hover:bg-gray-200"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                        alt="Apple"
                        className="w-5 h-5 mr-2"
                      />
                      Continue with Apple
                    </button>
                  </>
                )}

        <p className="text-[12px] text-gray-600 mt-4 text-center">
          By proceeding, you consent to get calls and SMS from Abyride LLC
          to the number provided.
        </p>
      </div>
    </div>
  );
};

export default ClientLogin;

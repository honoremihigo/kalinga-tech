import React, { useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import StyledPhoneInput from "../../../components/auth/StyledPhoneInput";
import AuthService from "../../../Services/DriverService/Auth";
import { Link, useNavigate } from "react-router-dom";

const DriverLogin = () => {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isPhoneInput, setIsPhoneInput] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef([]);
  const emailRef = useRef(null);
  const phoneInputRef = useRef(null);
  const navigate = useNavigate();

  const isProbablyEmail = (value) => value.includes("@");
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\+?\d{10,15}$/.test(phone);

  const showAlert = (message, type = "error") => {
    Swal.fire({
      icon: type,
      title: type === "error" ? "Error" : "Success",
      text: message,
      confirmButtonColor: "#3085d6",
    });
  };

  const maskIdentifier = (value, isPhone) => {
    if (!value) return "";
    if (isPhone) {
      return `****${value.slice(-3)}`;
    } else {
      const [user, domain] = value.split("@");
      const maskedUser = user.length > 3 ? user.slice(0, 3) + "***" : "***";
      const maskedDomain =
        domain.length > 3 ? "***" + domain.slice(-3) : "***";
      return `${maskedUser}@${maskedDomain}`;
    }
  };

  const handleChange = (e) => {
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
      setLoading(false);
      showAlert("OTP sent successfully!", "success");
      setStep(2);
    } catch (err) {
      setLoading(false);
      showAlert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      showAlert("Please enter the full 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      await AuthService.verifyOtp(identifier, fullOtp);
      setLoading(false);
      showAlert("Login successful!", "success");
      navigate("/driverdashboard");
    } catch (err) {
      setLoading(false);
      showAlert(err.response?.data?.message || "OTP verification failed.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/driver/auth/google`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/driver/auth/apple`;
  };

  return (
    <div className="flex  min-h-[90vh] items-center justify-center overflow-hidden px-2 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full sm:w-[450px]">
        <h1 className="text-xl font-semibold mb-4 text-center">
          {step === 1 ? "Enter phone number or email" : "Enter your 6-digit OTP"}
        </h1>

        {step === 2 && (
          <p className="text-sm text-center text-gray-600 mb-6">
            We&apos;ve sent an OTP to your {isPhoneInput ? "phone number" : "email"}:{" "}
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
                onChange={handleChange}
                ref={emailRef}
                placeholder="Enter phone or email"
                className={`w-full p-2 mb-2 border rounded text-black ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
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
          <>
            <form onSubmit={handleOtpSubmit}>
              <div className="flex justify-between gap-2 mb-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    ref={(el) => (otpRefs.current[idx] = el)}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded"
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={loading || otp.some((d) => d === "")}
                className="w-full bg-[#293751] text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            {/* Styled Back Button */}
            <button
              onClick={() => setStep(1)}
              className="mt-6 flex items-center justify-center text-blue-600 text-sm hover:underline transition"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Go back
            </button>
          </>
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

        <Link
          className="text-sm text-slate-700 underline mt-4 block text-center"
          to="/driver-apply"
        >
          Apply for job
        </Link>

        <p className="text-[12px] text-gray-600 mt-4 text-center">
          By proceeding, you consent to get calls and SMS, including by automated means,
          from Abyride LLC and its affiliates to the number provided.
        </p>
      </div>
    </div>
  );
};

export default DriverLogin;

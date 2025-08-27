import React, { useState, useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const VerifyRide = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const location = useLocation();
  const [newuser, setNewuser] = useState(null);
  const { verifyOtp, isLoading } = useAuth();
  const navigate = useNavigate();

  // Initialize refs for all inputs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, code.length);
  }, [code.length]);

  useEffect(() => {
    if (location.state) {
      setNewuser(location.state);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (newuser === null && location.state === null) {
      navigate("/rideLogin", { replace: true });
    }
  }, [newuser, location.state, navigate]);

  const handleChange = (value, index) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input if value is entered
    if (value && index < code.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event for any of the inputs
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Filter out non-numeric characters and take only what we need
    const digits = pastedData.replace(/\D/g, "").slice(0, code.length);

    if (digits.length > 0) {
      // Create new array with pasted digits
      const newCode = Array(code.length).fill("");

      // Fill the array with pasted digits
      [...digits].forEach((digit, index) => {
        if (index < code.length) {
          newCode[index] = digit;
        }
      });

      setCode(newCode);

      // Focus on appropriate input based on digits length
      const focusIndex = Math.min(digits.length, code.length - 1);
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex].focus();
      }
    }
  };

  const handleVerify = async () => {
    if (code.includes("") || !newuser) return;

    try {
      const response = await verifyOtp({
        identifier: newuser.newuser.identifier,
        otp: code.join(""),
      });

      if (response.exist) {
        navigate("/booking", { replace: true }); // Redirect existing users
      } else {
        navigate("/fillUserInfo", { replace: true, state: newuser }); // Redirect new users
      }
    } catch (err) {
      console.log(err);
      // Handle error - maybe show an error message
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center min-h-screen bg-gray-100">
      <Header title={`Verify your code`} />
      <div className="w-96 bg-white p-8 rounded-2xl shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4">
          {newuser?.newuser?.exist
            ? `Welcome back, ${newuser?.newuser?.username}.`
            : `Hi there, ${newuser?.usercontact}`}
        </h1>

        <p className="text-gray-600 mb-6">
          Enter the 4-digit code sent{" "}
          {newuser?.isEmail
            ? `${newuser?.usercontact
                .split("@")
                ?.map((part, index) =>
                  index === 0 ? part[0] + "*".repeat(part.length - 1) : part,
                )
                .join("@")}`
            : `${newuser?.usercontact?.slice(0, -4).replace(/\d/g, "*") + newuser?.usercontact?.slice(-4)}`}
        </p>

        <div className="flex justify-between mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="number"
              maxLength="1"
              inputMode="numeric"
              value={digit}
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-12 border-2 text-black border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring focus:ring-blue-400"
            />
          ))}
        </div>

        <button
          className="bg-primaryred p-2 w-full rounded-md border-2 text-white disabled:opacity-50"
          disabled={code.includes("") || isLoading}
          onClick={handleVerify}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>
      </div>
    </div>
  );
};

export default VerifyRide;

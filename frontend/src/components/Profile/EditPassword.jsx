import { useState } from "react";
import { createPortal } from "react-dom";
import {
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

function EditPassword({ isOpen, onClose }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValid, setIsValid] = useState({
    length: false,
    digit: false,
    capital: false,
    character: false,
  });

  const passwordConditionText = [
    { text: "At least 8 characters long", key: "length" },
    { text: "Contains at least one digit", key: "digit" },
    { text: "Contains One Capital letter", key: "capital" },
    { text: "Contains at least one symbol", key: "character" },
  ];

  // handle password input
  const handlePasswordChange = (event) => {
    const newPassword = event.currentTarget.value;
    setPassword(newPassword);

    // then validate the password
    setIsValid({
      length: newPassword.length >= 8,
      digit: /\d/.test(newPassword),
      capital: /[A-Z]/.test(newPassword),
      character: /[^A-Za-z0-9]/.test(newPassword),
    });
  };

  // checking for all condition if it's matches or not && check if password is match with confirm ... (AND logic)⬇️⬇️👇 return a boolean
  const isFormValid =
    Object.values(isValid).every(Boolean) && password === confirmPassword;
  console.log(isFormValid);

  // for now
  const clearing = () => {
    onClose(false);
    setPassword("");
    setConfirmPassword("");
    setIsValid({
      length: false,
      digit: false,
      character: false,
      capital: false,
    });
  };

  return createPortal(
    isOpen && (
      <div
        onClick={clearing}
        className="fixed inset-0 w-full h-screen z-50 bg-black/50 mb-3 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg"
        >
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold mb-4">Password</h2>
            <FaTimes
              className="text-gray-500 cursor-pointer"
              onClick={clearing}
            />
          </div>
          <p className="text-gray-600 mb-4">
            Your password must be at least 8 characters long, and contain at
            least one digit and one non-digit character
          </p>
          <form
            className="space-y-3"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="flex flex-col gap-2">
              <label className="text-base text-gray-500">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 rounded-md outline-none border-2 text-black border-gray-100 focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base text-gray-500">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.currentTarget.value)
                  }
                  className="w-full px-4 py-2 rounded-md text-black outline-none border-2 border-gray-100 focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500 " />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 py-4">
              <button
                type="button"
                onClick={clearing}
                className="px-4 py-2 bg-gray-600 text-white rounded-md"
              >
                cancel
              </button>
              <button
                className={`px-4 py-2  text-white rounded-md ${
                  isFormValid
                    ? "bg-black cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                disabled={!isFormValid}
                onClick={() => {
                  clearing();
                  toast.success("password updated successfully");
                }}
              >
                Update
              </button>
            </div>
          </form>

          {/* valid conditions  */}
          {password.length > 0 ? (
            <div className="mt-4 space-y-2 text-sm">
              {passwordConditionText.map((condition) => (
                <div
                  key={condition.key}
                  className="flex items-center space-x-2"
                >
                  {isValid[condition.key] ? (
                    <FaCheckCircle className="text-green-600" />
                  ) : (
                    <FaTimesCircle className="text-red-600" />
                  )}
                  <span
                    className={
                      isValid[condition.key]
                        ? "text-green-500 font-medium"
                        : "tex-gray-500"
                    }
                  >
                    {condition.text}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    ),
    document.body,
  );
}

export default EditPassword;

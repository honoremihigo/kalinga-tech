import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronDown } from "react-icons/fa";
import { countries } from "../../staticData/countries";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/ClientAuthContext";

const EditPhoneNumber = ({
  isOpen,
  onClose,
  currentUser,
  onUpdate,
  API_URL,
}) => {
  const { user,updateClient } = useAuth();
  const [phone, setPhone] = useState(currentUser.phone);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  

  useEffect(() => {
    if (currentUser.Countrycode) {
      const code = currentUser.Countrycode;
      const storedCountry = countries.find((country) => country.dialCode == '+'+code);
      setPhone(currentUser.phone.replace(storedCountry.dialCode, ""));
      setSelectedCountry(storedCountry);
    }
  }, [isOpen]);

  //check if user didn't write again the country code or number start with +
  const validatePhoneNumber = (userInput) => {
    const countryCode = selectedCountry.dialCode.replace("+", "");

    if (userInput.startsWith("+") || userInput.startsWith(countryCode)) {
      toast.error("please enter your phone number without country code");
      return false;
    }
    // this allow user to clear input and clear to empty field
    if (userInput === "") {
      return true;
    }

    // to check if userInput is a valid number
    if (!/^\d+$/.test(userInput)) {
      toast.error("Please phone number should only contain numbers");
      return false;
    }

    return true;
  };

  const handleChangeNumber = (event) => {
    const input = event.currentTarget.value;
    if (validatePhoneNumber(input)) {
      setPhone(input);
    }
  };

  const handleSubmit = async () => {
    const response = await updateClient({ phone: selectedCountry.dialCode + phone ,code: selectedCountry.dialCode.replace('+','') })
    if (response) {
      // for now no verification just store it
      onUpdate({
        ...response,
      });

      const code = response.Countrycode;
      const storedCountry = countries.find((country) => country.dialCode == '+'+code);
      setPhone(response.phone.replace(storedCountry.dialCode, ""));
      setSelectedCountry(storedCountry);

      onClose(false);
      toast.success("phone updated successfully");
    }
  };

  return createPortal(
    isOpen && (
      <div
        onClick={() => onClose(false)}
        className="fixed inset-0 w-full h-screen z-50 bg-black/50 backdrop-blur-sm mb-3 flex justify-center items-center p-4"
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-bold mb-4">Update Phone Number</h2>
          <p className="text-gray-600 mb-4">
            You’ll use this number to get notifications, sign in, and recover
            your account.
          </p>

          <div className="relative mt-4">
            <div
              className="flex items-center border rounded px-3 py-2 cursor-pointer bg-gray-100"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="mr-2">{selectedCountry.flag}</span>
              <span>
                {selectedCountry.code} ({selectedCountry.dialCode})
              </span>
              <FaChevronDown className="ml-auto text-gray-500" />
            </div>

            {showDropdown && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border shadow-md rounded max-h-40 overflow-y-auto z-10">
                {countries.map((country) => (
                  <div
                    key={country.code}
                    className="flex items-center px-3 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setSelectedCountry(country);
                      setShowDropdown(false);
                    }}
                  >
                    <span className="mr-2">{country.flag}</span>
                    <span>
                      {country.name} ({country.dialCode})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="flex items-center mt-3  px-3 py-2 focus:outline-none border rounded-md">
            <span className="text-gray-800">{selectedCountry.dialCode}</span>
            <input
              type="tel"
              maxLength={15}
              placeholder="e.g: 792330514"
              className="flex-1 py-1 pl-3 outline-none text-gray-700"
              value={phone}
              onChange={handleChangeNumber}
            />
          </div>

          {/* Update Button */}
          <div className="flex items-center justify-start py-4 gap-2">
            <button
              onClick={() => onClose(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              {" "}
              Update{" "}
            </button>
          </div>
        </div>
      </div>
    ),
    document.body,
  );
};

export default EditPhoneNumber;

import React, { useCallback, useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const StyledPhoneInput = ({ value, onChange, error, inputRef }) => {
  const [country, setCountry] = useState("auto");

  useEffect(() => {
    const getUserCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        setCountry(data.country_code.toLowerCase()); // Set detected country
      } catch (error) {
        setCountry(`rw`);
        console.error("Error fetching country:", error);
      }
    };

    getUserCountry();
  }, []);

  return (
    <PhoneInput
      country={country}
      value={value.replace("+", "")}
      enableSearch={true}
      onChange={onChange}
      searchClass="w-full p-3 rounded-lg focus:outline-none text-black"
      containerClass="mb-2"
      inputClass={`w-full  py-4 rounded-lg border focus:outline-none text-black ${
        !error
          ? "border-red-500"
          : "border-red-300 focus:ring-2 focus:ring-red-500"
      }`}
      buttonClass="bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200"
      dropdownClass="bg-white border border-gray-300 rounded-lg mt-1"
      searchStyle={{
        backgroundColor: "white",
        border: "1px solid #D1D5DB",
        color: "black",
        borderRadius: "0.5rem",
      }}
      inputProps={{
        ref: inputRef,
      }}
      buttonStyle={{
        border: "1px solid #D1D5DB",
        borderRight: "none",
        backgroundColor: "#F3F4F6",
        width: `40px`,
        borderRadius: "0.5rem 0 0 0.5rem",
      }}
      inputStyle={{
        width: "100%",
        height: "48px",

        borderRadius: "0.5rem",
      }}
    />
  );
};

export default StyledPhoneInput;

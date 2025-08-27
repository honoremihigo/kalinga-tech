import React from "react";
import axios from "axios";

export default function SHitss() {
  const shit = async () => {
    try {
      const formData = new FormData();

      formData.append(`identifier`, `ishimweserge@gmail.com`);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/driver/apply`,
        formData,
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button onClick={shit} className="p-2 bg-black px-4 text-white text-4xl">
        shit test
      </button>
    </div>
  );
}

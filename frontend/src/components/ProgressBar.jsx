/* eslint-disable react/prop-types */

import { useJobApplication } from "../context/JobApplicationContext";

function ProgressBar({ completedSteps }) {
  const { steps } = useJobApplication();

  return (
    <div className="w-full flex justify-center my-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`h-2 w-1/4 mx-1 rounded-full ${
            completedSteps.includes(step) ? "bg-red-500" : "bg-gray-300"
          }`}
        ></div>
      ))}
    </div>
  );
}

export default ProgressBar;

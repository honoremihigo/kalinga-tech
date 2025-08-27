/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const JobApplicationContext = createContext();

const JobApplicationProvider = ({ children }) => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const steps = ["profile", "license", "background", "insurance"];
  // completed steps
  const markCompletedSteps = (step) => {
    setCompletedSteps((prevCompletedSteps) => [
      ...new Set([...prevCompletedSteps, step]),
    ]);
  };

  // store the uploaded files

  const storeUploadedFile = (step, file) => {
    setUploadedFiles((prevUploadedFiles) => ({
      ...prevUploadedFiles,
      [step]: file,
    }));
  };

  return (
    <JobApplicationContext.Provider
      value={{
        completedSteps,
        setUploadedFiles,
        markCompletedSteps,
        storeUploadedFile,
        uploadedFiles,
        steps,
      }}
    >
      {children}
    </JobApplicationContext.Provider>
  );
};

// custom hook
export const useJobApplication = () => useContext(JobApplicationContext);

export default JobApplicationProvider;

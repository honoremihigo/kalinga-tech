import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Faq = () => {
  const [visibleAnswers, setVisibleAnswers] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const toggleAnswerVisibility = (index) => {
    setVisibleAnswers((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const faqs = [
    {
      question: "How Do I Get Started?",
      answer:
        "Our service aims to provide seamless solutions to manage your tasks efficiently and effectively.",
    },
    {
      question: "Can We Start Any Time Of Year?",
      answer:
        "Getting started is easy! Just sign up on our platform, explore the features, and begin your journey.",
    },
    {
      question: "What Salary Do You Pay?",
      answer:
        "We offer 24/7 customer support to address all your queries and concerns.",
    },
    {
      question: "Can I Customize My Solution?",
      answer:
        "Yes, our platform allows for extensive customization to fit your needs.",
    },
    {
      question: "Preventing HR-Business Plan?",
      answer:
        "We use top-notch security measures to ensure your data is safe and private.",
    },
    {
      question: "How Does The Engangement Changes As My Business Scales?",
      answer:
        "We use top-notch security measures to ensure your data is safe and private.",
    },
    {
      question: "Is HR Consult The Right Consultancy For Me?",
      answer:
        "We use top-notch security measures to ensure your data is safe and private.",
    },
    {
      question: "In Which Countries Can i Find Your Company?",
      answer:
        "We use top-notch security measures to ensure your data is safe and private.",
    },
    {
      question: "Popular Training For Tips And Business Benefits?",
      answer:
        "We use top-notch security measures to ensure your data is safe and private.",
    },
    {
      question: "Is HR Consult The Right Consultancy For Me?",
      answer:
        "We use top-notch security measures to ensure your data is safe and private.",
    },
  ];

  return (
    <>
      {/* <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-lg shadow-lg mt-10">
        
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('src/assets/images/service/marketResearch.jpg')`, filter: 'brightness(30%)' }}
        ></div>

    
        <div className="absolute inset-y-0 left-0 w-[60%] bg-teal-800 bg-opacity-90"></div>

        <div className="relative z-10 p-8 text-white">
          <h1 className="text-4xl font-bold mt-20">FAQ</h1>
          <p className='text-1xl '>Home / FAQ</p>
        </div>
      </div> */}

      <div className="relative z-10 px-8 py-12">
        <div className="flex justify-center mb-6">
          <p className="text-1xl text-center p-2 w-fit bg-slate-100 rounded-lg shadow-md">
            SOME Q&A
          </p>
        </div>

        <h1 className="text-5xl font-bold mb-6 text-center">
          Question and Answer
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="relative bg-gray-100 text-gray-900 rounded-lg shadow-lg p-6 flex flex-col items-start"
            >
              <div className="flex justify-between items-center w-full">
                <h2 className="text-lg font-semibold mr-4">{faq.question}</h2>
                <button
                  onClick={() => toggleAnswerVisibility(index)}
                  className="text-gray-700 hover:text-gray-700 focus:outline-none text-xl"
                >
                  {visibleAnswers[index] ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {visibleAnswers[index] && (
                <p className="mt-4 text-sm leading-5  text-gray-900 rounded p-4 w-full">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Faq;

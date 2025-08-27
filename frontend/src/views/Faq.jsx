import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Collapse } from "bootstrap"; // Import Collapse from Bootstrap
import Header from "../components/Header";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null); // State to track the currently opened FAQ

  const faqs = [
    // Transportation Service (Uber/Lyft-like)
    {
      question: "How do I book a ride with Abyride?",
      answer:
        "Booking a ride with Abyride is straightforward. Open the Abyride app and enter your destination in the provided field. Then, choose your preferred vehicle type (economy, luxury, or group option), and confirm your booking. The process is user-friendly and designed for convenience.",
    },
    {
      question: "What types of vehicles are available for rides?",
      answer:
        "Abyride offers multiple vehicle options to suit different needs. Economy vehicles are budget-friendly for solo or small group travel, luxury vehicles provide a premium experience, and larger vehicles accommodate groups or families. This ensures a tailored service for every passenger.",
    },
    {
      question: "How is the pricing calculated for rides?",
      answer:
        "The pricing for Abyride rides is determined by three factors: the distance traveled, the time taken, and the current demand. Before confirming your booking, the app provides a fare estimate, so you can make an informed decision about the cost.",
    },
    {
      question: "Is there a way to track my ride in real-time?",
      answer:
        "route to your destination. This feature ensures safety and keeps you informed throughout your journey.",
    },
    {
      question: "How can I pay for my ride?",
      answer:
        "Abyride supports various payment methods, including credit and debit cards. Additionally, it accepts digital wallets like PayPal and other supported services, providing flexibility and ease for passengers to complete their payments securely.",
    },

    {
      question: "What types of home care services does Abyride offer?",
      answer:
        "Abyride provides a wide range of home care services to cater to various needs. These include elderly care, where caregivers assist with daily tasks and companionship, child care for babysitting and supervision, and household cleaning assistance to keep your home tidy and organized. Each service is designed to ensure comfort and convenience for clients.",
    },
    {
      question: "How do I request a caregiver?",
      answer:
        "Requesting a caregiver with Abyride is simple and convenient. Open the app and select the type of care you require, whether it's for elderly care, child care, or household assistance. You can then choose the timing that works best for you and confirm the request. The process is designed to be quick and user-friendly.",
    },
    {
      question: "Are the caregivers background-checked?",
      answer:
        "Yes, all caregivers at Abyride undergo a rigorous background-check process to ensure they are trustworthy and qualified. This includes verifying their identity, criminal records, and professional references. Additionally, caregivers receive training to meet industry standards, providing you with peace of mind and high-quality care.",
    },
    {
      question: "Can I customize the care plan?",
      answer:
        "Absolutely, Abyride allows clients to fully customize their care plans. You can specify the type of assistance you need, the schedule, and any special preferences or requirements. This flexibility ensures that the care provided is tailored to your unique needs, enhancing comfort and satisfaction for you or your loved ones.",
    },
    {
      question: "Is home care available 24/7?",
      answer:
        "Yes, Abyride offers home care services 24 hours a day, 7 days a week. This means you can access assistance whenever you need it, whether it’s during the day, at night, or over the weekend. The round-the-clock availability is designed to provide consistent and reliable support for all clients.",
    },

    // Language Translation Service
    {
      question: "What languages does Abyride support for translation?",
      answer:
        "Abyride provides translation services in a wide range of languages to meet diverse needs. Supported languages include English, Spanish, French, Arabic, and several others. This ensures effective communication across various linguistic barriers. Abyride continuously expands its language offerings to serve more users globally.",
    },
    {
      question: "How do I request a language translation?",
      answer:
        "Requesting a language translation with Abyride is quick and straightforward. Open the app and select the language pair you require, such as English to French or Spanish to Arabic. Then, input the text or upload the speech you need translated. The app processes your request efficiently and delivers accurate results.",
    },
    {
      question: "Can I request both written and spoken translations?",
      answer:
        "Yes, Abyride supports both written and spoken translations to cater to your specific needs. Written translations are ideal for documents and texts, while spoken translations are perfect for real-time communication. This flexibility ensures users can access the type of translation they need, whether for professional or personal purposes.",
    },
    {
      question: "Are the translators certified professionals?",
      answer:
        "Yes, all translators working with Abyride are certified professionals with extensive experience in the field. They undergo rigorous vetting to ensure they deliver high-quality and accurate translations. This commitment to professionalism guarantees reliable services that meet industry standards and customer expectations.",
    },
    {
      question: "Can I get real-time translation for conversations?",
      answer:
        "Yes, Abyride offers real-time translation services to facilitate seamless communication in live settings. This is particularly useful for meetings, conferences, or while traveling in a foreign country. The app’s advanced technology ensures quick and accurate translations, making it easier to engage in conversations with others.",
    },
    // General Background
    {
      question: "What is Abyride?",
      answer:
        "Abyride is a versatile platform that offers a variety of services to meet everyday needs. These include transportation, home care, depannage (roadside assistance), and language translation, among others. With a focus on reliability and efficiency, Abyride ensures seamless access to these services through its user-friendly app. It aims to simplify life by bringing multiple solutions into one platform.",
    },
    {
      question: "In which areas are Abyride services available?",
      answer:
        "Abyride operates in multiple cities and regions, making its services accessible to a broad audience. The platform is constantly expanding to bring its offerings to new locations and communities. Users can check the app or website to see if services are available in their area. This growth ensures more people benefit from Abyride’s reliable solutions.",
    },
    {
      question: "How do I get started with Abyride?",
      answer:
        "Getting started with Abyride is easy and straightforward. Simply download the Abyride app from your device’s app store and create an account by following the registration process. Once registered, you can explore the available services in your area. The app is designed to be user-friendly, ensuring a seamless onboarding experience for new users.",
    },
    {
      question: "How can I contact Abyride customer support?",
      answer:
        "Abyride provides multiple channels for contacting customer support to ensure user satisfaction. You can reach out through the app’s support section, visit the website for assistance, or call the dedicated support hotline. This ensures you can get help with any issues or inquiries quickly and efficiently, no matter your preference.",
    },
    {
      question: "Is there a referral program with Abyride?",
      answer:
        "Yes, Abyride offers an attractive referral program to reward loyal users. When you refer friends or family to join the platform, you can earn rewards such as discounts or credits for future services. This program encourages sharing Abyride with others and helps users save money while expanding the platform’s community.",
    },
  ];

  const handleToggle = (index) => {
    const element = document.getElementById(`faq-answer-${index}`);
    const bsCollapse = new Collapse(element, { toggle: true });
    bsCollapse.toggle();

    // Toggle the currently opened FAQ
    setOpenIndex(openIndex === index ? null : index);
  };
  // each time the url or path change it changes the header name
  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",

      inline: "start",
    });
  }, []);

  return (
    <div className="relative z-10 px-8 py-12">
      <Header title="FAQ" />
      <h1 className="text-5xl font-bold mb-6 text-center p-4 ">
        Frequently Asked Questions.
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="relative bg-gray-100 text-gray-900 rounded-lg shadow-lg p-6 flex flex-col items-start"
          >
            <div className="flex justify-between items-center w-full">
              <h2 className="text-md font-semibold mr-4">{faq.question}</h2>
              <button
                className="text-gray-700 hover:text-gray-700 focus:outline-none text-xl"
                onClick={() => handleToggle(index)} // Toggle the FAQ visibility
              >
                {openIndex === index ? <FaEyeSlash /> : <FaEye />}{" "}
                {/* Change icon based on state */}
              </button>
            </div>

            <div id={`faq-answer-${index}`} className="collapse">
              <p className="mt-2 text-sm leading-2 text-gray-900 rounded p-3 w-full">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;

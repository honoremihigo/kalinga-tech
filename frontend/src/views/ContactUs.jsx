import React, { useState, useEffect } from "react";
import ContactBgImg from "../assets/static/contact.jpeg"; // Import the image
import { ContactService } from "../Services/Landing/ContactService"; // Adjust the path as needed

import "../assets/css/ContactUs.css";

import Swal from "sweetalert2";

import Header from "../components/Header";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaQuestionCircle,
} from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await ContactService.ContactUs(formData);

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text:
          response.message ||
          "We’ve received your message and will respond shortly.",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong.",
      });
    }
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
    <div className="gpp-container">
      <Header title="Contact us" />

      <div className="contactB-container">
        <div className="flex flex-col lg:flex-row items-center p-6 lg:space-y-0 ">
          <div className="flex flex-col lg:flex-row max-sm:gap-8 max-md:gap-10 max-lg:gap-10 lg:gap-8 p-6 lg:space-y-0 bg-[#EAEEF1] items-center justify-center">
            {/* Left Section: Image and Titles */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left ">
              <p className="text-lg p-1 w-32 text-center rounded-md font-semibold text-gray-700 mb-4 bg-white">
                Contact Us
              </p>
              <h1 className="HeaderTxt text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Contact us for more Details
              </h1>
              <div className="contactImg w-full lg:w-3/4">
                <img
                  src={ContactBgImg}
                  alt="Contact representative image"
                  className="w-full h-[410px] mb-2 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Right Section: Contact Details (Stacked on small, grid on large) */}
            <div className="w-full lg:w-1/2 flex flex-col lg:grid lg:grid-cols-2 justify-center gap-3">
              {/* Card 1 */}
              <div className="re-box items-center p-6 rounded-lg bg-[#293751] lg:mt-24">
                <div className="circle-icon bg-blue-600 text-white rounded-full p-4">
                  <FaEnvelope className="text-white w-16 h-20" />
                </div>
                <div className="re-content mt-4 ">
                  <h3
                    className="text-[22px] font-semibold text-white"
                    style={{ letterSpacing: "2px" }}
                  >
                    Email Address
                  </h3>
                  <p className="font-semibold text-[16px] text-gray-400 capitalize">
                    <a
                      href="#verified"
                      className="email-txt text-[14px] text-gray-400"
                    >
                      kalingatechnology@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="re-box items-center p-6 rounded-lg bg-[#293751] lg:mt-24">
                <div className="circle-icon bg-blue-600 text-white rounded-full p-4">
                  <FaMapMarkerAlt className="text-white w-6 h-4" />
                </div>
                <div className="re-content mt-4">
                  <h3
                    className="text-[22px] font-semibold text-white"
                    style={{ letterSpacing: "2px" }}
                  >
                    Location Address
                  </h3>
                  <p className="text-gray-600 font-semibold">
                    <a
                      href="#verified"
                      className="email-txt text-[14px] text-gray-400"
                    >
                      Near Kigali Mosque, 84 KN 74 St, Kigali
                    </a>
                  </p>
                </div>
              </div>
              {/* Card 3 */}
              <div className="re-box items-center p-6 rounded-lg bg-[#293751]">
                <div className="circle-icon bg-blue-600 text-white rounded-full p-4">
                  <FaPhoneAlt className="text-white w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4" />
                </div>
                <div className="re-content mt-4">
                  <h3
                    className="text-[22px] font-semibold text-white"
                    style={{ letterSpacing: "2px" }}
                  >
                    Phone Call
                  </h3>
                  <p className="text-gray-600 font-semibold">
                    <a
                      href="#verified"
                      className="email-txt text-[14px] text-gray-400"
                    >
                      +250 786 136 396
                    </a>
                  </p>
                </div>
              </div>
              <div className="re-box items-center p-6 rounded-lg bg-[#293751]">
                <div className="circle-icon bg-blue-600 text-white rounded-full p-4">
                  <FaQuestionCircle className="text-white w-16 h-20" />
                </div>
                <div className="re-content mt-4">
                  <h3
                    className="text-[22px] font-semibold text-white"
                    style={{ letterSpacing: "2px" }}
                  >
                    Have any problem
                  </h3>

                  <p className="font-semibold text-[16px] text-gray-200 capitalize">
                    <a
                      href="#verified"
                      className="email-txt text-[14px] text-gray-400"
                    >
                      If you have any problem feel free to reach out
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="contactF-form">
          <div className="form-content">
            <form onSubmit={handleSubmit} className="" >
              <h2 className="FormHeader">Get Shipping Support</h2>

              <div className="flex-field">
                <div className="field">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                  />
                </div>
              </div>

              <div className="flex-field">
                <div className="field">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone Number"
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <textarea
                  name="message"
                  rows="7" // Increased from 5 to 10
                  // style={{ minHeight: "100px" }} // Optional: custom height
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                />
              </div>

              <button type="submit" className="formBtn">
                SEND MESSAGE <i className="fa-solid fa-arrow-right ml-1"></i>
              </button>
            </form>
          </div>
          <div className="form-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5147833181513!2d30.056495274487297!3d-1.9470610367043013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca5a56e945f9f%3A0x6053dc4837aa5a78!2s84%20KN%2074%20St%2C%20Kigali!5e0!3m2!1sen!2srw!4v1755939672380!5m2!1sen!2srw"
              width="100%"
              height="400px"
              style={{ border: "0" }} // Corrected style object
              allowfullscreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

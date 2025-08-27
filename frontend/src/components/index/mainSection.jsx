import React, { useState } from "react";
import { FiPlay } from "react-icons/fi";
import image from "../../assets/images/casestudy/holla.webp";
import image2 from "../../assets/images/hero/content-image.png";
import appstore from "../../assets/images/casestudy/appstore.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import image1 from "../../assets/images/sadiki.jpg";
import image3 from "../../assets/images/md.jpg";

// slide images

import slide1 from "../../assets/images/slide/slide1.webp";
import slide2 from "../../assets/images/slide/slide2.webp";
import slide3 from "../../assets/images/slide/slide3.webp";

import slide4 from "../../assets/images/slide/slide10.jpg";
import slide5 from "../../assets/images/slide/slide11.jpg";
import slide6 from "../../assets/images/slide/slide12.jpg";

import slide8 from "../../assets/images/slide/slide17.jpg";
import slide9 from "../../assets/images/slide/slide18.jpg";
import slide10 from "../../assets/images/slide/slide19.jpg";

import slide7 from "../../assets/images/slide/slide4.webp";

function MainSection() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const teamMembers = [
    {
      id: 1,
      name: "Sadiki Rukara",
      position: "C.E.O",
      image: image1,
      social: {
        Whatsapp: "+1 (616) 633 7026",
        Envelope: "abyridellc@gmail.com",
      },
    },
    {
      id: 2,
      name: "Luciene umutesi",
      position: "M.D",
      image: image3,
      social: {
        Whatsapp: "+1 (616) 633 7026",
        Envelope: "luciene@abyride.com",
      },
    },
    // Add more team members as needed
  ];

  const images = [
    {
      id: 1,
      url: slide1,
    },
    {
      id: 2,
      url: slide4,
    },
    {
      id: 3,
      url: slide8,
    },
    {
      id: 4,
      url: slide2,
    },
    {
      id: 5,
      url: slide5,
    },
    {
      id: 6,
      url: slide9,
    },
    {
      id: 7,
      url: slide3,
    },
    {
      id: 8,
      url: slide6,
    },
    {
      id: 9,
      url: slide10,
    },
  ];

  return (
    <div className="md:flex   pb-10 overflow-hidden h-[320px] md:h-[850px] m-auto w-[100%] mb-4 rounded-lg p-4">
      <div className="relative border-2  w-[24%] rounded-lg mx-auto overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${slide7})`,
          }}
        ></div>

        {/* Animated Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={() => setShowVideoModal(true)} // Toggle modal state
            className="relative w-16 h-16 flex items-center justify-center"
            style={{
              width: "64px", // Equivalent to w-16 in Tailwind
              height: "64px",
              backgroundColor: "#3b82f6", // Equivalent to bg-blue-500
              color: "#ffffff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 20px 5px rgba(59, 130, 246, 0.7), 0 0 40px 10px rgba(59, 130, 246, 0.5)",
              transform: "scale(1)",
              animation: "highPulse 2s infinite",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <FiPlay style={{ width: "32px", height: "32px" }} />
          </button>

          {/* Add Keyframes in a <style> tag for the highPulse animation */}
          <style>
            {`
      @keyframes highPulse {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.7), 0 0 40px 10px rgba(59, 130, 246, 0.5);
        }
        50% {
          transform: scale(1.2);
          box-shadow: 0 0 30px 10px rgba(59, 130, 246, 0.9), 0 0 60px 20px rgba(59, 130, 246, 0.8);
        }
      }
    `}
          </style>
        </div>

        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 mr-4 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4  rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-w-5xl">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-lg font-semibold">Watch Video</h5>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
              <div className="relative w-full h-0 pb-[56.25%]">
                <iframe
                  style={{
                    position: "absolute",
                    height: "98%",
                    width: "100%",
                    borderRadius: "10px",
                  }}
                  src="https://www.youtube.com/embed/kt4irtXpbWo"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="YouTube Video"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="relative w-full  ml-4 mr-4 md:w-3/4 lg:w-1/2 mx-auto  rounded-lg p-4 overflow-hidden bg-cover bg-center text-white"
        style={{
          backgroundImage: `
      linear-gradient(to bottom, rgba(0, 0, 0, 0.7), #293751),
      url(${image2})`, // Replace with your actual background image
        }}
      >
        {/* Announcement Text */}
        <div className="text-center z-10 relative p-5">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
            Exciting News!
          </h1>
          <p className="text-sm md:text-lg">
            Dear clients and team, we're thrilled to announce that our app will
            be launching soon on both the <b>App Store</b> and <b>Play Store</b>
            . Stay tuned for updates and experience the future in your hands!
          </p>
        </div>

        {/* App Store and Play Store Buttons */}
        <div className="absolute bottom-6 w-full flex flex-wrap justify-center gap-5">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-24 h-10 mt-12 md:w-36 md:h-16 bg-contain bg-no-repeat"
            style={{
              backgroundImage:
                'url("https://i.pinimg.com/736x/a2/dc/17/a2dc1725c52455787f90c320d47e1acf.jpg")',
            }}
          ></a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-24 h-10 mt-12 md:w-36 md:h-16 bg-contain bg-no-repeat"
            style={{
              backgroundImage: `url(${appstore})`,
            }}
          ></a>
        </div>
      </div>

      <div className=" w-[24%] rounded-lg ">
        <div className=" w-[98%] rounded-lg h-[48%] bg-gray-50 border-none ">
          <Swiper
            modules={[Autoplay]} // Include the autoplay module
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{
              delay: 3000, // Delay between slides in ms
              disableOnInteraction: false, // Keep autoplay even after user interaction
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 1 },
              1024: { slidesPerView: 1 },
            }}
            className="team-slider  rounded-lg bg-slate-100 h-[100%]"
          >
            {teamMembers.map((member) => (
              <SwiperSlide key={member.id}>
                <div className=" h-[100%] mt-20 ">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-36 h-36 text-center rounded-full m-auto  object-cover "
                  />
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{member.position}</p>
                    <div className="flex mt-2 space-x-6 text-blue-500 justify-center">
                      <a
                        href={member.social.Whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-700"
                      >
                        <FaWhatsapp size={20} />
                      </a>
                      <a
                        href={member.social.Envelope}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-700"
                      >
                        <FaEnvelope size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className=" w-[98%] rounded-lg h-[48%] mt-4 overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="h-full"
          >
            {images.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="relative h-full">
                  {/* Background Image */}
                  <img
                    src={image.url}
                    alt={`Slide ${image.id}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default MainSection;

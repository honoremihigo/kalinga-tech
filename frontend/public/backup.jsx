import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import image1 from "../../assets/images/hero/home_pinkpaint_hero.webp";
import image2 from "../../assets/images/hero/nurser.avif";
import image3 from "../../assets/images/hero/langugae1.jpg";

import image4 from "../../assets/images/hero/wheelchair.jpg";
import image5 from "../../assets/images/hero/home2.jpg";
import image6 from "../../assets/images/hero/trans.jpg";

import SideBar from "./SideBar";
import Advertisement from "./Advertisement";

const HeroPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [image1, image2, image3, image4, image5, image6]; // Images representing each service

  const words = [
    "Reliable Transportation Services for Every Journey",
    "Caring Home Services Tailored to Your Needs",
    "Accurate and Fast Language Translation for Global Reach",
    "Seamless Logistics Solutions for On-Time Deliveries",
    "Compassionate Elder Care with a Personal Touch",
    "Professional Document Localization for Cross-Cultural Success",
  ];

  // Change slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 7000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <div className="w-full  gap-4 flex-col xl:h-[84vh]  xl:flex-row justify-between items-center flex">
      {/* Slideshow container */}
      <motion.div
        className="xl:w-12/12 h-[78vh] lg:h-[84vh]  w-full flex flex-col gap-4 justify-center p-7 sm:p-10 md:p-20 lg:p-30 xl:p-40 items-start text-white rounded-xl"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0)), url(${images[currentSlide]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        key={currentSlide}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.6 }}
        transition={{ duration: 1, ease: "backInOut" }} // Fade transition duration
      >
        <motion.div
          initial={{ y: 40 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: "linear" }}
          className="flex justify-center uppercase items-center font-medium p-2 text-white bg-gray-300 rounded-lg bg-opacity-30 backdrop-blur-lg gap-2"
        >
          <span className="text-[#47B2E4] rounded-md bg-white p-1 px-2">
            abyride
          </span>{" "}
          <span>it is best to drive with us</span>
        </motion.div>
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0.1 }}
          transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
          className="lg:w-10/12 font-bold uppercase  text-3xl lg:text-4xl xl:text-5xl leading-loose"
          style={{ lineHeight: "1.6" }}
        >
          {words[currentSlide]}
        </motion.h1>
        <motion.button
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0.1 }}
          transition={{ duration: 1, delay: 2, ease: "easeInOut" }}
          className="uppercase font-medium text-md text-white bg-[#47B2E4] py-3 px-8 rounded-lg"
        >
          more about
        </motion.button>
      </motion.div>

   
    </div>

    </>
  );
};

export default HeroPage;

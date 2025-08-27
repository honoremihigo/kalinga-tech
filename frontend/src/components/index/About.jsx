import React, { useState } from "react";
import { motion } from "framer-motion";

import Image from '../../assets/static/service4.jpg'; // Keep your image path

// eslint-disable-next-line react/prop-types
const CheckIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const About = () => {
  const [hoveredQuality, setHoveredQuality] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const qualities = [
    "high-quality PlayStation devices",
    "expert machine repair services",
    "reliable electronic equipment sales",
    "professional customer support"
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  const qualityVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.05,
      x: 10,
      transition: { duration: 0.3 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className="bg-[#293751] p-3 mt-3 mb-14 rounded-xl text-white flex capitalize flex-wrap overflow-hidden relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#47B2E4]/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#47B2E4]/10 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
      
      {/* Content Section */}
      <div className="w-full flex flex-col gap-5 lg:w-1/2 p-8 pt-10 flex-auto relative z-10">
        {/* Section Label */}
        <motion.h2 
          className="text-lg text-gray-300 relative"
          variants={itemVariants}
        >
          <span className="text-[#47B2E4]"></span> about us
          <motion.div
            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#47B2E4] to-[#293751]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.h2>

        {/* Main Title */}
        <motion.h1 
          className="font-bold text-2xl md:text-4xl -mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          About Kalinga Tech
        </motion.h1>

        {/* Description */}
        <motion.p 
          className="text-[12px] md:text-lg pr-6 text-gray-300 relative"
          variants={itemVariants}
          style={{lineHeight:2}}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
          >
            Welcome to Kalinga Tech, your reliable electronics hub. We specialize
            in selling high-quality machines and PlayStation devices, while also
            offering expert repair services for all kinds of electronic equipment.
            Our mission is to provide top-notch products and professional support
            to ensure your electronics perform at their best.
          </motion.span>
        </motion.p>

        {/* Qualities Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 p-2 -mt-6 gap-4"
          variants={itemVariants}
        >
          {qualities.map((quality, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer group"
              variants={qualityVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredQuality(i)}
              onHoverEnd={() => setHoveredQuality(null)}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                className={`p-2 rounded-full ${
                  hoveredQuality === i 
                    ? 'bg-gradient-to-r from-[#47B2E4] to-[#293751]' 
                    : 'bg-gradient-to-r from-[#47B2E4]/20 to-[#293751]/20'
                }`}
                animate={{
                  scale: hoveredQuality === i ? 1.1 : 1,
                  rotate: hoveredQuality === i ? 360 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <CheckIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </motion.div>
              <p className="text-[12px] md:text-md text-gray-200 group-hover:text-white transition-colors duration-300">
                {quality}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 lg:w-5/12 w-full p-6 h-[600px] object-cover flex-auto relative">
        <motion.div
          className="relative w-full h-full rounded-2xl overflow-hidden group"
          variants={imageVariants}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse rounded-2xl"></div>
          )}
          
          <motion.img
            src={Image}
            className="w-full h-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-110"
            alt="About Kalinga Tech"
            onLoad={() => setImageLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#293751]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <motion.div
            className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-[#47B2E4] to-[#293751] rounded-full flex items-center justify-center text-white font-bold shadow-lg"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            ✓
          </motion.div>
          
          <motion.div
            className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-[#293751] font-semibold text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            Trusted Electronics Hub
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;

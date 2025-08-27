import React from "react";
import { motion } from "framer-motion";
import { Gamepad2, Monitor, Headset, Wrench } from "lucide-react";

const ArrowUpIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);
const WifiIcon = () => (
  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
);
const HeartIcon = () => (
  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
);
const LanguageIcon = () => (
  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
);
const CarIcon = () => (
  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
);
const MedicalIcon = () => (
  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
);
const AmbulanceIcon = () => (
  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
);
const AirportIcon = () => (
  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
);

import Image1 from "../../assets/static/service1.jpg";
import Image2 from "../../assets/static/service2.jpg";
import Image3 from "../../assets/static/service3.jpg";
import Image4 from "../../assets/static/service4.jpg";

// eslint-disable-next-line react/prop-types
const ServiceCard = ({ SvgIcon, num, Img, title, par, link }) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100  "
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Gradient overlay background */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#47B2E4] to-[#293751] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

      {/* Header section with icon and number */}
      <div className="relative p-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          {/* Icon with gradient background */}
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-[#47B2E4] to-[#293751] shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
            <SvgIcon className="w-6 h-6 text-white" />
          </div>

          {/* Number badge */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#47B2E4] to-[#293751] shadow-md">
            <span className="text-white font-bold text-sm">{num}</span>
          </div>
        </div>
      </div>

      {/* Image section */}
      <div className="relative px-4 pb-3">
        <div className="relative overflow-hidden rounded-xl group-hover:rounded-2xl transition-all duration-500">
          <img
            src={Img}
            alt={title}
            className="w-full h-52 object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>

      {/* Content section */}
      <div className="px-4 pb-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#47B2E4] group-hover:to-[#293751] transition-all duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-4 text-sm line-clamp-3">
          {par}
        </p>

        {/* Action button */}
        <a href={link} className="group/btn">
          <motion.div
            className="flex items-center justify-center w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#47B2E4] to-[#293751] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-[#47B2E4] group-hover:to-[#293751]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2 text-sm">Learn More</span>
            <ArrowUpIcon className="w-3 h-3 transform rotate-45 group-hover/btn:rotate-90 transition-transform duration-300" />
          </motion.div>
        </a>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#47B2E4]/10 to-[#293751]/10 rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#293751]/10 to-[#47B2E4]/10 rounded-full transform -translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-700"></div>
    </motion.div>
  );
};

const Services = () => {
  const Services = [
    [
      {
        num: "01",
        icon: Monitor,
        img: Image3,
        title: "Machine Sales",
        des: "Kalinga Tech offers a wide range of high-quality machines for various needs. From industrial equipment to home appliances, our expertly curated selection ensures durability and performance, helping you power your projects with confidence.",
        link: "/services",
      },
      {
        num: "02",
        icon: Gamepad2,
        img: Image2,
        title: "PlayStation Devices",
        des: "Experience gaming like never before with Kalinga Tech’s range of PlayStation consoles and accessories. Whether you’re a casual gamer or a pro, we provide the latest devices to elevate your entertainment with immersive performance.",
        link: "/services",
      },
      {
        num: "03",
        icon: Wrench,
        img: Image1,
        title: "Expert Repair Services",
        des: "Kalinga Tech provides fast and reliable repair services for all types of electronic equipment. From PlayStation consoles to complex machinery, our skilled technicians ensure your devices are restored to optimal performance with precision and care.",
        link: "/services",
      },
      {
        num: "04",
        icon: Headset,
        img: Image4,
        title: "Tech Support",
        des: "Need help with your electronics? Kalinga Tech offers comprehensive tech support to troubleshoot issues, optimize performance, and provide guidance. Our team is here to ensure your devices run smoothly, whether for work or play.",
        link: "/services",
      },
    ],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 mt-8 ">
      <div className="max-w-9xl mx-auto -mb-10 ">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#47B2E4] to-[#293751] mb-2 -mt-12">
            Services
          </h2>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2 mt-2">
            Discover Our Electronics Solutions
          </h3>
          <p className="text-gray-600 max-w-2xl -mb-6 mx-auto text-lg leading-relaxed">
            High-quality machines, PlayStation devices, and expert repair
            services to keep your electronics running smoothly.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {Services[0].map((service, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: i * 0.2 }}
    >
      <ServiceCard
        SvgIcon={service.icon}
        num={service.num}
        Img={service.img}
        title={service.title}
        par={service.des}
        link={service.link}
      />
    </motion.div>
  ))}
</div>
      </div>
    </div>
  );
};

export default Services;

import React from "react";
import { NavLink } from "react-router-dom";
import {
  TruckIcon,
  HeartIcon,
  GlobeAltIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from "@heroicons/react/16/solid";
import QualityCard from "../QualityCard";

const WhyPeopleChooseUs = () => {
  const qualities = [
    {
      icon: TruckIcon,
      title: "Fast Delivery",
      par: "Quick and secure delivery of gaming consoles, electronics, and machines right to your doorstep.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: HeartIcon,
      title: "Expert Care",
      par: "Professional repair services for all electronic devices with genuine care and attention to detail.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: GlobeAltIcon,
      title: "Wide Selection",
      par: "Extensive range of PlayStation devices, gaming accessories, and electronic equipment from top brands.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: ClipboardDocumentIcon,
      title: "Quality Guarantee",
      par: "All products and repair services come with warranty and guarantee for your complete peace of mind.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: ClockIcon,
      title: "Quick Service",
      par: "Fast repair turnaround times and efficient service - we get your devices back to you quickly.",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: UserGroupIcon,
      title: "Customer Support",
      par: "Dedicated technical support and customer service team to help you with all your electronic needs.",
      color: "from-teal-500 to-cyan-500"
    },
  ];

  return (
    <div className="py-20 px-2 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-9xl mx-auto -mt-20">
        {/* Main Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="space-y-4">
                <span className="inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                  Why Choose Kalinga Tech
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Your Trusted Electronics
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                    & Gaming Hub
                  </span>
                </h1>
                <p className="text-gray-300 text-lg max-w-2xl">
                  Discover why gamers and tech enthusiasts choose Kalinga Tech for PlayStation devices, electronics, and expert repair services
                </p>
              </div>
              <NavLink
                to="/about"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View More
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </NavLink>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qualities.map((quality, i) => (
                <QualityCard
                  key={i}
                  SvgIcon={quality.icon}
                  title={quality.title}
                  des={quality.par}
                  color={quality.color}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl font-bold text-blue-600 mb-2">2500+</div>
            <div className="text-gray-600 font-medium">Devices Sold</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-gray-600 font-medium">Repair Success Rate</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Tech Support</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl font-bold text-orange-600 mb-2">8+</div>
            <div className="text-gray-600 font-medium">Years Experience</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyPeopleChooseUs;
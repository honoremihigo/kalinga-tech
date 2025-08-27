import React from "react";
import Collaborators from "../components/index/Collaborators.jsx";
import Blog from "../components/blog-card/Blog.jsx";
import AboutUsImage from "../assets/static/about2.jpg";
import AboutUsImage1 from "../assets/images/casestudy/image1.jpg";
import { aboutUsText, powerPatnersData } from "../staticData/data.js";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import WhyPeopleChooseUs from "../components/index/WhyPeopleChooseUs.jsx";
import ReviewsSection from "../components/ReviewsSection.jsx";
import { useEffect } from "react";
import MapWithRoute from "./MapView.jsx";
import { FaCheckCircle } from 'react-icons/fa';

const AboutUs = () => {
  const items = [
    'Gamers seeking high-performance PlayStation devices',
    'Tech enthusiasts looking for cutting-edge computers',
    'Customers wanting reliable gaming and computing solutions',
    'Individuals interested in the latest PlayStation consoles',
    'Professionals needing powerful computer systems'
  ];
  const navigate = useNavigate();

  // power partners jsx Element 👇
  const powerPatnersElement = powerPatnersData.map((data) => {
    return (
      <div key={data.id} className="flex items-center gap-4">
        <div className="bg-[#47B2E4] w-20 text-white p-4 rounded-full">
          <img src={data.logo} alt="logos " className="w-full" />
        </div>
        <div>
          <h4 className="font-semibold text-xl leading-10 ">{data.title}</h4>
          <p className="text-gray-600 text-sm">{data.description}</p>
        </div>
      </div>
    );
  });

  // each time the url or path change it changes the header name
  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800">
      <Header title="About Us" />

      {/* About Section - Redesigned with Modern Two-Column Layout */}
      <section className="relative py-4 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-hidden rounded-2xl">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            
            {/* Left Section - Content */}
            <div className="lg:w-1/2 w-full space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20 animate-fade-in-up">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Our Story
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-cyan-900 bg-clip-text text-transparent">
                  {aboutUsText.headerTitle}
                </span>
              </h1>

              {/* Description */}
              <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <p className="text-lg text-gray-700 leading-relaxed">
                  At <span className="font-semibold text-blue-600">Kalinga Technology Shop</span>, we are dedicated to fueling your passion for gaming and computing. Specializing exclusively in computers and PlayStation devices, we offer the latest and most reliable products to elevate your gaming and professional experiences.
                </p>
              </div>

              {/* Decorative Line */}
              <div className="flex items-center gap-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                <div className="h-1 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                <div className="h-1 w-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              </div>

              {/* Power Partners */}
              <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {powerPatnersElement.map((partner, index) => (
                    <div 
                      key={index}
                      className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 hover:border-blue-200/50 animate-fade-in-up"
                      style={{animationDelay: `${0.5 + index * 0.1}s`}}
                    >
                      {/* Gradient Border Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                      {partner}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section - Image */}
            <div className="lg:w-[47%] w-full ">
              <div className="relative animate-fade-in-right">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl transform rotate-3 scale-105"></div>
                
                {/* Main Image Container */}
                <div className="relative bg-white/20 backdrop-blur-sm p-3 rounded-3xl shadow-2xl border border-white/30">
                  <img
                    src={AboutUsImage}
                    alt="About Us"
                    className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover rounded-2xl shadow-xl"
                  />
                  
                  {/* Overlay Elements */}
                  <div className="absolute inset-3 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-2xl flex items-center justify-center animate-bounce">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-2xl flex items-center justify-center animate-pulse">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>

                {/* Additional Decorative Elements */}
                <div className="absolute top-1/4 -left-8 w-16 h-16 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-8 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Animations */}
        <style>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in-right {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
            opacity: 0;
          }

          .animate-fade-in-right {
            animation: fade-in-right 0.8s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </section>
    </div>
  );
};

export default AboutUs;
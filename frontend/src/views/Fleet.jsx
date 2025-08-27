import React from 'react';
import { BsPersonStanding } from "react-icons/bs";
import { FaSuitcase } from "react-icons/fa6";
import { FaBriefcase } from "react-icons/fa";
import { Car, Users, Luggage, Package } from "lucide-react";
import { useEffect } from 'react';
import Header from "../components/Header";

import Image1 from '../assets/static/fle1.avif';
import Image2 from '../assets/static/fle2.avif';
import Image3 from '../assets/static/fl4.jpg';
import Image4 from '../assets/static/fle4.jpg';



function Fleet() {
    useEffect(() => {
      document.documentElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
  
        inline: "start",
      });
    }, []);
  const fleetData = [
    {
      title: "Abyride X",
      passengers: 4,
      suitcases: 3,
      smallCases: 3,
      image: Image1,
      description: "Affordable everyday rides for up to 4 people.",
      badge: "Most Popular",
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Comforts",
      passengers: 4,
      suitcases: 3,
      smallCases: 3,
      image: Image2,
      description: "New cars with extra legroom for up to 4 people.",
      badge: "Premium",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "AbyrideXL",
      passengers: 6,
      suitcases: 4,
      smallCases: 4,
      image: Image3,
      description: "Affordable rides for groups of up to 6 people.",
      badge: "Group Friendly",
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Wheelchair Accessible Van ♿",
      passengers: 4,
      suitcases: 2,
      smallCases: 2,
      image: Image4,
      description: "Specially equipped vehicles for wheelchair users.",
      badge: "Accessible",
      color: "from-violet-500 to-indigo-600"
    },
  ];

  return ( 
    <div>
        <Header title="Our fleet" />
    <div className="min-h-screen rounded-2xl bg-gradient-to-br mb-2 from-slate-900 via-slate-800  pt-4 to-slate-900">
      

      {/* Fleet Cards */}
      <div className="px-4 pb-3">
        <div className="max-w-9xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fleetData.map((fleet, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${fleet.color}`}>
                    {fleet.badge}
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={fleet.image}
                    alt={fleet.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {fleet.title}
                  </h3>
                  <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                    {fleet.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    <div className="text-center p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex justify-center mb-1">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-sm font-bold text-white">{fleet.passengers} Passengers</div>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex justify-center mb-1">
                        <Luggage className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-sm font-bold text-white">{fleet.suitcases} Suitcases</div>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex justify-center mb-1">
                        <Package className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="text-sm font-bold text-white">{fleet.smallCases} Small Cases</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${fleet.color} hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1`}>
                    Book Now
                  </button>
                </div>

                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${fleet.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      </div>
    </div>
  );
}

export default Fleet;
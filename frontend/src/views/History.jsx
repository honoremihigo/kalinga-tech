import { useEffect, useState } from "react";
import { ChevronDown, Calendar, MapPin, Users, Globe, Heart } from "lucide-react";
import Header from "../components/Header";

import Image1 from '../assets/static/image4.jpg';
import Image2 from '../assets/sample/right.jpg';
import Image3 from '../assets/static/image8.jpg';


function History() {
  const [activeItem, setActiveItem] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const items = [
    {
      year: "2020",
      title: "Abyride Established",
      subtitle: "From a startup to a vision-driven enterprise",
      description: "Abyride began its journey as a transportation startup in 2020, aiming to revolutionize ridesharing. Our mission was to provide a reliable, safe, and convenient way for people to travel, and we quickly gained trust through our seamless services.",
      icon: MapPin,
      color: "from-blue-500 to-purple-600",
      image: Image1
    },
    {
      year: "2022",
      title: "Expansion into Home Care Services",
      subtitle: "Caring for your loved ones, always",
      description: "In 2022, Abyride expanded into home care services, recognizing the need for trustworthy assistance at home. We launched elderly care, child care, and household cleaning solutions to ease the lives of our customers.",
      icon: Heart,
      color: "from-pink-500 to-rose-600",
      image: Image2
    },
    {
      year: "2023",
      title: "Language Translation Services Launched",
      subtitle: "Breaking barriers through communication",
      description: "In 2023, Abyride introduced language translation services to connect people across cultures and languages. This included written and spoken translations, as well as real-time conversation assistance.",
      icon: Globe,
      color: "from-green-500 to-emerald-600",
      image: Image3
    }
  ];

  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });

    // Animate items on load
    items.forEach((_, index) => {
      setTimeout(() => {
        setIsVisible(prev => ({ ...prev, [index]: true }));
      }, index * 200);
    });
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <Header title="Our History" />
      
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-400 to-blue-400 rounded-full hidden md:block"></div>
          
          {items.map((item, index) => {
            const Icon = item.icon;
            const isLeft = index % 2 === 0;
            
            return (
              <div
                key={index}
                className={`relative flex items-center mb-16 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                } ${isVisible[index] ? 'animate-fade-in' : 'opacity-0'}`}
                style={{
                  animation: isVisible[index] ? `slideIn${isLeft ? 'Left' : 'Right'} 0.8s ease-out` : 'none'
                }}
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-purple-400 flex items-center justify-center z-10 shadow-lg hidden md:flex">
                  <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div 
                    className={`bg-white rounded-2xl shadow-xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      activeItem === index ? 'ring-4 ring-purple-300' : ''
                    }`}
                    onClick={() => setActiveItem(activeItem === index ? -1 : index)}
                  >
                    {/* Year Badge */}
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-bold mb-4 bg-gradient-to-r ${item.color}`}>
                      <Calendar className="w-4 h-4 mr-2" />
                      {item.year}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    
                    {/* Subtitle */}
                    <p className="text-purple-600 font-medium mb-4">
                      {item.subtitle}
                    </p>
                    
                    {/* Image */}
                    <div className="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4 overflow-hidden">
                      <div className={`w-full h-full bg-gradient-to-r ${item.color} opacity-20`}></div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    
                    {/* Expand Button */}
                    <button className="flex items-center text-purple-600 hover:text-purple-800 transition-colors">
                      <span className="mr-2">
                        {activeItem === index ? 'Show less' : 'Learn more'}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeItem === index ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
                
                {/* Mobile Timeline Node */}
                <div className="w-12 h-12 bg-white rounded-full border-4 border-purple-400 flex items-center justify-center shadow-lg md:hidden mb-4">
                  <div className={`w-6 h-6 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
     

      </div>
      
      
    </div>
  );
}

export default History;
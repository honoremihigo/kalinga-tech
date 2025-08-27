import React from 'react';
import { 
  StarIcon, 
  MapPinIcon, 
  ClockIcon, 
  UserIcon, 
  PhoneIcon, 
  HeartIcon,
  ArrowDownTrayIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';
import iosicon from '../../assets/carimages/iosapp-icon.png';
import android from '../../assets/carimages/android.png';
import ipad from '../../assets/carimages/app-screen.png';

function Advertisement() {
  const features = [
    { icon: MapPinIcon, label: 'Book Ride', color: 'from-blue-500 to-cyan-500' },
    { icon: ClockIcon, label: 'Track Driver', color: 'from-green-500 to-emerald-500' },
    { icon: StarIcon, label: 'Share Location', color: 'from-purple-500 to-violet-500' },
    { icon: HeartIcon, label: 'History', color: 'from-pink-500 to-rose-500' },
    { icon: PhoneIcon, label: 'Support', color: 'from-orange-500 to-amber-500' },
    { icon: UserIcon, label: 'Profile', color: 'from-teal-500 to-cyan-500' }
  ];

  return (
    <div className="max-w-9xl mx-auto px-2 py-16">
      {/* Main Container */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#276481] [#293751] to-slate-800 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgydi00aDRWMGgtNHpNNiAzNHYtNEg0djRIMHYyaDR2NGgydi00aDR2LTJINnpNNiA0VjBINHY0SDB2Mmg0djRoMnYtNGg0VjBINnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 lg:p-16">
          
          {/* Left Section */}
          <div className="w-full lg:w-1/2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  ABY RIDE
                </h1>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  Download Our New App Now!
                </h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Experience seamless rides with just a few taps. Your journey starts here.
                </p>
              </div>
            </div>

            {/* Features Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium">{feature.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <ArrowDownTrayIcon className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-semibold">Available on all platforms</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="group cursor-pointer transform hover:scale-105 transition-transform duration-300">
                  <img
                    src={iosicon}
                    alt="Download on App Store"
                    className="h-14 w-auto drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
                  />
                </div>
                <div className="group cursor-pointer transform hover:scale-105 transition-transform duration-300">
                  <img
                    src={android}
                    alt="Get it on Google Play"
                    className="h-14 w-auto drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">50K+</div>
                <div className="text-blue-200 text-sm">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">4.9</div>
                <div className="text-blue-200 text-sm">App Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-blue-200 text-sm">Support</div>
              </div>
            </div>
          </div>

          {/* Right Section - App Screenshot */}
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 scale-110"></div>
              
              {/* Phone mockup */}
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <img
                  src={ipad}
                  alt="ABY RIDE Mobile App"
                  className="w-64 md:w-80 lg:w-96 drop-shadow-2xl"
                />
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <StarIcon className="w-8 h-8 text-white" />
                </div>
                
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                  <MapPinIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Advertisement;
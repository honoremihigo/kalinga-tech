import React from "react";
// Import Swiper core and required modules
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { StarIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Image1 from "../assets/images/review1.jpg";
import Image2 from "../assets/images/review2.jpg";
import Image3 from "../assets/images/review3.jpg";
import Image4 from "../assets/images/review4.webp";

const reviews = [
  {
    image: Image1,
    name: "Ivana Curo",
    title: "Business Client",
    rating: 5,
    review: "Incredibly reliable service with perfect timing. The driver was punctual and professional - exactly what I needed for my early morning pickup.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    image: Image3,
    name: "Steve Hubbs",
    title: "Local Guide",
    rating: 5,
    review: "Outstanding service when I needed it most! Professional, on-time, and great conversation. Clean, spacious ride when other apps failed me.",
    color: "from-purple-500 to-pink-500"
  },
  {
    image: Image2,
    name: "Ben Robeir",
    title: "Local Guide",
    rating: 5,
    review: "This is how taxi service should be done! Great conversations and innovative approach. Puts Lyft and Uber to shame with superior service.",
    color: "from-green-500 to-emerald-500"
  },
  {
    image: Image4,
    name: "Ange Cicero",
    title: "Local Guide",
    rating: 5,
    review: "Dependable and pleasant to work with. When 4 other companies failed to show up, they came through with a polite, reliable driver.",
    color: "from-orange-500 to-red-500"
  },
];

function ReviewsSection() {
  return (
    <section className="py-2 px-2 ">
      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real people who trust us with their transportation needs
          </p>
        </div>

        {/* Swiper Integration */}
        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
          pagination={{ 
            clickable: true,
            bulletActiveClass: 'swiper-pagination-bullet-active bg-blue-500',
            bulletClass: 'swiper-pagination-bullet bg-gray-300'
          }}
          loop
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="pb-12"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="group relative">
                {/* Main Card */}
                <div className="bg-white rounded-2xl p-6  transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  
                  {/* Quote Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-r ${review.color} rounded-full flex items-center justify-center mb-4`}>
                    <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-gray-700 text-base leading-relaxed mb-6 ">
                    {review.review}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  
                  {/* Author Info */}
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r ${review.color} rounded-full border-2 border-white flex items-center justify-center`}>
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {review.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {review.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}

export default ReviewsSection;
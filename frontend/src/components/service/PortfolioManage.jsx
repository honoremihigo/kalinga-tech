import React from "react";
import Picture from "../../assets/images/ab1.jpg";
import hiringPicture from "../../assets/images/slide/slide2.webp";
import { CheckIcon } from "@heroicons/react/20/solid";

const PortfolioManage = () => {
  return (
    <div className="sm:w-5/6 w-full md:w-5/4 flex flex-col gap-6">
      {/* Image Section */}
      <img
        src={hiringPicture}
        className="rounded-xl h-[450px] object-cover"
        alt="Transportation service visual"
      />

      {/* Introduction */}
      <em className="text-gray-500 pr-10 font-normal text-justify">
        Discover stress-free transportation with AbyRide, where your comfort and
        convenience are our top priority. Whether you book a ride through our
        app, website, or by phone, we've got you covered—no matter the
        situation.
      </em>

      <div className="flex flex-col md:flex-row gap-6 w-full p-6 bg-gray-100">
        {/* Card 1 */}
        <div className="flex flex-col bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full md:w-1/2">
          <h1 className="capitalize font-semibold text-3xl lg:text-4xl xl:text-4xl pt-3 mb-4">
            Your Comfort, Our Priority
          </h1>
          <p className="text-gray-600 pr-10 font-normal text-justify leading-loose">
            Our mission is to provide a seamless transportation experience
            tailored to your needs. Whether you're commuting to work, heading
            out for a night, or traveling to the airport, AbyRide is designed to
            give you peace of mind. Don’t worry about transportation logistics;
            we’ve got it covered.
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full md:w-1/2">
          <h1 className="capitalize font-semibold text-3xl lg:text-4xl xl:text-2xl mb-2 pt-3">
            Book Rides Effortlessly with AbyRide
          </h1>
          <p className="text-gray-600 pr-10 font-normal text-justify mb-2">
            At AbyRide, we make transportation simple and reliable. Using our
            website or mobile application, you can easily:
          </p>
          <ul className="list-disc pl-5">
            <li>Book rides to your desired destinations quickly.</li>
            <li>Choose your favorite driver for a personalized experience.</li>
            <li>Find nearby drivers to minimize wait times.</li>
            <li>Call us directly to arrange transportation whenever needed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PortfolioManage;

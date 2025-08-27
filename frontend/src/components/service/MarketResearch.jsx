import React from "react";
import Picture from "../../assets/images/slide/slide23.png";
import hiringPicture from "../../assets/images/slide/slide21.jpg";
import { CheckIcon } from "@heroicons/react/20/solid";

const MarketResearch = () => {
  return (
    <div className="sm:w-5/6 w-full md:w-5/4 flex flex-col gap-6">
      <img
        src={Picture}
        className="rounded-xl h-[450px] object-cover"
        alt="Gaming Devices by Kalinga Tech"
      />{" "}
      <em className="text-gray-500 pr-10 font-normal text-justify">
        {" "}
        At Kalinga Tech, we believe gaming is more than just entertainment—it’s
        an experience. That’s why we provide the latest gaming devices and
        accessories designed to deliver power, performance, and immersive
        gameplay for casual players and hardcore gamers alike.{" "}
      </em>
      <div className="flex flex-col md:flex-row gap-6 w-full p-6 bg-gray-100">
        <div className="flex flex-col bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full md:w-1/2">
          <h1 className="capitalize font-semibold text-3xl lg:text-4xl xl:text-4xl pt-3 mb-4">
            Next-Level Gaming Experience
          </h1>{" "}
          <p className="text-gray-600 pr-10 font-normal text-justify leading-loose">
            {" "}
            From high-performance consoles and gaming laptops to controllers,
            VR headsets, and accessories, our product range covers everything a
            gamer needs. Whether you’re into competitive eSports, immersive
            open-world adventures, or casual gaming, Kalinga Tech delivers
            devices built for speed, graphics, and durability. Our goal is to
            ensure you stay ahead of the game with cutting-edge technology and
            unbeatable reliability.{" "}
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full md:w-1/2">
          <h1 className="capitalize font-semibold text-3xl lg:text-4xl xl:text-2xl mb-2 pt-3">
            Why Choose Gaming Devices from Kalinga Tech?
          </h1>
          <p className="text-gray-600 pr-10 font-normal text-justify leading-loose">
            {" "}
            We are dedicated to providing gamers with the tools they need for an
            unforgettable experience. By choosing Kalinga Tech, you’ll benefit
            from:{" "}
            <ul className="list-disc ml-6">
              {" "}
              <li>
                A wide selection of gaming consoles, laptops, and accessories.
              </li>{" "}
              <li>
                Devices optimized for performance, speed, and stunning graphics.
              </li>{" "}
              <li>
                Affordable pricing and packages for every type of gamer.
              </li>{" "}
              <li>
                Expert support and guidance to help you choose the right device.
              </li>{" "}
            </ul>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketResearch;

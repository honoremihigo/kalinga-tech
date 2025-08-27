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
        alt="Language Translation Services"
      />{" "}
      <em className="text-gray-500 pr-10 font-normal text-justify">
        {" "}
        In a world that’s increasingly connected, bridging language gaps has
        never been more critical. At Abyride, we provide professional language
        translation services that empower businesses and individuals to
        communicate effectively across borders.{" "}
      </em>
      <div className="flex flex-col md:flex-row gap-6 w-full p-6 bg-gray-100">
        <div className="flex flex-col bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full md:w-1/2">
          <h1 className="capitalize font-semibold text-3xl lg:text-4xl xl:text-4xl pt-3 mb-4">
            Breaking Barriers, Building Connections
          </h1>{" "}
          <p className="text-gray-600 pr-10 font-normal text-justify leading-loose">
            {" "}
            Our translation services cover a wide array of industries and
            languages, ensuring your message resonates with your target
            audience. Whether you need document translation, website
            localization, or real-time interpretation, we have the expertise to
            meet your needs. From legal and technical translations to creative
            and cultural adaptations, we deliver precise and culturally
            sensitive translations every time.{" "}
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full md:w-1/2">
          <h1 className="capitalize font-semibold text-3xl lg:text-4xl xl:text-2xl mb-2 pt-3">
            Why Choose Our Translation Services?
          </h1>
          <p className="text-gray-600 pr-10 font-normal text-justify leading-loose">
            {" "}
            At Abyride, we are committed to accuracy, efficiency, and
            confidentiality. Here’s why we stand out:{" "}
            <ul className="list-disc ml-6">
              {" "}
              <li>
                Experienced translators fluent in over 100 languages.
              </li>{" "}
              <li>Specialized industry knowledge for accurate context.</li>{" "}
              <li>Fast turnaround times without compromising quality.</li>{" "}
              <li>Secure handling of sensitive documents.</li>{" "}
            </ul>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketResearch;

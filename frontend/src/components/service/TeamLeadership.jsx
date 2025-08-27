import React from "react";
import Picture from "../../assets/images/slide/slide2.jpg";
import hiringPicture from "../../assets/images/service/strategicPlanning1.jpg";
import { CheckIcon } from "@heroicons/react/20/solid";

const TeamLeadership = () => {
  return (
    <div className="sm:w-5/6 w-full md:w-5/4 flex flex-col gap-6">
      {" "}
      <img
        src={Picture}
        className="rounded-xl h-[450px] object-cover"
        alt="Home Care Services"
      />{" "}
      <em className="text-gray-500 pr-10 font-normal text-justify">
        {" "}
        At Abyride , we understand the importance of comfort and care in the
        place you call home. Our dedicated home care services are designed to
        provide you and your loved ones with the support you need, whenever you
        need it.{" "}
      </em>{" "}
      <div className="flex flex-col md:flex-row gap-6 w-full p-6 bg-gray-100">
        {/* Card 1 */}
        <div className="flex flex-col bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full md:w-1/2">
          <h1 className="capitalize font-semibold text-3xl lg:text-4xl xl:text-4xl pt-3 mb-4">
            Personalized Care, Tailored for You
          </h1>
          <p className="text-gray-600 pr-10 font-normal text-justify leading-loose">
            Our team offers a wide range of home care solutions, including
            assistance with daily living activities, companionship, medication
            reminders, and specialized care for individuals with chronic
            conditions. We take the time to understand your unique needs and
            preferences, ensuring our services are as personalized as possible.
            Whether you need short-term support or ongoing care, we are here to
            help.{" "}
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full md:w-1/2">
          <h1 className="capitalize font-semibold text-3xl lg:text-4xl xl:text-2xl mb-2 pt-3">
            Why Choose Our Home Care Services?
          </h1>
          <p className="text-gray-600 pr-10 font-normal text-justify leading-loose">
            Our mission is to provide peace of mind and exceptional care for you
            and your family. By choosing us, you’ll benefit from:{" "}
            <ul className="list-disc ml-6">
              {" "}
              <li>
                Compassionate caregivers who are fully trained and experienced.
              </li>{" "}
              <li>Flexible scheduling options to suit your lifestyle.</li>{" "}
              <li>Customizable care plans that adapt to your needs.</li>{" "}
              <li>Support that promotes independence and dignity.</li>{" "}
            </ul>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamLeadership;

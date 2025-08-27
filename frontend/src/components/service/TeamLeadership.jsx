import React from "react";
import Picture from "../../assets/static/contact.jpeg";
import hiringPicture from "../../assets/images/service/strategicPlanning1.jpg";
import { CheckIcon } from "@heroicons/react/20/solid";

const TeamLeadership = () => {
  return (
    <div className="sm:w-5/6 w-full md:w-5/4 flex flex-col gap-6">
      {" "}
      <img
        src={Picture}
        className="rounded-xl h-[450px] object-cover"
        alt="Kalinga Tech"
      />{" "}
      <em className="text-gray-500 pr-10 font-normal text-justify">
        {" "}
        At Kalinga Tech, we are committed to driving innovation and delivering
        technology solutions that empower businesses and individuals. Our goal
        is to make advanced technology accessible, reliable, and impactful in
        everyday life.{" "}
      </em>{" "}
      <div className="flex flex-col md:flex-row gap-6 w-full p-6 bg-gray-100">
        {/* Card 1 */}
        <div className="flex flex-col bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full md:w-1/2">
          <h1 className="capitalize font-semibold text-3xl lg:text-4xl xl:text-4xl pt-3 mb-4">
            Innovative Solutions, Designed for You
          </h1>
          <p className="text-gray-600 pr-10 font-normal text-justify leading-loose">
            From cutting-edge electronics to software development and IT
            services, Kalinga Tech provides a wide range of technology-driven
            solutions. We take time to understand your specific needs and
            deliver products and services that align with your goals. Whether
            you’re an individual, startup, or enterprise, we are here to support
            your growth through technology.{" "}
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full md:w-1/2">
          <h1 className="capitalize font-semibold text-3xl lg:text-4xl xl:text-2xl mb-2 pt-3">
            Why Choose Kalinga Tech?
          </h1>
          <p className="text-gray-600 pr-10 font-normal text-justify leading-loose">
            Our mission is to bring innovation closer to you while maintaining
            quality and trust. By choosing Kalinga Tech, you’ll benefit from:{" "}
            <ul className="list-disc ml-6">
              {" "}
              <li>
                A passionate team of experts with experience in multiple tech
                fields.
              </li>{" "}
              <li>Flexible solutions tailored to your unique requirements.</li>{" "}
              <li>
                Products and services that combine innovation with reliability.
              </li>{" "}
              <li>
                Long-term support and commitment to customer satisfaction.
              </li>{" "}
            </ul>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamLeadership;

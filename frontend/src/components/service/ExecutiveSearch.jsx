import React from "react";
import hiringPicture from "../../assets/images/service/strategicPlanning1.jpg";
import {
  BanknotesIcon,
  CheckIcon,
  KeyIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";
import { ChartBarIcon } from "@heroicons/react/24/solid";

const ExecutiveSearch = () => {
  return (
    <div className="sm:w-5/6 w-full md:w-5/4 flex flex-col gap-6">
      {" "}
      <img
        src={hiringPicture}
        className="rounded-xl h-[450px] object-cover"
        alt="Dépannage Services"
      />{" "}
      <em className="text-gray-500 pr-10 font-normal text-justify">
        Unexpected breakdowns and technical issues can disrupt your day, but
        with our professional dépannage services, you’re never alone. At [Your
        Company Name], we provide reliable repair and troubleshooting solutions
        to get you back on track quickly and efficiently.{" "}
      </em>
      <div className="flex flex-col md:flex-row gap-6 w-full p-6 bg-gray-100">
        {/* Card 1 */}
        <div className="flex flex-col bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full md:w-1/2">
          <h1 className="capitalize font-semibold text-3xl lg:text-4xl xl:text-4xl pt-3 mb-4">
            Rapid Assistance, Anytime You Need
          </h1>
          <p className="text-gray-600 pr-10 font-normal text-justify leading-loose">
            Our team of experts is equipped to handle a wide range of dépannage
            needs, whether it’s for your home, vehicle, or electronic devices.
            From minor repairs to complex issues, we ensure swift and effective
            solutions tailored to your situation. Our goal is to minimize
            inconvenience and restore normalcy in no time.
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-full md:w-1/2">
          <h1 className="capitalize font-semibold text-3xl lg:text-4xl xl:text-2xl mb-2 pt-3">
            Why Choose Our Dépannage Services?
          </h1>
          <p className="text-gray-600 pr-10 font-normal text-justify leading-loose">
            We understand the urgency of repair and maintenance tasks, which is
            why our dépannage services are designed with your convenience in
            mind. Here’s what sets us apart:
          </p>
          <ul className="list-disc ml-6 text-gray-600">
            <li>24/7 availability for emergencies and urgent repairs.</li>
            <li>
              Highly trained professionals with expertise in multiple domains.
            </li>
            <li>Transparent pricing with no hidden fees.</li>
            <li>Commitment to quality and customer satisfaction.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default ExecutiveSearch;

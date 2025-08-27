import React from "react";
import Picture from "../../assets/images/service/strategicPlanning.jpg";
import hiringPicture from "../../assets/images/service/strategicPlanning1.jpg";
import {
  BanknotesIcon,
  CheckIcon,
  KeyIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";
import { ChartBarIcon } from "@heroicons/react/24/solid";

const StrategicPlanning = () => {
  return (
    <div className="sm:w-5/6 w-full md:w-3/4 flex flex-col  gap-6">
      <img src={Picture} className="w-full rounded-xl  " alt="" />

      <em className="text-gray-500">
        Morbi porta dolor quis sem ultricies maximus. Nunc accumsan dui vel
        lobortis pulvinar. Duis convallis odio ut dignissim faucibus. Sed sit
        amet urna dictum, interdum justo sed, lacinia dolor. Phasellus finibus
        nunc id tellus mollis consequat. Maecenas ornare aliquet vestibulum.
        Integer leo magna, viverra a imperdiet id, vehicula non mi. Vestibulum
        nec arcu dolor.
      </em>

      <h1 className="capitalize font-semibold text-xl lg:text-2xl xl:text-3xl  pt-3">
        Ready to Hire your Next Candidate
      </h1>
      <p className="text-gray-600">
        Nunc accumsan dui vel lobortis pulvinar. Duis convallis odio ut
        dignissim faucibus. Sed sit amet urna dictum, interdum justo sed,
        lacinia dolor. Phasellus finibus nunc id tellus mollis consequat.
        Maecenas ornare aliquet vestibulum.
      </p>
      <div className="flex w-full gap-2 items-center flex-wrap justify-start">
        <div className="w-full md:w-5/12 flex items-start gap-2 justify-center flex-col">
          <div className="bg-primary p-3 rounded-xl sm:rounded-full">
            <UsersIcon className="w-7 h-7 md:w-8 md:h-8 fill-white" />
          </div>
          <h1 className="font-medium text-lg md:text-xl ">Best Consulting</h1>
          <p className=" text-gray-600">
            {" "}
            Vestibulum morbi blandit cursus risus. Augue neque gravida.
          </p>
        </div>
        <div className="w-full md:w-5/12 flex items-start gap-2 justify-center flex-col">
          <div className="bg-primary p-3 rounded-xl sm:rounded-full">
            <KeyIcon className="w-7 h-7 fill-white  md:w-8 md:h-8" />
          </div>
          <h1 className="font-medium text-lg md:text-xl ">Accurate Data</h1>
          <p className=" text-gray-600">
            {" "}
            Vestibulum morbi blandit cursus risus. Augue neque gravida.
          </p>
        </div>
        <div className="w-full md:w-5/12 flex items-start gap-2 justify-center flex-col">
          <div className="bg-primary p-3 rounded-xl sm:rounded-full">
            <ChartBarIcon className="w-7 h-7 fill-white  md:w-8 md:h-8" />
          </div>
          <h1 className="font-medium text-lg md:text-xl ">Marketing Growth</h1>
          <p className=" text-gray-600">
            {" "}
            Vestibulum morbi blandit cursus risus. Augue neque gravida.
          </p>
        </div>
        <div className="w-full md:w-5/12 flex items-start gap-2 justify-center flex-col">
          <div className="bg-primary p-3 rounded-xl sm:rounded-full">
            <BanknotesIcon className="w-7 h-7 fill-white  md:w-8 md:h-8" />
          </div>
          <h1 className="font-medium text-lg md:text-xl ">Marketing Growth</h1>
          <p className=" text-gray-600">
            {" "}
            Vestibulum morbi blandit cursus risus. Augue neque gravida.
          </p>
        </div>
      </div>

      <h1 className="capitalize font-semibold  text-xl lg:text-2xl xl:text-3xl  pt-3">
        Outsourced Hiring & Job Rules Services
      </h1>
      <p className="text-gray-600">
        Morbi porta dolor quis sem ultricies maximus. Nunc accumsan dui vel
        lobortis pulvinar. Duis convallis odio ut dignissim faucibus. Sed sit
        amet urna dictum, interdum justo sed, lacinia dolor. Phasellus finibus
        nunc id tellus mollis consequat. Maecenas ornare aliquet vestibulum.
        Integer leo magna, viverra a imperdiet id, vehicula non mi. Vestibulum
        nec arcu dolor.
      </p>

      <div className="flex items-start flex-col lg:flex-row py-3 pb-5 justify-between gap-4">
        <img
          src={hiringPicture}
          className="w-full lg:w-1/2 lg:h-[60vh] xl:h-auto object-cover rounded-xl"
          alt=""
        />
        <div className="w-full lg:w-1/2  flex flex-col gap-4">
          <h1 className="capitalize font-semibold text-xl lg:text-2xl xl:text-3xl pt-3">
            Our Best Consultants
          </h1>
          <p className="text-gray-500 ">
            Vestibulum morbi blandit cursus risus. Augue neque gravida in
            fermentum et sollicitudin.
          </p>

          <div className="flex items-center gap-2 justify-start">
            <CheckIcon className="w-7 h-7 fill-teal-800" />{" "}
            <p className="text-gray-500 ">
              {" "}
              Nunc accumsan dui vel lobortis pulvinar.
            </p>
          </div>

          <div className="flex items-center gap-2 justify-start">
            <CheckIcon className="w-7 h-7 fill-teal-800" />{" "}
            <p className="text-gray-500 ">
              {" "}
              Maecenas ornare aliquet vestibulum.
            </p>
          </div>

          <div className="flex items-center gap-2 justify-start">
            <CheckIcon className="w-7 h-7 fill-teal-800" />{" "}
            <p className="text-gray-500 ">
              Vehicula non mi. Vestibulum nec arcu dolor.
            </p>
          </div>
          <div className="flex items-center gap-2 justify-start">
            <CheckIcon className="w-7 h-7 fill-teal-800" />{" "}
            <p className="text-gray-500 ">
              {" "}
              Sed sit amet urna dictum, interdum justo sed.
            </p>
          </div>
          <div className="flex items-center gap-2 justify-start">
            <CheckIcon className="w-7 h-7 fill-teal-800" />{" "}
            <p className="text-gray-500 ">
              {" "}
              Duis convallis odio ut dignissim faucibus.
            </p>
          </div>

          <div className="flex items-center gap-2 justify-start">
            <CheckIcon className="w-7 h-7 fill-teal-800" />{" "}
            <p className="text-gray-500 ">
              {" "}
              Phasellus finibus nunc id tellus mollis consequat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicPlanning;

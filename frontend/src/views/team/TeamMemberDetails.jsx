import React, { useContext, useEffect, useState } from "react";
import Headerz from "../../components/Header";
import { useParams } from "react-router-dom";
import { TeamDataContext } from "../../contexts/TeamDataContext";
import WhatsAppIcon from "../../widgets/WhatsApp";
import TwitterIcon from "../../widgets/TwitterIcon";
import InstagramIcon from "../../widgets/InstagramIcon";
import Progress from "../../components/Progress";
import { CheckIcon } from "@heroicons/react/20/solid";

import toast from "react-hot-toast";
import emailjs from "emailjs-com";

const TeamMemberDetails = () => {
  const inputstyles =
    "w-full sm:w-1/2 p-4 bg-teal-800 border border-teal-700 outline-none placeholder:text-white placeholder:capitalize text-white rounded-full";
  const { id } = useParams();
  const { findMember } = useContext(TeamDataContext);
  const member = findMember(id);

  const titles = [
    { name: "Portfolio Manage", to: "portfolio-management" },
    { name: "Team Leadership", to: "team-leadership" },
    { name: "Market Research", to: "market-research" },
    { name: "Executive Search", to: "executive-search" },
    { name: "Strategic Planning", to: "strategic-planning" },
  ];
  useEffect(() => {
    document.body.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  const [values, setValues] = useState({
    username: "",
    email: "",
    service: "",
    address: "",
    message: "",
  });

  const handleValues = (e) => {
    setValues((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      toast.loading("sending the message....", { id: "loading" });

      // Send the form data using emailjs
      const emailjsSync = await emailjs.sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        e.target, // Use the form element
        import.meta.env.VITE_PUBLIC_KEY,
      );

      // Clear the form after successful submission
      e.target.reset();

      toast.success("successfully sent the message", { id: "loading" });
    } catch (error) {
      toast.error("failed to send the message", { id: "loading" });
      console.error("Something went wrong while sending the message:", error);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full">
      <Headerz title={member.username} />
      <div className="flex py-14 md:w-11/12 flex-col xl:flex-row justify-center xl:justify-start gap-5 items-center xl:items-start ">
        {/* card  */}
        <div className=" w-full  sm:w-3/4  lg:w-2/4 xl:w-1/4 h-[70vh] relative">
          {/* upper part */}

          <div className="w-full h-1/2  overflow-hidden rounded-t-2xl">
            <img
              src={member.img}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>

          {/* lower part */}
          <div className="w-full h-1/2 p-5 text-white gap-2 overflow-hidden flex flex-col bottom-3 absolute bg-teal-800 rounded-2xl">
            <div className="flex flex-col gap-0.5">
              <label htmlFor="" className="text-xl font-medium capitalize">
                Phone:
              </label>
              <span className="text-md capitalize">{member.phone}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <label htmlFor="" className="text-xl font-medium capitalize">
                email:
              </label>
              <span className="text-md ">{member.email}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <label htmlFor="" className="text-xl font-medium capitalize">
                specialist:
              </label>
              <span className="text-md capitalize">{member.specialist}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <label htmlFor="" className="text-xl font-medium capitalize">
                experience:
              </label>
              <span className="text-md capitalize">+{member.experience}</span>
            </div>

            <div className="flex items-center fill-white gap-2 justify-start pl-2 pt-5">
              <InstagramIcon className="w-5 h-5" />
              <WhatsAppIcon className="w-5 h-5" />
              <TwitterIcon className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full gap-5 md:w-5/6   lg:w-4/5 xl:w-3/4 ">
          <h1 className="font-bold md:font-semibold text-xl lg:text-2xl xl:text-3xl">
            Professional Skills
          </h1>
          <p className=" text-gray-600">
            Morbi porta dolor quis sem ultricies maximus. Nunc accumsan dui vel
            lobortis pulvinar. Duis convallis odio ut dignissim faucibus. Sed
            sit amet urna dictum, interdum justo sed, lacinia dolor. Phasellus
            finibus nunc id tellus mollis consequat. Maecenas ornare aliquet
            vestibulum. Integer leo magna, viverra a imperdiet id, vehicula non
            mi. Vestibulum nec arcu dolor.
          </p>

          <div className="flex items-center gap-5  justify-around w-full flex-col xl:flex-row">
            <div className="flex w-full md:w-4/5 xl:w-1/3 flex-col gap-2">
              <div className="flex w-full  items-center justify-between">
                <h1 className="text-lg font-medium uppercase">
                  Direct Marketing
                </h1>

                <p>{member.skills.market}</p>
              </div>
              <Progress width={member.skills.market} />
            </div>
            <div className="flex w-full md:w-4/5 xl:w-1/3 flex-col gap-2">
              <div className="flex  w-full items-center justify-between">
                <h1 className="text-lg font-medium  uppercase">
                  Research Strateg
                </h1>

                <p>{member.skills.research}</p>
              </div>
              <Progress width={member.skills.research} />
            </div>
            <div className="flex w-full md:w-4/5 xl:w-1/3 flex-col gap-2">
              <div className="flex  w-full items-center justify-between">
                <h1 className="text-lg font-medium  uppercase">
                  Satisfied Partners
                </h1>

                <p>{member.skills.partners}</p>
              </div>
              <Progress width={member.skills.partners} />
            </div>
          </div>
          <h1 className=" font-bold md:font-semibold text-xl lg:text-2xl xl:text-3xl pt-5 xl:pt-10">
            Awards & Experience
          </h1>

          <p className=" text-gray-600">
            Nunc accumsan dui vel lobortis pulvinar. Duis convallis odio ut
            dignissim faucibus. Sed sit amet urna dictum, interdum justo sed,
            lacinia dolor. Phasellus finibus nunc id tellus mollis consequat.
            Maecenas ornare aliquet vestibulum.
          </p>

          <div className="flex flex-wrap gap-8 md:gap-5 items-center justify-center  w-full">
            <div className="flex flex-col gap-3 flex-auto capitalize w-full md:w-6/12 xl:w-5/12">
              <span className="text-gray-500">2021</span>
              <h1 className="text-xl md:text-2xl font-medium pb-3 border-b text-gray-600 border-gray-300 ">
                compensation consulting
              </h1>
              <p className=" text-gray-600">
                Nunc accumsan dui vel lobortis pulvinar. Duis convallis odio ut
                dignissim faucibus. Sed sit amet urna dictum.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-auto capitalize w-full md:w-6/12 xl:w-5/12">
              <span className="text-gray-500">2022</span>
              <h1 className="text-xl md:text-2xl font-medium pb-3 border-b text-gray-600 border-gray-300 ">
                amazing results , every time
              </h1>
              <p className=" text-gray-600">
                Nunc accumsan dui vel lobortis pulvinar. Duis convallis odio ut
                dignissim faucibus. Sed sit amet urna dictum.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-auto capitalize w-full md:w-6/12 xl:w-5/12">
              <span className="text-gray-500">2023</span>
              <h1 className="text-xl md:text-2xl font-medium pb-3 border-b text-gray-600 border-gray-300 ">
                team leadership
              </h1>
              <p className=" text-gray-600">
                Nunc accumsan dui vel lobortis pulvinar. Duis convallis odio ut
                dignissim faucibus. Sed sit amet urna dictum.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-auto capitalize w-full md:w-6/12 xl:w-5/12">
              <span className="text-gray-500">2024</span>
              <h1 className="text-xl md:text-2xl font-medium pb-3 border-b text-gray-600 border-gray-300 ">
                interntional standards
              </h1>
              <p className=" text-gray-600">
                Nunc accumsan dui vel lobortis pulvinar. Duis convallis odio ut
                dignissim faucibus. Sed sit amet urna dictum.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-11/12  flex flex-col gap-4">
            <h1 className="font-bold md:font-semibold capitalize text-xl lg:text-2xl xl:text-3xl">
              career guidelines
            </h1>

            <p className=" text-gray-600">
              Morbi porta dolor quis sem ultricies maximus. Nunc accumsan dui
              vel lobortis pulvinar. Duis convallis odio ut dignissim faucibus.
              Sed sit amet urna dictum, interdum justo sed, lacinia dolor.
              Phasellus finibus nunc id tellus mollis consequat. Maecenas ornare
              aliquet vestibulum. Integer leo magna, viverra a imperdiet id,
              vehicula non mi. Vestibulum nec arcu dolor.
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
          </div>
          <div className="bg-teal-900 flex flex-col xl:min-h-96 gap-6 w-full rounded-2xl  p-4 sm:p-10 ">
            <h1 className="font-semibold text-2xl md:text-3xl text-white">
              Get Free Consulting
            </h1>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col  w-full gap-4"
            >
              <div className="flex justify-between flex-col sm:flex-row items-start gap-4 sm:gap-2  w-full">
                <input
                  type="text"
                  name="username"
                  className={inputstyles}
                  placeholder="your name"
                  onChange={handleValues}
                  required
                />
                <input
                  type="email"
                  name="email"
                  className={inputstyles}
                  placeholder="your email"
                  onChange={handleValues}
                  required
                />
              </div>
              <div className="flex justify-between  flex-col sm:flex-row  items-start gap-4 sm:gap-2  w-full">
                <input
                  type="text"
                  name="sendto"
                  value={member.email}
                  placeholder="your address"
                  required
                  hidden
                />
                <input
                  type="text"
                  name="address"
                  className={inputstyles}
                  placeholder="your address"
                  onChange={handleValues}
                  required
                />
                <select
                  name="service"
                  className={inputstyles}
                  id=""
                  onChange={handleValues}
                  required
                >
                  <option
                    className="bg-white text-black capitalize"
                    selected={true}
                    disabled={true}
                    value=""
                  >
                    Select Services
                  </option>
                  {titles.map((title, key) => (
                    <option
                      className="bg-white text-black capitalize"
                      key={key}
                      value={title.name}
                    >
                      {title.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between  flex-col items-center gap-4 sm:gap-2 w-full">
                <textarea
                  type="text"
                  className={
                    "w-[99%]  p-4 bg-teal-800 border border-teal-700 outline-none placeholder:text-white h-40 placeholder:capitalize text-white rounded-xl"
                  }
                  placeholder="your message"
                  name="message"
                  onChange={handleValues}
                  required
                ></textarea>
                <p className=" w-full sm:w-1/2 text-center text-white">
                  Submit this information and we will send you the cost for the
                  service.
                </p>
              </div>

              <button className="p-4 bg-white uppercase  rounded-md w-full md:w-1/3">
                send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDetails;

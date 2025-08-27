import Header from "../components/Header";
import { useEffect } from "react";
import {
  FaWhatsapp,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
} from "react-icons/fa";

import image1 from "../assets/images/sadiki.jpg";
import image2 from "../assets/images/md.jpg";

function Team() {
  const teamMembers = [
    {
      id: 1,
      username: "Sadiki Rukara ",
      role: "C.E.O",

      img: image1,
      social: {
        Whatsapp: "+1 (616) 633 7026",
        Envelope: "abyridellc@gmail.com",
      },
    },
    {
      id: 2,
      username: " Luciene umutesi",
      role: "M.D",

      img: image2,
      social: {
        Whatsapp: "+1 (616) 633 7026",
        Envelope: "luciene@abyride.com",
      },
    },
  ];

  // each time the url or path change it changes the header name
  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",

      inline: "start",
    });
  }, []);
  return (
    <div>
      <Header title="Team Member" />

      <div className="flex flex-col items-center justify-center w-full bg-gray-100 py-16 mb-4 rounded-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Meet Our Team</h1>
        <div className="  block  md:flex justify-center  mb-8 gap-8 w-11/12 ">
          {teamMembers.map((member, key) => (
            <div
              key={key}
              className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col items-center text-center mb-4"
            >
              {/* Profile Image */}
              <img
                src={member.img}
                alt={`${member.username}'s profile`}
                className="w-[500px] h-[480px] object-cover rounded-lg  mb-4"
              />
              {/* Name and Role */}
              <h2 className="text-lg font-semibold text-gray-800 capitalize">
                {member.username}
              </h2>
              <p className="text-sm text-gray-500 uppercase mb-4">
                {member.role}
              </p>
              {/* Social Media Links */}
              <div className="flex gap-3">
                <a
                  href={member.social.Whatsapp}
                  className="p-2 bg-gray-200 hover:bg-green-500 rounded-full transition-all duration-300"
                  title="WhatsApp"
                >
                  <FaWhatsapp className="w-4 h-4 text-gray-600 hover:text-white" />
                </a>
                <a
                  href={member.social.Envelope}
                  className="p-2 bg-gray-200 hover:bg-blue-400 rounded-full transition-all duration-300"
                  title="Twitter"
                >
                  <FaEnvelope className="w-4 h-4 text-gray-600 hover:text-white" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Team;

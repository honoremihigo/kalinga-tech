import React, { useContext } from "react";
import Headerz from "../../components/Header";
import { TeamDataContext } from "../../contexts/TeamDataContext";
import WhatsAppIcon from "../../widgets/WhatsApp";
import TwitterIcon from "../../widgets/TwitterIcon";
import InstagramIcon from "../../widgets/InstagramIcon";
import { Link } from "react-router-dom";

const TeamMembers = () => {
  const { teamMembers } = useContext(TeamDataContext);
  return (
    <div className="flex justify-center items-center flex-col w-full">
      <Headerz title={"team members"} />
      <div className="flex py-14 w-full justify-center gap-5 items-center flex-wrap">
        {teamMembers.map((member, key) => (
          <div
            key={key}
            className="flex-auto xl:flex-initial w-full gap-2 flex-col md:w-1/3  lg:w-1/4 xl:w-1/5 bg-gray-200 p-10   rounded-xl flex justify-center items-center"
          >
            <img
              src={member.img}
              className="w-2/3  object-cover rounded-full aspect-auto"
              alt=""
            />
            <Link to={`/team/member/${member.id}`}>
              <h1 className="font-semibold text-xl capitalize  ">
                {member.username}
              </h1>
            </Link>
            <p className="text-gray-600 text-sm uppercase">{member.role}</p>
            <div className="flex w-full items-center justify-center gap-3">
              <div className="p-1 rounded-full bg-white">
                <WhatsAppIcon className={"w-5 h-5"} />
              </div>
              <div className="p-1 rounded-full bg-white">
                <TwitterIcon className={"w-5 h-5"} />
              </div>
              <div className="p-1 rounded-full bg-white">
                <InstagramIcon className={"w-5 h-5"} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;

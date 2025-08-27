import React from "react";
import collabImg from "../../assets/images/heritage.png";
import collabImg2 from "../../assets/images/p1.png";
import collabImg3 from "../../assets/images/p3.png";
import collabImg4 from "../../assets/images/p4.png";
import collabImg6 from "../../assets/images/p2.png";

const Collaborators = () => {
  // Define the images array here
  const images = [collabImg, collabImg2, collabImg3, collabImg4, collabImg6];

  return (
    <div className="flex flex-wrap items-center justify-center p-3 mt-3 bg-gradient-to-br from-slate-300 via-blue-50 to-cyan-200 rounded-xl mb-4">
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        {images.map((image, i) => (
          <img
            className="w-20 h-20 sm:w-16 sm:h-16 md:w-32 md:h-18 object-contain px-2"
            src={image}
            alt={`collaborator-${i}`}
            key={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Collaborators;

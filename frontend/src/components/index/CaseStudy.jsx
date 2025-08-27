// CaseStudy.jsx
import React from "react";
import CaseStudyCard from "./CaseStudyCard";
import { SparklesIcon, HeartIcon, HomeIcon, ShieldCheckIcon } from "@heroicons/react/16/solid";
import caseImg1 from "../../assets/images/casestudy/hair.jpg";
import caseImg2 from "../../assets/images/casestudy/home2.webp";
import caseImg3 from "../../assets/images/casestudy/english.jpg";
import caseImg4 from "../../assets/images/casestudy/home.jpg";

const CaseStudy = () => {
  const Cases = [
    {
      imageBg: caseImg1,
      Icon: ShieldCheckIcon,
      head: "Safe & Secure Transport",
      category: "Safety First"
    },
    {
      imageBg: caseImg3,
      Icon: SparklesIcon,
      head: "Multilingual Support",
      category: "Communication"
    },
    {
      imageBg: caseImg2,
      Icon: HeartIcon,
      head: "Medical Transportation",
      category: "Healthcare"
    },
    {
      imageBg: caseImg4,
      Icon: HomeIcon,
      head: "Home Care Services",
      category: "Family Care"
    },
  ];

  return (
    <div className="py-2 px-2 mb-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-9xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Case Studies
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Success Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how we&apos;ve transformed lives through reliable, compassionate care and transportation solutions
          </p>
        </div>

        {/* Cards Grid - 4 per row on xl screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Cases.map((caseStudy, i) => (
            <CaseStudyCard
              key={i}
              bgImage={caseStudy.imageBg}
              SvgIcon={caseStudy.Icon}
              h1={caseStudy.head}
              category={caseStudy.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudy;
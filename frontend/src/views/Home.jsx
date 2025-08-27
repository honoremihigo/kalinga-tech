import React, { useEffect } from "react";
import HeroPage from "../components/index/HeroPage";
import Collaborators from "../components/index/Collaborators";
import Services from "../components/index/Services";
import About from "../components/index/About";
import CaseStudy from "../components/index/CaseStudy";
import WhyPeopleChooseUs from "../components/index/WhyPeopleChooseUs";
import ReviewsSection from "../components/ReviewsSection";
import BlogCard from "../components/index/BlogCard";
import MainSection from "../components/index/mainSection";
import Advertisement from "../components/index/Advertisement";

const Home = () => {
  // each time the url or path change it changes the header name
  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",

      inline: "start",
    });
  }, []);

  return (
    <div className="h-full w-full ">
      {/* hero page which container slider container and sidebar */}
      <HeroPage />
      <Services />
      <About />
      <WhyPeopleChooseUs />
      <ReviewsSection />
      <BlogCard />
    </div>
  );
};

export default Home;

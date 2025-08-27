import React from "react";
import HeroPage from "../components/index/HeroPage";
import Collaborators from "../components/index/Collaborators";
import Services from "../components/index/Services";
const Index = () => {
  return (
    <div className="h-full w-full ">
      {/* hero page which container slider container and sidebar */}
      <HeroPage />
      <Collaborators />
      <Services />
    </div>
  );
};

export default Index;

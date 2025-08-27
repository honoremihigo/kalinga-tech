import React from "react";

const OurHistory = () => {
  return (
    <>
      <div
        className="relative bg-cover bg-center h-screen flex items-center justify-center text-black"
        style={{
          backgroundImage: `url('src/assets/images/service/portfolioManage.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-80"></div>
        <div className="relative max-w-4xl text-center px-6 py-10 bg-white rounded-lg shadow-lg bg-opacity-90">
          <div className="flex justify-center mb-4">
            <p className="text-sm px-4 py-1 font-semibold bg-gray-100 rounded-lg shadow-md">
              SINCE 2015
            </p>
          </div>
          <h1 className="text-4xl font-bold mb-6">Established in 2015</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Ut eget magna vel elit suscipit scelerisque. Etiam vel dolor
            euismod, porta tortor sed, tincidunt risus. Pellentesque ut felis
            porttitor, mollis massa ut, vestibulum justo.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Nunc a scelerisque dolor, in cursus sem. Aenean turpis elit, tempus
            vel dictum consectetur, consectetur a sem. Vivamus lacinia rutrum
            justo sed iaculis. Ut eget magna vel elit suscipit scelerisque.
            Etiam vel dolor euismod, porta tortor sed, tincidunt risus.
            Pellentesque ut felis porttitor, mollis massa ut, vestibulum justo.
            Aliquam vel ultricies diam.
          </p>
        </div>
      </div>

      <div className="bg-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">
          About Abyride
        </h1>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 h-full w-1 bg-gray-300 transform -translate-x-1/2 hidden md:block"></div>

          {/* Timeline Item: Our Beginning */}
          <div className="relative flex flex-col md:flex-row w-full items-center gap-8 py-10">
            <div className="w-full md:w-1/2 relative px-4 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Our Beginning
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                Founded in 2015, Abyride started as an initiative to change how
                people commute, building on a foundation of trust and
                connectivity.
              </p>
            </div>

            <div className="relative w-1/3 rounded-lg overflow-hidden">
              <img
                src="src/assets/images/service/executiveSearch.jpg"
                alt="Event"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-1/2 flex justify-center left-0 right-0 mx-auto bg-white py-2 text-center text-lg font-bold rounded-t-lg shadow-lg">
                1999-2002
              </div>
            </div>
          </div>

          {/* Timeline Item: Growth & Expansion */}
          <div className="relative flex flex-col md:flex-row-reverse w-full items-center gap-8 py-10">
            <div className="w-full md:w-1/2 relative px-4 text-center md:text-right">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Growth & Expansion
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                By 2020, Abyride expanded its services nationwide, becoming a
                leader in mobility solutions while focusing on safety and
                affordability.
              </p>
            </div>

            <div className="relative w-1/3 rounded-lg overflow-hidden">
              <img
                src="src/assets/images/service/executiveSearch.jpg"
                alt="Event"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-1/2 flex justify-center left-0 right-0 mx-auto bg-white py-2 text-center text-lg font-bold rounded-t-lg shadow-lg">
                2002-2010
              </div>
            </div>
          </div>

          {/* Timeline Item: New Features Launched */}
          <div className="relative flex flex-col md:flex-row w-full items-center gap-8 py-10">
            <div className="w-full md:w-1/2 relative px-4 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                New Features Launched
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                In 2022, Abyride introduced new features to improve the rider
                and driver experience, prioritizing innovation and customer
                satisfaction.
              </p>
            </div>

            <div className="relative w-1/3 rounded-lg overflow-hidden">
              <img
                src="src/assets/images/service/executiveSearch.jpg"
                alt="Event"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-1/2 flex justify-center left-0 right-0 mx-auto bg-white py-2 text-center text-lg font-bold rounded-t-lg shadow-lg">
                2010-2015
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurHistory;

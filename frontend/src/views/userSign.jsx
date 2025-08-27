import React from "react";
import { Link } from "react-router-dom";
import { VscArrowRight } from "react-icons/vsc";
import { VscArrowLeft } from "react-icons/vsc";
import Header from "../components/Header";
import { useAuth } from "../context/ClientAuthContext";
import { useDriverAuth } from "../context/DriverAuthContext";

const SignInOptions = () => {
  const { isAuthenticated: clientIsAuth } = useAuth();
  const { isAuthenticated: driverIsAuth } = useDriverAuth();
  return (
    <>
      <Header title="Join Abyride LLC " />
      <div className="flex flex-col items-center justify-center mb-10  bg-white">
        <div className="flex  justify-between lg:gap-x-52 md:gap-x-20 flex-col   md:flex-row">

            <div className="text-center flex gap-x-8 items-center border-b-4 border-gray-900 ">
            <h2 className="font-semibold text-3xl">
             Schedule Ride
            </h2>
            <button className="mt-12 flex items-center text-black font-medium focus:outline-none">
              {driverIsAuth ? (
                <Link to="/reservation">
                  <span className="mr-2 text-5xl">
                    <VscArrowRight />
                  </span>
                </Link>
              ) : (
                <Link to="/reservation">
                  <span className="mr-2 text-5xl">
                    <VscArrowRight />
                  </span>
                </Link>
              )}
            </button>
          </div>

          <div className="text-center flex gap-x-8 items-center border-b-4 border-gray-900 ">
            <h2 className="font-semibold text-3xl">
              Sign in to drive & deliver
            </h2>
            <button className="mt-12 flex items-center text-black font-medium focus:outline-none">
              {driverIsAuth ? (
                <Link to="/driver/dashboard">
                  <span className="mr-2 text-5xl">
                    <VscArrowRight />
                  </span>
                </Link>
              ) : (
                <Link to="/AbyrideDriver">
                  <span className="mr-2 text-5xl">
                    <VscArrowRight />
                  </span>
                </Link>
              )}
            </button>
          </div>

          <div className="text-center flex gap-x-8 items-center border-b-4 border-gray-900">
            <h2 className="text-3xl font-semibold">Sign in to ride</h2>

            <button className="mt-12 flex items-center text-black font-medium focus:outline-none">
              {clientIsAuth ? (
                <Link to="/booking">
                  <span className="mr-2 text-5xl">
                    <VscArrowRight />
                  </span>
                </Link>
              ) : (
                <Link to="/AbyrideClient">
                  <span className="mr-2 text-5xl">
                    <VscArrowRight />
                  </span>
                </Link>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInOptions;

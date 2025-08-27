import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaCar, FaChevronDown } from "react-icons/fa";
import Dropdown from "../components/Activity/DropDown";
import { activityTrips } from "../staticData/data";
import TripCard from "../components/Activity/TripCard";
import TripDetails from "../components/Activity/TripDetails";
import UserHeader from "../components/userHeader";

const time = ["All Trips", "past 30 days", "February", "Last Year"];

const Activity = () => {
  const [tripType, setTripType] = useState("Personal");
  const [tripTime, setTripTime] = useState("All Trips");
  const [trips, setTrips] = useState([]); // for now to see cards you can set to any value in order the array to not be empty😪😴😩🥱
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");

  const tripByRef = activityTrips.find((trip) => trip.ref === ref);

  return (
    <div>
      <UserHeader />
      <section className="bg-white min-h-screen p-4 md:p-8 mt-3">
        <div className="flex gap-1.5 flex-col md:flex-row flex-nowrap">
          {/* left main section */}
          {ref ? (
            <div className="flex-1 p-4">
              <TripDetails trip={tripByRef} />
            </div>
          ) : (
            <div className="flex flex-col flex-1 border border-gray-100 bg-gray-50 rounded-md p-4 ">
              {/* filter header part */}
              <div className="xl:flex xl:p-1 justify-between md:flex md:p-1 items-center  mb-3">
                <h1 className="text-2xl md:text-3xl font-bold">Past Rides</h1>
                <div className="flex items-center gap-3">
                  <Dropdown
                    options={["Personal", "Business"]}
                    selected={tripType}
                    setSelected={setTripType}
                  />
                  <Dropdown
                    options={time}
                    selected={tripTime}
                    setSelected={setTripTime}
                  />
                </div>
              </div>

              {/* Main Content */}
              {trips.length < 1 ? (
                <Link to={"/booking"} className="flex-1 rounded-lg pb-4">
                  <img
                    src="https://d3i4yxtzktqr9n.cloudfront.net/riders-web-v2/853ebe0d95a62aca.svg"
                    alt="Car image"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="mt-4 text-xl font-semibold">
                    {" "}
                    You have not taken any rides yet, take your first ride
                  </p>
                  <button
                    onClick={() => navigate("/booking")}
                    className="mt-4 flex items-center px-4 py-2 bg-black text-white rounded-lg"
                  >
                    <FaCar className="mr-2" />
                    <span>Book now</span>
                  </button>
                </Link>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activityTrips.map((trip, index) => (
                    <TripCard key={index} trip={trip} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* right little sidebar on large screens */}
          <div className="hidden lg:flex w-1/4 ml-6 border border-gray-100 pb-4 p-2 bg-gray-50 items-center rounded-md">
            <div className="rounded-lg flex flex-col items-center text-center justify-center">
              <img
                src="https://d3i4yxtzktqr9n.cloudfront.net/riders-web-v2/853ebe0d95a62aca.svg"
                alt="car image"
                className="w-full"
              />
              <h2 className="mt-4 text-xl font-bold">Get a ride in minutes</h2>
              <p className="mt-2 text-gray-600">
                {" "}
                Book an <strong>Abyride</strong> from a web browser, no app
                install necessary.
              </p>
              <button
                onClick={() => navigate("/booking")}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
              >
                Request a Ride
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Activity;

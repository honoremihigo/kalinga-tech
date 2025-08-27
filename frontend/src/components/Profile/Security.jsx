import { FaAngleRight, FaGoogle } from "react-icons/fa";
import EditPassword from "./EditPassword";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/ClientAuthContext";

const Security = () => {
  const [editPassword, setEditPassword] = useState(false);
  const { user } = useAuth();

  const [location, setLocation] = useState("Fetching...");
  const [locationError, setLocationError] = useState(null);

  const handleGoogleLogin = () => {
    user?.googleId
      ? toast.success("already connected")
      : toast.error("Google login URL not configured");
  };

  const getLocation = useCallback(async () => {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              );

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              setLocation(`${data.address.city}, ${data.address.country}`);
            } catch (fetchError) {
              console.error("Location fetch error:", fetchError);
              setLocation("Unable to resolve location");
            }
          },
          (positionError) => {
            console.error("Geolocation error:", positionError);

            // More specific handling based on error code
            switch (positionError.code) {
              case positionError.PERMISSION_DENIED:
                setLocation("Location access denied");
                setLocationError(true);
                toast.error(
                  "Location access is blocked. Please enable permissions in your browser settings.",
                  {
                    position: "top-right",
                    autoClose: 5000,
                  },
                );
                break;
              case positionError.POSITION_UNAVAILABLE:
                setLocationError(true);
                setLocation("Location information unavailable");
                toast.warn("Unable to retrieve location information.");
                break;
              case positionError.TIMEOUT:
                setLocationError(true);
                setLocation("Location request timed out");
                toast.warn("Location request took too long and was cancelled.");
                break;
              default:
                setLocationError(true);
                setLocation("Unknown location error");
                toast.error(
                  "An unexpected error occurred while fetching location.",
                );
            }
          },
          {
            // Optional options to improve location request
            enableHighAccuracy: true, // Request most accurate location
            timeout: 10000, // 10 second timeout
            maximumAge: 0, // Don't use cached location
          },
        );
      } else {
        setLocation("Geolocation not supported");
        toast.error("Your browser does not support geolocation services.");
      }
    } catch (error) {
      console.error("Unexpected location error:", error);
      setLocation("Error fetching location");
      toast.error("An error occurred while trying to fetch location.");
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const getBrowserAndOS = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform || navigator.userAgentData?.platform;

    // Detect OS
    let os = "Unknown OS";
    if (/Windows/i.test(userAgent)) os = "Windows";
    else if (/Mac/i.test(userAgent)) os = "MacOS";
    else if (/Linux/i.test(userAgent)) os = "Linux";
    else if (/Android/i.test(userAgent)) os = "Android";
    else if (/iPhone|iPad|iPod/i.test(userAgent)) os = "iOS";

    // Detect Browser
    let browser = "Unknown Browser";
    if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent))
      browser = "Chrome";
    else if (/Edg/i.test(userAgent)) browser = "Edge";
    else if (/Firefox/i.test(userAgent)) browser = "Firefox";
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent))
      browser = "Safari";
    else if (/Opera|OPR/i.test(userAgent)) browser = "Opera";

    return { browser, os };
  };

  console.log(getBrowserAndOS());

  return (
    <div className="w-full max-w-4xl px-4 md:px-10 py-8">
      <ToastContainer theme="dark" />
      <h1 className="text-3xl font-bold mb-6">Security</h1>
      <div className="space-y-6">
        {/* <section>
          <h2 className="sm:text-2xl text-xl font-semibold mb-2">Logging in to Abyride</h2>
          <ul className="divide-y divide-gray-200">

              <li onClick={()=> setEditPassword(true)} className="flex justify-between items-center py-4 cursor-pointer hover:bg-gray-50 px-2">
                <div>
                  <p className="text-lg font-semibold">Password</p>
                  <p className="text-base text-gray-600">Last changed February 3, 2025</p>
                </div>
                <FaAngleRight className="text-gray-400" />
              </li>

              <li className="flex justify-between items-center py-4 cursor-pointer hover:bg-gray-50 px-2">
                <div>
                  <p className="text-lg font-semibold">2-step verification</p>
                  <p className="text-base text-gray-600">Add additional security to your account with 2-step verification.</p>
                </div>
                <FaAngleRight className="text-gray-400" />
              </li>

          </ul>
        </section> */}
        <section>
          <h2 className="sm:text-2xl text-xl font-semibold mb-2">
            Connected social apps
          </h2>
          <p className="text-base text-gray-600 mb-3">
            You’ve allowed these social apps to sign in to your{" "}
            <strong>Abyride</strong> account.
          </p>
          <div className="flex items-center py-4 px-6 ">
            <div className=" w-14 sm:w-20 grid place-items-center py-3">
              <FaGoogle />
            </div>
            <div className="flex-1 flex justify-between items-center border-b-2 py-3 border-gray-50">
              <span className="text-lg font-semibold">Google</span>
              <button
                className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-200 transition"
                onClick={handleGoogleLogin}
              >
                {user.googleId ? "Connected" : "Connect"}
              </button>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Login activity
          </h2>
          <p className="text-base text-gray-600 mb-3">
            You’re logged in or have been logged in on these devices within the
            last 30 days. Multiple logins from the same device may appear.
          </p>
          <div className="border rounded-lg p-4">
            <p className="text-base font-semibold">
              🖥️ {getBrowserAndOS().browser} on {getBrowserAndOS().os}
            </p>
            <p className="text-blue-600 text-sm font-medium">
              Your current login
            </p>
            <p
              className={`text-sm ${locationError ? "text-red-600" : "text-gray-600"}`}
            >
              {location}
            </p>

            <p className="text-sm text-gray-600">Abyride Web</p>
          </div>
        </section>
      </div>
      <EditPassword isOpen={editPassword} onClose={setEditPassword} />
    </div>
  );
};

export default Security;

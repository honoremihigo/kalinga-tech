import { FaAngleRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="p-10 md:max-w-screen-md w-full">
      <h2 className="text-3xl font-bold mb-6">Privacy & Data</h2>
      <div className="flex items-center justify-between mb-4">
        <div onClick={() => navigate("")}>
          <h3 className="text-xl font-semibold mb-2">Privacy Center</h3>
          <p className="text-gray-500 text-sm">
            Take Control of your data and Learn how we control it.
          </p>
        </div>
        <FaAngleRight className="w-5 h-5 text-gray-400" />
      </div>

      <div className="">
        <h3 className="text-2xl font-semibold mb-2">
          Third-party apps with account access
        </h3>
        <p className="text-gray-500 text-sm">
          Once you allow access to third party apps, you’ll see them here.{" "}
          <Link to="" className="text-gray-600 underline ">
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Privacy;

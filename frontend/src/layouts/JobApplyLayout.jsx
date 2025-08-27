import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

function JobApplyLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return (
    <main className="my-4">
      <Outlet />
    </main>
  );
}

export default JobApplyLayout;

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/ClientAuthContext";
import Loader from "../Loading";
import FillUserInfo from "../../views/Clients/Auth/FillUserInfo";

const ProtectedRiderRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  console.log(`is auth :`, isAuthenticated);
  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/JoinUs" replace />;
  }

  console.log(`true ssjjs`, !user?.firstName);

  if (!user?.lastName || !user?.firstName) {
    return <FillUserInfo></FillUserInfo>;
  }

  return children;
};
export default ProtectedRiderRoute;

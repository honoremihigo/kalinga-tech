import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/ClientAuthContext";
import Loader from "../Loading";

const ProtectedLoginRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedLoginRoute;

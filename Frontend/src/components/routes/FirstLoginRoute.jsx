import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

const FirstLoginRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (
    user &&
    user.role === ROLES.MECHANIC &&
    user.firstLogin
  ) {
    return <Navigate to="/change-password" replace />;
  }

  return children;
};

export default FirstLoginRoute;
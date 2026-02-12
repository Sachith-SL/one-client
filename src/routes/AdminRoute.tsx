import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AdminRoute = () => {
  const { isLoggedIn, roles } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

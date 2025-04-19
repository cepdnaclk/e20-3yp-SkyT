import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactElement } from "react";

type Props = {
  allowedRoles: string[];
  element: ReactElement;
};

const ProtectedRoute = ({ allowedRoles, element }: Props) => {
  const { user, loading } = useAuth();

  console.log("Protected Route: ", user);
  console.log("Allowed for: ", allowedRoles);

  if (!loading) {
    if (!user) return <Navigate to="/login" />;

    if (!allowedRoles.includes(user?.role.toLowerCase()))
      return <Navigate to="/notfound" />;

    return element;
  }
};

export default ProtectedRoute;

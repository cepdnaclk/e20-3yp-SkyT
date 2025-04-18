import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactElement } from "react";

type Props = {
  allowedRoles: string[];
  elements: ReactElement;
};

const ProtectedRoute = ({ allowedRoles, elements }: Props) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user?.role)) return <Navigate to="/notfound" />;

  return elements;
};

export default ProtectedRoute;

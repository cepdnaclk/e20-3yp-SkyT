import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactElement } from "react";

const PublicRoute = ({ element }: { element: ReactElement }) => {
  const { user, loading } = useAuth();

  if (!loading) {
    return user !== null ? <Navigate to="/home" /> : element;
  }
};

export default PublicRoute;

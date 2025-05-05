import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactElement } from "react";
import { useLoading } from "../context/LoadingContext";

const PublicRoute = ({ element }: { element: ReactElement }) => {
  const { user } = useAuth();
  const { loading } = useLoading();

  if (!loading) {
    return user !== null ? <Navigate to="/home" /> : element;
  }
};

export default PublicRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactElement } from "react";
import { useLoading } from "../context/LoadingContext";

const PrivateRoute = ({ element }: { element: ReactElement }) => {
  const { user } = useAuth();
  const { loading } = useLoading();

  if (!loading) {
    return user !== null ? element : <Navigate to="/login" />;
  }
};

export default PrivateRoute;

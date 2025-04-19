import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactElement } from "react";

const PrivateRoute = ({ element }: { element: ReactElement }) => {
  const { user, loading } = useAuth();

  if (!loading) {
    return user !== null ? element : <Navigate to="/login" />;
  }
};

export default PrivateRoute;

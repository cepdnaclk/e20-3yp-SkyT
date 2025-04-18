import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactElement } from "react";

const PrivateRoute = ({ element }: { element: ReactElement }) => {
  const { user } = useAuth();

  return user !== null ? element : <Navigate to="/login" />;
};

export default PrivateRoute;

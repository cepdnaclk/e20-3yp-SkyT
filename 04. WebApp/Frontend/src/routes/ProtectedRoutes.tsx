import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactElement } from "react";

const ProtectedRoute = ({ element }: { element: ReactElement }) => {
  const { user, loading, superUsers } = useAuth();

  console.log("Protected Route: ", user);
  console.log("Allowed for: ", superUsers);

  if (!loading) {
    if (!user) return <Navigate to="/login" />;

    if (!superUsers.includes(user?.role.toLowerCase()))
      return <Navigate to="/notfound" />;

    return element;
  }
};

export default ProtectedRoute;

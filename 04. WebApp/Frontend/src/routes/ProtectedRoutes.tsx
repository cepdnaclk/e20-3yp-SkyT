import { Navigate, useLocation } from "react-router-dom";
import { ValidateData } from "../api/NodeBackend";
import { ReactElement, useEffect, useState } from "react";

const PARTIAL_ACCESS = ["/page1", "/page2"];

// Custom Protected Route Component
function ProtectedRoute({ element }: { element: ReactElement }) {
  const location = useLocation().pathname;
  const [accessType, setAccessType] = useState<string>("validating");

  const getAccess = async (token: string) => {
    try {
      const serverResponse = await ValidateData(token, "authenticate");
      console.log("Access Type:", serverResponse);
      setAccessType(serverResponse);
    } catch (error) {
      console.error("Error in fetching access type:", error);
      setAccessType("denied");
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setAccessType("denied");
    } else {
      getAccess(token);
    }
  }, []);

  // Action Center
  if (accessType === "validating") {
    return null; // Prevent rendering anything during validation
  }

  if (accessType === "valid") {
    return element;
  }

  if (accessType === "forbidden") {
    console.log("Path: ", location);
    if (PARTIAL_ACCESS.includes(location)) {
      return element;
    }
    return <Navigate to="/forbidden" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;

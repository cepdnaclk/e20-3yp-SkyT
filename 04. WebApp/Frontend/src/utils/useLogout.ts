import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export default function useLogout() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const logout = useCallback(() => {
    console.log("Logging out...");
    sessionStorage.clear();
    setUser(null);
    navigate("/login");
  }, [navigate, setUser]);

  return logout;
}

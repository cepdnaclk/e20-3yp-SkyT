import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function useLogout() {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    console.log("Logging out...");
    sessionStorage.clear();
    navigate("/login");
  }, [navigate]);

  return logout;
}

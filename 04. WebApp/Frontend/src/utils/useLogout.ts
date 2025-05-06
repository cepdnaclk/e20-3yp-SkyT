import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { ToastAlert } from "../components/ToastAlert";

export default function useLogout() {
  const { setUser } = useAuth();

  const logout = useCallback(() => {
    console.log("Logging out...");

    ToastAlert({
      type: "success",
      title: "Logout successful!",
    });
    sessionStorage.clear();
    setUser(null);
  }, [setUser]);

  return logout;
}

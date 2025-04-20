import { useEffect, useState } from "react";
import { validateToken } from "../api/NodeBackend";
import { AuthContext, UserProps } from "./AuthContext";
import { ToastAlert } from "../components/ToastAlert";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);

  const superUsers = ["owner", "developer"];

  useEffect(() => {
    const validate = async (token: string) => {
      console.log("Auth validating...");
      try {
        const serverResponse = await validateToken(token);
        console.log("Validation:", serverResponse.message);
        setUser(serverResponse.user as UserProps);
      } catch (error) {
        console.log("Auth Error:", error);

        ToastAlert({
          type: "warning",
          title: "The session has been expired. Please log in again.",
        });

        sessionStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const token = sessionStorage.getItem("token");

    if (!token) {
      console.log("No token");
      setUser(null);
      setLoading(false);
      return;
    } else {
      validate(token);
    }

    const interval = setInterval(validate, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, superUsers, setUser, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

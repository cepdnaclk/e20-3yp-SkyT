import { useEffect, useState } from "react";
import { validateToken } from "../api/NodeBackend";
import { AuthContext, UserProps } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const serverResponse = await validateToken(token);
        console.log("Validation:", serverResponse.message);
        setUser(serverResponse.user as UserProps);
      } catch (error) {
        console.log("Auth Error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validate();

    const interval = setInterval(validate, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useContext } from "react";

export interface UserProps {
  userId: number;
  email: string;
  role: string;
}

export interface AuthContextProps {
  user: UserProps | null;
  loading: boolean;
  superUsers: string[];
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  superUsers: ["owner", "developer"],
  setUser: () => {},
  setLoading: () => {},
});

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext } from "react";

export interface UserProps {
  userId: number;
  email: string;
  role: string;
}

export interface AuthContextProps {
  user: UserProps | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

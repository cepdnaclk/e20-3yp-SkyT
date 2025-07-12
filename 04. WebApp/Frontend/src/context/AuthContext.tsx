import { createContext, useContext } from "react";

export interface UserProps {
  userId: number;
  role: string;
  profilePic: string | null;
  msgCount: number;
}

export interface AuthContextProps {
  user: UserProps | null;
  superUsers: string[];
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  superUsers: ["owner", "developer"],
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

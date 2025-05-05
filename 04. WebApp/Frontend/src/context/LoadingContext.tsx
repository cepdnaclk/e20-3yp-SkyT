import { createContext, useContext } from "react";

export interface LoadingContextProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextProps>({
  loading: false,
  setLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

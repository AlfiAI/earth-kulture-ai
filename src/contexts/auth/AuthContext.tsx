
import { createContext, useContext, ReactNode } from "react";
import { AuthContextType } from "./types";
import { useAuthProvider } from "./useAuthProvider";

// Create the auth context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ 
  children, 
  value 
}: { 
  children: ReactNode;
  value?: AuthContextType;
}) => {
  // Use the provided value or get it from useAuthProvider
  const auth = value || useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

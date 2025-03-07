
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  email: string;
  name?: string;
  picture?: string;
  sub: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  loginWithRedirect: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout
  } = useAuth0();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAuthenticated) {
      setAuthUser({
        email: user.email || '',
        name: user.name,
        picture: user.picture,
        sub: user.sub || ''
      });
    } else {
      setAuthUser(null);
    }
  }, [user, isAuthenticated]);

  const logout = () => {
    auth0Logout({ 
      logoutParams: {
        returnTo: window.location.origin + '/auth' 
      }
    });
    toast.success("You have been logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user: authUser,
        loginWithRedirect,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

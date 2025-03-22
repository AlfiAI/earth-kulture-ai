
import { useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "../types";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const isAuthenticated = !!user;
  
  return {
    session,
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    setSession,
    setUser,
    setUserProfile,
    setIsLoading,
    authError,
    setAuthError
  };
};

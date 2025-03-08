
import { Session, User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company?: string;
  role?: string;
  industry?: string;
  email_verified?: boolean;
  mfa_enabled?: boolean;
  last_sign_in?: string;
}

export interface MFASignInResult {
  requiresMFA: boolean;
  factorId?: string;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<MFASignInResult>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setupMFA: () => Promise<{ qr: string; secret: string } | null>;
  verifyMFA: (token: string) => Promise<boolean>;
  disableMFA: () => Promise<boolean>;
}


import { Session, User } from "@supabase/supabase-js";
import { IndustryType, UserRoleType } from "@/services/ai/orchestration/types/agentTypes";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company?: string;
  role?: UserRoleType;
  industry?: IndustryType;
  email_verified?: boolean;
  mfa_enabled?: boolean;
  last_sign_in?: string;
  // Remove the fields that don't exist in the profiles table
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
  authError: string | null; // Changed from Error to string
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<MFASignInResult>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  signInWithGithub: () => Promise<any>;
  signInWithLinkedIn: () => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setupMFA: () => Promise<{ qr: string; secret: string } | null>;
  verifyMFA: (token: string) => Promise<boolean>;
  disableMFA: () => Promise<boolean>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  getUserContext: () => Promise<UserContext>;
}

// User context for AI and dashboard personalization
export interface UserContext {
  userId: string;
  tenantId?: string;
  industry: IndustryType;
  role: UserRoleType;
  preferences: {
    dashboardType: 'individual' | 'business' | 'enterprise';
    dataVisualizationPreference: 'detailed' | 'summary' | 'visual';
    reportFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  };
}

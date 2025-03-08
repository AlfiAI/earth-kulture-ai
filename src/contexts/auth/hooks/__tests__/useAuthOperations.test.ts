
import { useAuthOperations } from '../useAuthOperations';
import { supabase } from '@/integrations/supabase/client';
import { renderHook } from '@testing-library/react';
import { toast } from 'sonner';

// Mock supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      mfa: {
        enroll: jest.fn(),
        challenge: jest.fn(),
        verify: jest.fn(),
        unenroll: jest.fn(),
      }
    },
  },
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useAuthOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should call supabase.auth.signInWithPassword with correct parameters', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({ error: null });
      
      const { result } = renderHook(() => useAuthOperations());
      
      await result.current.signIn('test@example.com', 'password123', true);
      
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      
      // Check localStorage was set for "remember me"
      expect(localStorage.getItem('supabase-remember-me')).toBe('true');
    });

    it('should handle login errors', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({ 
        error: { message: 'Invalid login credentials' } 
      });
      
      const { result } = renderHook(() => useAuthOperations());
      
      await expect(result.current.signIn('test@example.com', 'wrongpassword')).rejects.toEqual({
        message: 'Invalid login credentials'
      });
      
      expect(toast.error).toHaveBeenCalledWith('Invalid email or password. Please try again.');
    });
  });

  describe('signUp', () => {
    it('should call supabase.auth.signUp with correct parameters', async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({ error: null });
      
      const { result } = renderHook(() => useAuthOperations());
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        value: { origin: 'http://localhost:3000' },
        writable: true
      });
      
      await result.current.signUp('newuser@example.com', 'password123');
      
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: 'http://localhost:3000/auth',
          data: {
            full_name: '',
          }
        }
      });
      
      expect(toast.success).toHaveBeenCalled();
      
      // Restore original location
      Object.defineProperty(window, 'location', { value: originalLocation });
    });

    it('should handle signup errors', async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({ 
        error: { message: 'User already registered' } 
      });
      
      const { result } = renderHook(() => useAuthOperations());
      
      await expect(result.current.signUp('existing@example.com', 'password123')).rejects.toEqual({
        message: 'User already registered'
      });
      
      expect(toast.error).toHaveBeenCalledWith('This email is already registered. Please sign in instead.');
    });
  });

  // Additional test for resetPassword
  describe('resetPassword', () => {
    it('should call supabase.auth.resetPasswordForEmail with correct parameters', async () => {
      (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValueOnce({ error: null });
      
      const { result } = renderHook(() => useAuthOperations());
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        value: { origin: 'http://localhost:3000' },
        writable: true
      });
      
      await result.current.resetPassword('user@example.com');
      
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('user@example.com', {
        redirectTo: 'http://localhost:3000/auth',
      });
      
      expect(toast.success).toHaveBeenCalled();
      
      // Restore original location
      Object.defineProperty(window, 'location', { value: originalLocation });
    });
  });

  // Add basic tests for MFA operations
  describe('MFA operations', () => {
    it('should handle MFA setup', async () => {
      (supabase.auth.mfa.enroll as jest.Mock).mockResolvedValueOnce({ 
        data: { totp: { qr_code: 'qr-data', secret: 'secret-code' } },
        error: null 
      });
      
      const { result } = renderHook(() => useAuthOperations());
      const mfaData = await result.current.setupMFA();
      
      expect(supabase.auth.mfa.enroll).toHaveBeenCalledWith({ factorType: 'totp' });
      expect(mfaData).toEqual({ qr: 'qr-data', secret: 'secret-code' });
    });
  });
});


import { render, screen, waitFor } from '@/tests/test-utils';
import { useAuth, AuthProvider } from '../AuthContext';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';

// Mock supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ 
        data: { 
          session: { 
            user: { 
              id: 'test-user-id',
              email: 'test@example.com' 
            } 
          } 
        }, 
        error: null 
      }),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      onAuthStateChange: jest.fn().mockReturnValue({ 
        data: { 
          subscription: { 
            unsubscribe: jest.fn() 
          } 
        } 
      }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ 
        data: { 
          id: 'test-user-id',
          full_name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg'
        }, 
        error: null 
      }),
    }),
  }
}));

// Test component to expose auth context values
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="isLoading">{auth.isLoading.toString()}</div>
      <div data-testid="userEmail">{auth.user?.email || 'no-user'}</div>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides authentication state to child components', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially, isLoading should be true
    expect(screen.getByTestId('isLoading').textContent).toBe('true');

    // After loading, the user should be authenticated
    await waitFor(() => {
      expect(screen.getByTestId('isLoading').textContent).toBe('false');
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
      expect(screen.getByTestId('userEmail').textContent).toBe('test@example.com');
    });
  });

  it('allows user to sign out', async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({ error: null });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('isLoading').textContent).toBe('false');
    });

    // Click sign out button
    await screen.findByRole('button', { name: /Sign Out/i });
    screen.getByRole('button', { name: /Sign Out/i }).click();

    // Verify signOut was called
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});

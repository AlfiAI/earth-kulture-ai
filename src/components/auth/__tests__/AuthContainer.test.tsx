
import { render, screen, fireEvent, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import AuthContainer from '../AuthContainer';
import { supabase } from '@/integrations/supabase/client';
import '@testing-library/jest-dom'; // Add this import to ensure the matchers are available

// Mock auth hooks
const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockSignInWithGoogle = jest.fn();
const mockResetPassword = jest.fn();

jest.mock('@/contexts/auth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    signInWithGoogle: mockSignInWithGoogle,
    resetPassword: mockResetPassword,
  }),
}));

describe('AuthContainer', () => {
  const mockSetAuthMode = jest.fn();
  const mockSetAuthError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    render(
      <AuthContainer 
        authMode="login" 
        setAuthMode={mockSetAuthMode} 
        setAuthError={mockSetAuthError}
        authError={null}
      />
    );

    expect(screen.getByRole('tab', { name: /Email/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Social/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Remember me/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('renders the signup form correctly when authMode is signup', () => {
    render(
      <AuthContainer 
        authMode="signup" 
        setAuthMode={mockSetAuthMode} 
        setAuthError={mockSetAuthError}
        authError={null}
      />
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
  });

  it('renders the reset password form when authMode is reset-password', () => {
    render(
      <AuthContainer 
        authMode="reset-password" 
        setAuthMode={mockSetAuthMode} 
        setAuthError={mockSetAuthError}
        authError={null}
      />
    );

    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();
  });

  it('submits the login form with correct data', async () => {
    mockSignIn.mockResolvedValueOnce(undefined);

    render(
      <AuthContainer 
        authMode="login" 
        setAuthMode={mockSetAuthMode} 
        setAuthError={mockSetAuthError}
        authError={null}
      />
    );

    await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');
    await userEvent.click(screen.getByLabelText(/Remember me/i));
    
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    await userEvent.click(submitButton);

    expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123', true);
  });

  it('handles social login correctly', async () => {
    render(
      <AuthContainer 
        authMode="login" 
        setAuthMode={mockSetAuthMode} 
        setAuthError={mockSetAuthError}
        authError={null}
      />
    );

    // Click on the Social tab
    await userEvent.click(screen.getByRole('tab', { name: /Social/i }));
    
    // Find and click the Google button
    const googleButton = screen.getByText(/Continue with Google/i);
    await userEvent.click(googleButton);

    expect(mockSignInWithGoogle).toHaveBeenCalled();
  });
});

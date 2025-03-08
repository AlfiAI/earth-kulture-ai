
import { render, screen, fireEvent, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import AuthPage from '../AuthPage';
import { supabase } from '@/integrations/supabase/client';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('AuthPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form by default', () => {
    render(<AuthPage />);
    
    // Allow loading state to resolve
    setTimeout(() => {
      expect(screen.getByText('Sign In to Your Account')).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    }, 2000);
  });

  it('switches to signup form when "Sign up" is clicked', async () => {
    render(<AuthPage />);
    
    // Wait for loading state to resolve
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Find and click the Sign up link
    const signupLink = screen.getByRole('button', { name: /Sign up/i });
    userEvent.click(signupLink);
    
    // Check if the form changed to signup
    expect(screen.getByText('Create an Account')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('switches to password reset form when "Forgot password" is clicked', async () => {
    render(<AuthPage />);
    
    // Wait for loading state to resolve
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Find and click the Forgot password link
    const forgotPasswordLink = screen.getByRole('button', { name: /Forgot password\?/i });
    userEvent.click(forgotPasswordLink);
    
    // Check if the form changed to password reset
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();
  });
});

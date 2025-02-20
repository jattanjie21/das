import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { supabase } from '@/lib/supabase/config';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock Supabase client
jest.mock('@/lib/supabase/config', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn()
    }
  }
}));

describe('LoginForm', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: '123' } },
      error: null
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login error', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: new Error('Invalid credentials')
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
}); 
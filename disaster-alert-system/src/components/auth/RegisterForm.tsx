'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/config';
import { toast } from 'react-hot-toast';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the form state
    console.log('Form submission attempt:', {
      emailLength: email.length,
      passwordLength: password.length,
      emailValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      passwordsMatch: password === confirmPassword
    });
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate email format
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!password.trim() || password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      console.log('Attempting Supabase signup with:', { 
        email,
        passwordLength: password.length,
        timestamp: new Date().toISOString()
      });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('Supabase signup response:', {
        success: !!data?.user,
        error: error ? {
          message: error.message,
          status: error.status
        } : null,
        timestamp: new Date().toISOString()
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Registration successful! Please check your email to verify your account.');
        router.push('/login');
      }
    } catch (err) {
      console.error('Registration error:', {
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      toast.error('Failed to register. Please try again.');
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value.trim())}
        className="w-full p-2 border rounded"
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Password"
        required
        minLength={6}
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Confirm Password"
        required
        minLength={6}
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      >
        Register
      </button>
    </form>
  );
}; 
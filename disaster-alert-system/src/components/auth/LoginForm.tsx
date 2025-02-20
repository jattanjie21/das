'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/config';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Password"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Login
      </button>
    </form>
  );
}; 
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Log environment variables (sanitized)
    console.log('Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    });

    const requestData = await request.json();
    console.log('Request data:', {
      hasEmail: !!requestData.email,
      passwordLength: requestData.password?.length,
      headers: Object.fromEntries(request.headers)
    });

    const { email, password } = requestData;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    console.log('Creating Supabase client...');
    const supabase = createRouteHandlerClient({ cookies });
    console.log('Supabase client created');

    console.log('Attempting signup...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: {
          role: 'viewer' // Set default role in user metadata
        }
      }
    });
    console.log('Signup attempt complete');

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: authError.status || 500 }
      );
    }

    if (!authData?.user) {
      console.error('No user data returned');
      return NextResponse.json(
        { error: 'No user returned from signup' },
        { status: 500 }
      );
    }

    console.log('Signup successful:', {
      userId: authData.user.id,
      email: authData.user.email
    });

    // Manually create user profile if trigger fails
    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: authData.user.id,
            role: 'viewer'
          }
        ])
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't return error here, as the user is already created
      }
    } catch (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't return error here, as the user is already created
    }

    return NextResponse.json(
      {
        message: 'Check your email for the confirmation link',
        user: authData.user
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 
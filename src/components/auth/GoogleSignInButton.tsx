'use client';

import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

type GoogleSignInButtonProps = {
  redirectTo?: string;
  mode?: 'signin' | 'signup';
};

export default function GoogleSignInButton({
  redirectTo = `${window.location.origin}/auth/callback`,
  mode = 'signin',
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error with Google sign in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      className="w-full"
      onClick={handleGoogleSignIn}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
          <span>Processing...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <FcGoogle className="h-5 w-5" />
          <span>{mode === 'signin' ? 'Sign in' : 'Sign up'} with Google</span>
        </div>
      )}
    </Button>
  );
} 
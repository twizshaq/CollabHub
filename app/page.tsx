// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';
import { FiMenu } from 'react-icons/fi'; // A menu icon
import { FcGoogle } from 'react-icons/fc';

export default function Home() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // This logic remains the same. It handles redirecting logged-in users.
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        router.replace('/profile');
      } else {
        setLoading(false);
      }
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
            router.replace('/profile');
        }
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleSignInWithGoogle = async () => {
    // This function is now attached to the "Explore More" button.
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  // While checking for a session, show a clean loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#dde4f0]">
        <div className="text-xl font-medium text-slate-600">Loading...</div>
      </div>
    );
  }

  // This is the new landing page design for logged-out users.
  return (
    <div
      className="relative min-h-[100dvh] text-slate-800"
    >
      {/* Semi-transparent overlay for better text readability on busy backgrounds */}
      <div className="absolute inset-0 bg-white backdrop-blur-sm"></div>
      

      {/* Main Centered Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] p-4 text-center">
        <div className="max-w-3xl">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight">
            Experience
            <span className="block font-bold text-6xl md:text-8xl lg:text-9xl text-slate-900 mt-2 md:mt-4">
              Modern Collab
            </span>
            at its Finest
          </h1>
        </div>

       <button
          onClick={handleSignInWithGoogle}
          className="mt-12 px-8 py-4 font-sans font-semibold text-white bg-slate-900/80 rounded-full border-2 border-white/60 shadow-[0px_0px_10px_rgba(0,0,0,.3)] backdrop-blur-md hover:bg-slate-900 transition-all duration-300 hover:scale-105 flex items-center gap-3"
        >
          <FcGoogle className="text-2xl" />
          Sign In with Google
        </button>
      </main>

      {/* Footer Text */}
      <footer className="absolute bottom-0 w-full z-10 bg-red-500/0 flex justify-center font-bold text-xs text-slate-800/70">
        <p className="max-w-xs">
          twizshaq projects
        </p>
      </footer>
    </div>
  );
}
'use client'; // This must be the very first line

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

import SignOutButton from '@/app/components/SignOutButton';
import Image from 'next/image';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; avatar_url: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Effect to fetch user data
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/');
        return;
      }
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();
      
      setUser(user);
      setProfile(profileData);
      setLoading(false);
    };
    fetchData();
  }, [router, supabase]);

  // --- NEW: Effect to lock body scroll on mobile when sidebar is open ---
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    // Cleanup function to remove the class if the component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isSidebarOpen]);

  const userDisplayName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Collaborator';
  const userAvatar = profile?.avatar_url || 'https://via.placeholder.com/150';

  const sessionHistory = [
    { id: 1, title: 'Project Plan Q4' },
    { id: 2, title: 'Team Logo Concept' },
    { id: 3, title: 'API Flowchart' },
  ];

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen md:flex bg-white text-slate-800">
      
      {/* --- UPDATED: Overlay with Backdrop Blur --- */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-20 md:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* --- SIDE PANEL --- */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-50/95 backdrop-blur-lg border-r border-slate-200 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src={userAvatar} alt="User Avatar" width={40} height={40} className="object-cover rounded-full"/>
            <h1 className="text-lg font-bold">{userDisplayName}&apos;s Hub</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1">
            <XMarkIcon className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="flex-grow p-4 overflow-y-auto">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Session History</h2>
          <ul className="space-y-2">
            {sessionHistory.map((session) => (
              <li key={session.id}>
                <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-200 transition-colors">
                  <ClockIcon className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-700">{session.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-slate-200 mt-auto">
          <SignOutButton />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-6 md:p-10">
        <div className="flex items-center mb-8">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 -ml-2">
            <Bars3Icon className="w-6 h-6 text-slate-800" />
          </button>
          <h2 className="text-3xl font-bold text-slate-800 ml-2 md:ml-0">
            Create a New Session
          </h2>
        </div>
        
        <div className="max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/new/markdown" className="block hover:no-underline">
              <div className="p-6 border-2 rounded-2xl h-full transition-transform transform hover:-translate-y-1 hover:shadow-xl bg-green-50 border-green-300">
                <h3 className="text-xl font-bold">Real-time Markdown</h3>
                <p className="mt-2 text-slate-600">Collaboratively edit documents and code.</p>
              </div>
            </Link>
            <Link href="/new/pixel-art" className="block hover:no-underline">
              <div className="p-6 border-2 rounded-2xl h-full transition-transform transform hover:-translate-y-1 hover:shadow-xl bg-red-50 border-red-300">
                <h3 className="text-xl font-bold">Pixel Art Canvas</h3>
                <p className="mt-2 text-slate-600">Multiplayer 2D pixel art. Simple and fun.</p>
              </div>
            </Link>
            <Link href="/new/whiteboard" className="block hover:no-underline">
              <div className="p-6 border-2 rounded-2xl h-full transition-transform transform hover:-translate-y-1 hover:shadow-xl bg-indigo-50 border-indigo-300">
                <h3 className="text-xl font-bold">Collaborative Whiteboard</h3>
                <p className="mt-2 text-slate-600">Draw, sketch, and drop shapes.</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
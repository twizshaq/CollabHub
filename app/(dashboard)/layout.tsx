'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<{ full_name: string; avatar_url: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/'); return; }
      const { data: profileData } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single();
      setProfile(profileData);
    };
    fetchData();
  }, [router, supabase]);

  useEffect(() => {
    if (isSidebarOpen) { document.body.classList.add('overflow-hidden'); }
    else { document.body.classList.remove('overflow-hidden'); }
    return () => { document.body.classList.remove('overflow-hidden'); };
  }, [isSidebarOpen]);

  const userDisplayName = profile?.full_name ? profile.full_name.split(' ')[0] : 'User';
  const userAvatar = profile?.avatar_url || 'https://via.placeholder.com/150';

  return (
    <div className="relative min-h-screen md:flex bg-white">
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/10 backdrop-blur-sm z-20 md:hidden" aria-hidden="true"></div>
      )}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName={userDisplayName} userAvatar={userAvatar} />
      <main className="flex-1">
        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 m-4 fixed top-0 left-0 z-10">
          <Bars3Icon className="w-6 h-6 text-slate-800" />
        </button>
        {children}
      </main>
    </div>
  );
}
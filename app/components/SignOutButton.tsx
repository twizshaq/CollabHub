// components/SignOutButton.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { IoLogOutOutline } from 'react-icons/io5';

export default function SignOutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Redirect to the homepage after sign out
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
    >
      <IoLogOutOutline size={20} />
      Sign Out
    </button>
  );
}
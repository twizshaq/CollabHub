// profile/page.tsx
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import SignOutButton from '@/app/components/SignOutButton';
import ProfileCard from '@/app/components/ProfileCard';

// This is a Server Component, excellent for performance and security!

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });

  // 1. Get the user session from the server (securely)
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // 2. Redirect unauthenticated users back to the homepage/sign-in
    redirect('/');
  }

  // 3. Fetch the profile data (name and avatar URL) we stored in the 'profiles' table
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  const userDisplayName = profile?.full_name || 'Collaborator';
  const userAvatar = profile?.avatar_url || 'https://via.placeholder.com/150';

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Header and User Info */}
        <header className="flex justify-between items-center pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-slate-800">
              {userDisplayName}'s CollabHub
            </h1>
            <div className="w-10 h-10 rounded-full overflow-hidden">
                {/* Use the profile avatar */}
                <img 
                    src={userAvatar} 
                    alt="User Avatar" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer" // Necessary for some browsers to load external Google/social images
                />
            </div>
          </div>
          <SignOutButton />
        </header>

        {/* Project Selection / The Three Tools */}
        <h2 className="text-2xl font-bold mt-10 mb-6 text-slate-700">
            Create a New Session
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfileCard 
            title="Real-time Markdown" 
            description="Collaboratively edit documents and code. Great for shared notes or project planning."
            color="bg-green-100 border-green-400"
            linkTo="/new/markdown"
          />
          <ProfileCard 
            title="Pixel Art Canvas" 
            description="Multiplayer 2D pixel art. Simple, fun, and real-time. For a social and creative experiment."
            color="bg-red-100 border-red-400"
            linkTo="/new/pixel-art"
          />
          <ProfileCard 
            title="Collaborative Whiteboard" 
            description="Draw, sketch, and drop shapes. Advanced real-time syncing for complex ideas and meetings."
            color="bg-indigo-100 border-indigo-400"
            linkTo="/new/whiteboard"
          />
        </div>
      </div>
    </div>
  );
}
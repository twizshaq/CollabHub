// app/components/CreateSessionModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import { nanoid } from 'nanoid'; // A library for generating unique IDs

// You'll need to install nanoid: npm install nanoid

interface CreateSessionModalProps {
  onClose: () => void;
}

export default function CreateSessionModal({ onClose }: CreateSessionModalProps) {
  const router = useRouter();
  const [sessionName, setSessionName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  // Generate a unique invite code when the component mounts
  useState(() => {
    setInviteCode(nanoid(10)); // Generates a 10-character unique ID
  });

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000); // Reset icon after 2 seconds
  };

  const handleCreateSession = () => {
    // In a real app, you would save the sessionName and inviteCode to your database here.
    // For example:
    // await supabase.from('sessions').insert({ name: sessionName, code: inviteCode, type: 'markdown' });
    
    // Then, navigate to the editor page with the new session code
    router.push(`/editor/markdown/${inviteCode}`);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex justify-center items-center">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-slate-500 hover:text-slate-800">
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-slate-800">New Markdown Session</h3>
        <p className="text-slate-500 mt-1">Name your session and share the code to collaborate.</p>

        <div className="mt-6">
          <label htmlFor="session-name" className="block text-sm font-medium text-slate-700">
            Session Name
          </label>
          <input
            type="text"
            id="session-name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="e.g., Q4 Project Planning"
            className="mt-1 text-slate-800 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700">
            Invite Code
          </label>
          <div className="mt-1 flex items-center gap-2 p-3 bg-slate-100 border border-slate-200 rounded-md">
            <p className="font-mono text-slate-700 flex-grow">{inviteCode}</p>
            <button onClick={handleCopyToClipboard} className="p-1.5 text-slate-500 hover:text-slate-800">
              {hasCopied ? (
                <CheckIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleCreateSession}
            disabled={!sessionName.trim()}
            className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Create & Go to Editor
          </button>
        </div>
      </div>
    </div>
  );
}
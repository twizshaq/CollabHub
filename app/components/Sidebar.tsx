'use client';

import Image from 'next/image';
import SignOutButton from '@/app/components/SignOutButton';
import { XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAvatar: string;
}

const sessionHistory = [
  { id: 1, title: 'Project Plan Q4' },
  { id: 2, title: 'Team Logo Concept' },
  { id: 3, title: 'API Flowchart' },
];

export default function Sidebar({ isOpen, onClose, userName, userAvatar }: SidebarProps) {
  return (
    <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-50/95 backdrop-blur-lg border-r border-slate-200 flex flex-col transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image src={userAvatar} alt="User Avatar" width={40} height={40} className="object-cover rounded-full"/>
          <h1 className="text-lg font-bold text-slate-900">{userName}&apos;s Hub</h1>
        </div>
        <button onClick={onClose} className="md:hidden p-1">
          <XMarkIcon className="w-6 h-6 text-slate-600" />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Session History</h2>
        <ul className="space-y-2">
          {sessionHistory.map((session) => (
            <li key={session.id}>
              <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-200 transition-colors">
                <ClockIcon className="w-5 h-5 text-slate-500" />
                <span className="font-medium text-slate-800">{session.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-slate-200 mt-auto">
        <SignOutButton />
      </div>
    </aside>
  );
}
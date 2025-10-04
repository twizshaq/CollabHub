'use client';

import { useState } from 'react';
import Link from 'next/link';
import CreateSessionModal from '@/app/components/CreateSessionModal';

type SessionType = 'markdown' | 'pixel-art' | 'whiteboard';

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSessionType, setModalSessionType] = useState<SessionType | null>(null);


  return (
    <>
      {modalSessionType && (
        <CreateSessionModal 
          sessionType={modalSessionType} 
          onClose={() => setModalSessionType(null)} 
        />
      )}
      <div className="flex flex-col w-full h-full p-6 pt-20 md:pt-10 justify-center items-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 self-center">
          Create a New Session
        </h2>
        <div className="max-w-4xl w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <button onClick={() => setModalSessionType('markdown')} className="text-left">
              <div className="p-6 border rounded-2xl h-full transition-transform transform hover:-translate-y-1 hover:shadow-[0px_0px_20px_rgba(0,0,0,.1)] bg-green-50 border-green-300">
                <h3 className="text-xl font-bold text-slate-800">Real-time Markdown</h3>
                <p className="mt-2 text-slate-700">Collaboratively edit documents and code.</p>
              </div>
            </button>
            <button onClick={() => setModalSessionType('pixel-art')} className="text-left">
              <div className="p-6 border rounded-2xl h-full transition-transform transform hover:-translate-y-1 hover:shadow-[0px_0px_20px_rgba(0,0,0,.1)] bg-red-50 border-red-300">
                <h3 className="text-xl font-bold text-slate-800">Pixel Art Canvas</h3>
                <p className="mt-2 text-slate-700">Multiplayer 2D pixel art. Simple and fun.</p>
              </div>
            </button>
            <button onClick={() => setModalSessionType('whiteboard')} className="text-left">
              <div className="p-6 border rounded-2xl h-full transition-transform transform hover:-translate-y-1 hover:shadow-[0px_0px_20px_rgba(0,0,0,.1)] bg-indigo-50 border-indigo-300">
                <h3 className="text-xl font-bold text-slate-800">Collaborative Whiteboard</h3>
                <p className="mt-2 text-slate-700">Draw, sketch, and drop shapes.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
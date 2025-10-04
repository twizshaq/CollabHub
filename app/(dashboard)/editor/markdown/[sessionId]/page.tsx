'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import {
  BoltIcon,
  ItalicIcon,
  StrikethroughIcon,
  CodeBracketIcon,
  ChatBubbleBottomCenterTextIcon,
  ListBulletIcon,
  QueueListIcon,
  PaintBrushIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

export default function MarkdownEditorPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [text, setText] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const handleFormat = (formatType: string, color?: string) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    let newText = '';
    const wrappers: { [key: string]: string[] } = {
      bold: ['**', '**'],
      italic: ['*', '*'],
      strike: ['~~', '~~'],
      code: ['`', '`'],
      quote: ['\n> ', ''],
      bullet: ['\n- ', ''],
      ordered: ['\n1. ', ''],
      color: [`<span style="color: ${color};">`, '</span>'],
    };
    const [before, after] = wrappers[formatType] || ['', ''];
    newText = `${text.substring(0, start)}${before}${selectedText}${after}${text.substring(end)}`;
    setText(newText);
    textarea.focus();
    setTimeout(() => {
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const colors = ['#000000', '#EF4444', '#3B82F6', '#22C55E', '#A855F7', '#F97316'];

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Markdown Editor</h1>
            <p className="mt-2 text-slate-600">
              Session ID: 
              <span className="ml-2 font-mono bg-slate-200 p-1 rounded-md text-sm text-slate-800">{sessionId}</span>
            </p>
          </div>
          <Link href="/profile" className="text-sm text-indigo-600 hover:underline">&larr; Back to Dashboard</Link>
        </div>

        <div className="mt-6 p-2 border rounded-xl bg-slate-50 flex items-center justify-between gap-1 flex-wrap">
          <div className="flex items-center gap-1">
            <button onClick={() => handleFormat('bold')} title="Bold" className="p-2 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-900"><BoltIcon className="w-5 h-5" /></button>
            <button onClick={() => handleFormat('italic')} title="Italic" className="p-2 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-900"><ItalicIcon className="w-5 h-5" /></button>
            <button onClick={() => handleFormat('strike')} title="Strikethrough" className="p-2 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-900"><StrikethroughIcon className="w-5 h-5" /></button>
            <button onClick={() => handleFormat('code')} title="Code" className="p-2 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-900"><CodeBracketIcon className="w-5 h-5" /></button>
            <button onClick={() => handleFormat('quote')} title="Quote" className="p-2 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-900"><ChatBubbleBottomCenterTextIcon className="w-5 h-5" /></button>
            <button onClick={() => handleFormat('bullet')} title="Bullet List" className="p-2 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-900"><ListBulletIcon className="w-5 h-5" /></button>
            <button onClick={() => handleFormat('ordered')} title="Ordered List" className="p-2 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-900"><QueueListIcon className="w-5 h-5" /></button>
            <div className="relative">
              <button onClick={() => setIsColorPickerOpen(!isColorPickerOpen)} title="Text Color" className="p-2 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-900"><PaintBrushIcon className="w-5 h-5" /></button>
              {isColorPickerOpen && (
                <div className="absolute top-full mt-2 p-2 bg-white border rounded-lg shadow-lg flex gap-2 z-10">
                  {colors.map(color => (<button key={color} onClick={() => { handleFormat('color', color); setIsColorPickerOpen(false); }} className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: color }} />))}
                </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
            title="Toggle Preview"
            className={`p-2 rounded-md transition-colors ${viewMode === 'preview' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <EyeIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-grow mt-4 border rounded-xl overflow-hidden">
        {viewMode === 'edit' ? (
          <textarea 
            ref={textAreaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full p-4 text-slate-800 resize-none outline-none bg-transparent"
            placeholder="Start collaborating..."
          />
        ) : (
          <div className="prose w-full max-w-none h-full p-4 overflow-y-auto bg-white text-slate-800">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {text || "Nothing to preview yet. Go back to the editor to start writing!"}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
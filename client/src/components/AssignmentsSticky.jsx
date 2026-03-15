'use client';

import { useState } from 'react';

export default function AssignmentsSticky() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-8 right-8 size-10 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 lg:flex hidden"
        title="Show Assignments"
      >
        <span className="material-symbols-outlined text-sm">edit_note</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 sticky-note w-64 p-6 hidden lg:block rotate-[-3deg] z-50 group transition-all">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10"
      >
        <span className="material-symbols-outlined text-xs">close</span>
      </button>

      <div className="flex items-center justify-between mb-4 border-b border-black/10 pb-2">
        <p className="font-bold text-xs text-slate-800 underline uppercase tracking-widest">Assignments:</p>
        <span className="size-2 bg-blue-600 rounded-full"></span>
      </div>
      <ul className="text-xs space-y-3 font-medium text-slate-700 italic">
        <li className="flex items-center gap-3">
          <span className="material-symbols-outlined text-xs">edit</span>
          Capture meeting insights
        </li>
        <li className="flex items-center gap-3 opacity-50 line-through decoration-red-500">
          <span className="material-symbols-outlined text-xs">done</span>
          Summarize raw documents
        </li>
        <li className="flex items-center gap-3">
          <span className="material-symbols-outlined text-xs">auto_awesome</span>
          Sync project roadmaps
        </li>
        <li className="flex items-center gap-3">
          <span className="material-symbols-outlined text-xs">draw</span>
          Archive team feedback
        </li>
      </ul>
    </div>
  );
}

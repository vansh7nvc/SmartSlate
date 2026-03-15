'use client';

import Link from 'next/link';

export default function MeetingsTable({ meetings, refresh }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'border-green-600 text-green-700 bg-green-50/50';
      case 'processing': return 'border-blue-600 text-blue-700 bg-blue-50/50 animate-pulse';
      case 'failed': return 'border-red-600 text-red-700 bg-red-50/50';
      default: return 'border-slate-300 text-slate-400 bg-slate-50';
    }
  };

  const deleteMeeting = async (e, id) => {
    e.preventDefault();
    if (!confirm('Shred this entry?')) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    await fetch(`${apiUrl}/api/meetings/${id}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <div className="space-y-8">
      {meetings.map((m, i) => (
        <Link 
          key={m._id} 
          href={`/meeting/${m._id}`}
          className={`flex items-center gap-6 p-6 border-b-2 border-slate-100 hover:bg-slate-50 transition-all group relative decoration-none ${
            m.status === 'processing' ? 'bg-[#fff385]/10 border-2 border-slate-800 -rotate-1' : ''
          }`}
        >
          {/* Thumb Placeholder */}
          <div className={`size-16 journal-card p-1 overflow-hidden transition-transform bg-white ${
            i % 2 === 0 ? 'rotate-2' : '-rotate-1'
          } group-hover:rotate-0`}>
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 italic font-black text-xs">
              {m.fileType.toUpperCase()}
            </div>
          </div>

          <div className="flex-1">
            <h4 className={`text-xl font-black text-slate-900 group-hover:italic ${
              m.status === 'processing' ? 'italic' : ''
            }`}>
              {m.title}
            </h4>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest italic">
              {new Date(m.createdAt).toLocaleDateString()} • {m.fileType} • Entry #{m._id.slice(-4)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 border-2 journal-card text-[10px] font-black uppercase tracking-wider bg-white ${getStatusStyle(m.status)}`}>
              {m.status === 'completed' ? 'Done.' : m.status + '!'}
            </span>
            <button 
              onClick={(e) => deleteMeeting(e, m._id)}
              className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 hover:text-red-600 hover:border-red-600 transition-all rotate-3"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </Link>
      ))}

      {meetings.length === 0 && (
        <div className="p-20 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-100 mb-4 italic">draw</span>
          <p className="text-slate-400 font-bold italic uppercase text-xs tracking-widest">The vault is currently empty.</p>
        </div>
      )}
    </div>
  );
}

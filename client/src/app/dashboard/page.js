'use client';

import { useState, useEffect } from 'react';
import MeetingsTable from '../../components/MeetingsTable';

export default function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/meetings');
      const data = await res.json();
      setMeetings(data);
    } catch (err) {
      console.error('Failed to fetch meetings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 notebook-paper p-8 md:p-12 min-h-screen hand-drawn-border">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 border-b-2 border-dashed border-slate-300 pb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">My Library</h2>
          <p className="text-slate-600 mt-2 font-medium italic">"Every session, safely saved on the shelf."</p>
        </div>
        <div className="flex items-center gap-6 w-full lg:w-auto">
          <div className="relative w-full lg:w-80 group">
            <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-slate-800 transition-colors">search</span>
            <input 
              className="w-full bg-transparent border-b border-slate-300 py-2 pl-7 text-sm focus:outline-none focus:border-slate-800 placeholder:italic text-slate-800 font-['Inter'] transition-all" 
              placeholder="Search my library..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center font-black italic opacity-30">Opening the library...</div>
      ) : (
        <MeetingsTable meetings={filteredMeetings} refresh={fetchMeetings} />
      )}

      <footer className="mt-20 border-t border-slate-200 pt-8 text-center opacity-40 italic text-xs">
        <p>"The ink is permanent, the insights are timeless."</p>
      </footer>
    </main>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title || file.name);

    try {
      const res = await fetch('http://localhost:5000/api/meetings/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      router.push(`/meeting/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl animate-float">
      <form onSubmit={handleUpload} className="space-y-6">
        {/* Portal Zone */}
        <section className="portal-zone journal-card p-10 flex flex-col items-center justify-center text-center bg-slate-50 border-dashed border-4 border-slate-300 relative">
           <div 
            className="absolute inset-0 cursor-pointer"
            onClick={() => document.getElementById('file-input').click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setFile(e.dataTransfer.files[0]);
            }}
          />
          <input 
            id="file-input"
            type="file" 
            className="hidden" 
            accept=".mp3,.pdf,.wav"
            onChange={(e) => setFile(e.target.files[0])}
          />
          
          <div className="size-16 rounded-full border-2 border-slate-800 flex items-center justify-center mb-4 text-slate-800 pointer-events-none">
            <span className="material-symbols-outlined text-4xl">edit_note</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 pointer-events-none">Homework Drop</h3>
          <p className="text-slate-600 text-sm max-w-md italic pointer-events-none">
            {file ? `Ready to study: ${file.name}` : 'Drop your class recordings or reading materials here to make instant notes.'}
          </p>
          
          <div className="mt-6 flex gap-3 pointer-events-none">
            <span className="px-4 py-1.5 journal-card bg-white text-[10px] font-bold text-slate-800 uppercase">MP3</span>
            <span className="px-4 py-1.5 journal-card bg-white text-[10px] font-bold text-slate-800 uppercase">WAV</span>
            <span className="px-4 py-1.5 journal-card bg-white text-[10px] font-bold text-slate-800 uppercase">PDF</span>
          </div>
        </section>

        {/* Title and Action */}
        <div className="journal-card p-6 bg-white flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            className="flex-1 bg-transparent border-b-2 border-slate-200 py-2 px-1 outline-none focus:border-slate-800 transition-colors text-sm font-medium"
            placeholder="Recording Title (optional)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !file}
            className="px-8 py-3 bg-slate-800 text-white font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? 'Writing...' : 'Note Down'}
          </button>
        </div>

        {error && <p className="text-red-600 text-center font-bold text-xs italic">⚠️ {error}</p>}
      </form>
    </div>
  );
}

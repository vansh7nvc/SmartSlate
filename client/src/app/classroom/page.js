'use client';

import UploadForm from '../../components/UploadForm.jsx';

export default function Classroom() {
  return (
    <main className="flex-1 notebook-paper p-8 md:p-12 min-h-screen hand-drawn-border">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 border-b-2 border-dashed border-slate-300 pb-8 relative">
        <div className="relative">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Classroom Notes</h2>
          <p className="text-slate-600 mt-2 font-medium italic">&quot;Keep your notes clean and your mind sharp.&quot;</p>
          {/* Rubber Stamp Effect */}
          <div className="absolute -top-6 -right-12 rotate-12 border-4 border-red-600/30 text-red-600/30 font-black text-sm px-3 py-1 uppercase rounded-sm border-double pointer-events-none hidden lg:block">
            Graded A+
          </div>
        </div>
        <div className="flex items-center gap-6 w-full lg:w-auto">
          <div className="relative w-full lg:w-80 group">
            <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-slate-800 transition-colors">search</span>
            <input 
              className="w-full bg-transparent border-b border-slate-300 py-2 pl-7 text-sm focus:outline-none focus:border-slate-800 placeholder:italic text-slate-800 font-['Inter'] transition-all" 
              placeholder="Search your notes..." 
              type="text"
            />
          </div>
          <div className="flex items-center gap-3 bg-white/60 p-2 rounded shadow-sm rotate-1 border border-slate-200">
            <div className="size-9 rounded-full border border-slate-800 overflow-hidden grayscale bg-slate-200 flex items-center justify-center font-bold text-xs">
              AR
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-none">User Session</p>
              <p className="text-[9px] uppercase font-bold text-slate-500 mt-1">The Visionary</p>
            </div>
          </div>
        </div>
      </header>

      {/* Key Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
        <div className="relative group">
          <div className="tape-effect absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 z-10 -rotate-2"></div>
          <div className="journal-card p-6 rotate-[-2deg] group-hover:rotate-0 transition-transform bg-white">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Pages</p>
            <h3 className="text-4xl font-black text-slate-900">1,284</h3>
            <p className="text-[10px] font-bold text-green-700 mt-3">+12.4% More than last week</p>
          </div>
        </div>
        <div className="relative group">
          <div className="tape-effect absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 z-10 rotate-6"></div>
          <div className="journal-card p-6 rotate-[1deg] group-hover:rotate-0 transition-transform bg-white">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Smart Facts</p>
            <h3 className="text-4xl font-black text-slate-900">8,492</h3>
            <p className="text-[10px] font-bold text-slate-500 mt-3 italic">Holding steady...</p>
          </div>
        </div>
        <div className="relative group">
          <div className="tape-effect absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 z-10 -rotate-12"></div>
          <div className="journal-card p-6 rotate-[-1deg] group-hover:rotate-0 transition-transform bg-white">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Class Score</p>
            <h3 className="text-4xl font-black text-slate-900">94.8%</h3>
            <p className="text-[10px] font-bold text-green-700 mt-3">High performance</p>
          </div>
        </div>
      </section>

      {/* Upload Portal */}
      <section className="mb-16 flex justify-center">
        <UploadForm />
      </section>

      {/* Selection of Doodles and Margin Notes */}
      <section className="mt-16 relative">
        <h3 className="text-2xl font-black text-slate-900 mb-8 italic opacity-70 underline decoration-wavy decoration-slate-300">Marginalia & Doodles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Margin Note 1 */}
          <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg bg-white/40 relative rotate-1">
            <span className="material-symbols-outlined absolute -top-4 -left-4 text-3xl text-slate-400 rotate-[-15deg]">brush</span>
            <p className="text-sm font-bold text-slate-700 italic leading-relaxed">
              &quot;Iteration is the father of perfection. Every sync is a step closer to the vision.&quot;
            </p>
            <p className="text-[10px] uppercase font-black text-slate-400 mt-4 tracking-tighter">— Thought of the Day</p>
          </div>
          
          {/* Margin Note 2 */}
          <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg bg-white/40 relative -rotate-1">
            <span className="material-symbols-outlined absolute -top-4 -right-4 text-4xl text-blue-400 rotate-12">lightbulb</span>
            <p className="text-sm font-bold text-slate-700 italic leading-relaxed">
              Analyze the tone of the meetings to detect team fatigue or excitement levels.
            </p>
            <p className="text-[10px] uppercase font-black text-slate-400 mt-4 tracking-tighter">— Potential Update</p>
          </div>
        </div>
      </section>

      {/* Feature Progress Section */}
      <section className="mt-20 pb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Captured in Ink (Implemented) */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-2xl font-black text-slate-800 italic underline decoration-blue-500/30">Already Studied</h3>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-widest">Done</span>
            </div>
            <div className="space-y-4">
              {[
                { title: "Vault Search", desc: "Instant neural filtering of your entire workspace.", icon: "troubleshoot" },
                { title: "Markdown Export", desc: "One-click distillation into permanent local files.", icon: "ios_share" },
                { title: "Neural Summaries", desc: "Deep logic extraction using Gemini context.", icon: "auto_awesome" }
              ].map((feature, i) => (
                <div key={i} className="journal-card p-5 bg-white border-blue-100 relative group overflow-hidden">
                  <div className="absolute -right-2 -bottom-2 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-6xl">verified</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-2xl text-blue-600">{feature.icon}</span>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm uppercase italic">{feature.title}</h4>
                      <p className="text-[11px] font-medium text-slate-500 italic mt-1">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pencil Sketches (Future) */}
          <div className="flex-1">
             <div className="flex items-center gap-3 mb-8">
              <h3 className="text-2xl font-black text-slate-400 italic">Pencil Sketches</h3>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Planned</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Speaker ID", icon: "groups" },
                { title: "Live Capture", icon: "graphic_eq" },
                { title: "Calendar Sync", icon: "event_repeat" },
                { title: "Tone Mapping", icon: "query_stats" }
              ].map((feature, i) => (
                <div key={i} className="journal-card p-4 bg-white/30 border-dashed border-2 opacity-60 hover:opacity-100 hover:bg-white transition-all group">
                  <span className="material-symbols-outlined text-xl text-slate-400 mb-2 block group-hover:text-slate-800">{feature.icon}</span>
                  <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-tight italic">{feature.title}</h4>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <footer className="mt-8 text-center opacity-40 italic text-xs">
        <p>&quot;The advancement of intelligence depends on the rigor of its documentation.&quot;</p>
      </footer>
    </main>
  );
}

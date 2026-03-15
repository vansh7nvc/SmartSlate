import Link from 'next/link';

export default function Navbar() {
  return (
    <aside className="w-full md:w-72 flex flex-col gap-6 pt-4">
      {/* Branding Sticky Note */}
      <div className="relative mb-4 group animate-float">
        <div className="tape-effect absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 z-10 rotate-[-2deg]"></div>
        <div className="sticky-note p-6 -rotate-2 relative overflow-hidden rounded-sm group-hover:rotate-0 transition-transform">
          <div className="absolute top-0 left-0 w-full h-2 bg-black/5"></div>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-lg bg-white p-2 border border-black/10 flex items-center justify-center rotate-3 shadow-sm font-black text-slate-800 text-xl border-dashed">
              SS
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight italic">StudySlate</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Class Notes</p>
          </div>
        </div>
      </div>
    </div>
      <nav className="flex flex-col gap-2">
        <Link href="/classroom" className="torn-tab px-6 py-4 flex items-center gap-4 text-slate-700 hover:bg-slate-50 transition-all font-bold group">
          <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-800">school</span>
          Classroom
        </Link>
        <Link href="/dashboard" className="torn-tab px-6 py-4 flex items-center gap-4 text-slate-700 hover:bg-slate-50 transition-all font-bold group">
          <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-800">library_books</span>
          Library
        </Link>
      </nav>

      {/* Capacity Indicator */}
      <div className="mt-auto journal-card p-6 bg-[#d4f1f4] rotate-1 relative group bg-white">
        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-5xl text-slate-800/10 rotate-12 group-hover:scale-110 transition-transform pointer-events-none">draw</span>
        <h4 className="font-bold uppercase text-[10px] text-slate-600 mb-3 tracking-widest">Bag Space</h4>
        <div className="h-3 bg-white border-2 border-slate-800 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-slate-800 w-[74%]"></div>
        </div>
        <p className="text-[10px] text-slate-700 font-bold italic">Your backpack is 74% full</p>
        <button className="mt-4 w-full py-2.5 bg-slate-800 text-white text-xs font-bold uppercase tracking-wider hover:scale-105 transition-transform">
          Clean Desk
        </button>
      </div>
    </aside>
  );
}

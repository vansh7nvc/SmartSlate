'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className="flex-1 min-h-screen bg-[#e5e5e5] flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 size-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-20 right-10 size-64 bg-slate-400/10 blur-[100px] rounded-full"></div>

      {/* Main Container */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        
        {/* Left: Content */}
        <div className="space-y-8 animate-slide-in">
          <div className="inline-block px-4 py-1.5 bg-white border-2 border-slate-800 journal-card text-[10px] font-black uppercase tracking-widest rotate-[-1deg]">
            Now Enrollment Open for 2026
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter italic">
            Your Desk,<br />
            <span className="text-blue-600 underline decoration-wavy decoration-blue-200">Simplified.</span>
          </h1>
          
          <p className="text-xl text-slate-600 font-medium italic max-w-lg leading-relaxed">
            Record, upload, and study. StudySlate transforms your messy class audio and documents into crisp, organized notes automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <Link 
              href="/classroom" 
              className="px-10 py-5 bg-slate-800 text-white font-black uppercase text-sm tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-3 journal-card border-none"
            >
              Enter Classroom
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            
            <button className="px-10 py-5 bg-white text-slate-800 font-black uppercase text-sm tracking-widest border-2 border-slate-800 hover:bg-slate-50 transition-all journal-card">
              Meet Teacher
            </button>
          </div>

          <div className="flex items-center gap-8 pt-8 opacity-60">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="size-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center font-bold text-[10px] grayscale">AR</div>
              ))}
            </div>
            <p className="text-xs font-bold italic text-slate-500">Joined by 12,000+ A+ Students</p>
          </div>
        </div>

        {/* Right: Hero Image / Mock Login */}
        <div className="relative group perspective">
          <div className="tape-effect absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-10 z-20 rotate-[-5deg]"></div>
          
          <div className="journal-card bg-white p-4 rotate-2 group-hover:rotate-0 transition-transform duration-700 relative overflow-hidden">
             {/* Mock Login Overlay */}
             <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] z-10 flex items-center justify-center group-hover:opacity-0 transition-opacity">
                <div className="bg-white p-8 journal-card border-2 border-slate-800 -rotate-3 space-y-6 max-w-[300px]">
                  <h3 className="text-xl font-black text-slate-900 text-center uppercase tracking-tight">Student Login</h3>
                  <div className="space-y-4">
                    <div className="border-b-2 border-dashed border-slate-200 py-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Roll Number</p>
                       <p className="text-sm font-bold text-slate-300">STU-8829-2026</p>
                    </div>
                    <Link href="/classroom" className="w-full py-4 bg-blue-600 text-white font-black uppercase text-xs tracking-widest block text-center shadow-[4px_4px_0px_0px_rgba(29,78,216,1)] hover:translate-y-1 hover:shadow-none transition-all">
                      Log In
                    </Link>
                  </div>
                </div>
             </div>

             <img 
               src="/brain/9726d92c-fd04-4219-a231-335424110bf7/studyslate_hero_graphic_1773510177910.png" 
               alt="StudySlate Hero"
               className="w-full rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700"
             />
          </div>

          {/* Floating Elements */}
          <div className="absolute -bottom-10 -left-10 journal-card p-6 bg-[#fff9c4] rotate-[-12deg] z-20 hidden xl:block">
            <p className="text-[10px] font-black text-slate-800 uppercase underline mb-2">Notice Board:</p>
            <ul className="text-[10px] font-bold text-slate-600 space-y-1 italic">
              <li>• Final Exam Prep Starts</li>
              <li>• New Flashcards feature!</li>
              <li>• Library sync complete.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Footer Text */}
      <div className="mt-20 text-center opacity-30 text-[10px] font-black uppercase tracking-widest flex items-center gap-4">
        <span>EST. 2026</span>
        <span className="size-1 bg-slate-800 rounded-full"></span>
        <span>Made for Thinkers</span>
      </div>
    </main>
  );
}

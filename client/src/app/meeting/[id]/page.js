'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function MeetingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState(null);
  const [activeTab, setActiveTab] = useState('the lesson');
  const [processing, setProcessing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [activeFlashcard, setActiveFlashcard] = useState(null);
  console.log("Current Meeting ID (Raw):", id);
  console.log("Type of ID:", typeof id);

  const fetchMeeting = async () => {
    if (!id || id === ':id') return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const normalizedId = typeof id === 'object' ? id.id : id;
      const res = await fetch(`${apiUrl}/api/meetings/${normalizedId}`);
      if (!res.ok) throw new Error('Meeting not found');
      const data = await res.json();
      setMeeting(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const processWithAI = async () => {
    if (!id || id === ':id') return;
    setProcessing(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/meetings/${id}/process`, { method: 'POST' });
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Server error (${res.status})`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          console.error('Raw error content:', errorText);
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setMeeting(data);
    } catch (err) {
      console.error("Process Error:", err);
      alert(`StudySlate AI Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const exportToMarkdown = () => {
    if (!meeting) return;
    
    const content = `# ${meeting.title}\n\n` +
      `**Date:** ${new Date(meeting.createdAt).toLocaleString()}\n` +
      `**Type:** ${meeting.fileType.toUpperCase()}\n\n` +
      `## Summary\n${meeting.summary}\n\n` +
      `## Action Items\n${meeting.actionItems.map(item => `- [ ] ${item}`).join('\n')}\n\n` +
      `## Transcript\n${meeting.transcript}`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting.title.replace(/\s+/g, '_')}_Insights.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const askAI = async (e) => {
    e.preventDefault();
    if (!chatQuery.trim() || !id || id === ':id') return;

    const currentQuery = chatQuery;
    setChatLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: currentQuery }]);
    setChatQuery('');
    
    // Normalize ID in case it's an object from useParams
    const normalizedId = typeof id === 'object' ? id.id : id;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/meetings/${normalizedId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentQuery })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'ai', content: data.answer }]);
    } catch (err) {
      console.error("Chat Error:", err);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    fetchMeeting();
  }, [id]);

  if (!meeting) return <div className="p-20 text-center font-black italic opacity-30">Opening the textbook...</div>;

  return (
    <main className="flex-1 notebook-paper p-8 md:p-12 min-h-screen hand-drawn-border">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 border-b-2 border-dashed border-slate-300 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{meeting.title}</h2>
          <p className="text-slate-600 mt-2 font-medium italic">
            Distilled from {meeting.fileType.toUpperCase()} • {new Date(meeting.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`px-6 py-3 border-2 journal-card font-black uppercase text-[10px] tracking-widest transition-all ${
              chatOpen ? 'bg-blue-600 text-white border-blue-800' : 'bg-white text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-sm mr-2">{chatOpen ? 'close' : 'forum'}</span>
            {chatOpen ? 'Close Chat' : 'Ask Lesson'}
          </button>
          {meeting.status === 'completed' && (
            <button
              onClick={exportToMarkdown}
              className="px-6 py-3 bg-white text-slate-800 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all journal-card flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">ios_share</span>
              Export
            </button>
          )}
          {(meeting.status !== 'completed' || (!meeting.flashcards?.length && !meeting.glossary?.length)) && (
            <button
              onClick={processWithAI}
              disabled={processing || meeting.status === 'processing'}
              className="px-8 py-3 bg-slate-800 text-white font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform disabled:opacity-50 journal-card border-none"
            >
              {processing || meeting.status === 'processing' ? 'Writing...' : (meeting.status === 'completed' ? 'Refresh Study Guide' : 'Explain This')}
            </button>
          )}
        </div>
      </header>

      <div className="relative flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
          {/* Paper Tabs */}
          <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
            {['the lesson', 'study guide', 'homework', 'raw notes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 journal-card text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-slate-800 text-white -translate-y-1' 
                  : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="journal-card p-10 min-h-[400px] bg-white">
          {meeting.status !== 'completed' && !processing && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 italic">draw</span>
              <h3 className="text-xl font-black text-slate-800 italic">This lesson has no notes yet.</h3>
              <p className="text-sm text-slate-400 mt-2">Click &quot;Explain This&quot; above to start the lesson.</p>
            </div>
          )}

          {meeting.status === 'completed' && activeTab === 'the lesson' && (
            <div className="max-w-none">
              <p className="text-slate-800 leading-[2.5] text-lg italic whitespace-pre-wrap font-medium">
                {meeting.summary}
              </p>
            </div>
          )}

          {meeting.status === 'completed' && activeTab === 'homework' && (
            <div className="space-y-6">
              {meeting.actionItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-xl ink-blue">edit</span>
                  <p className="text-slate-800 font-bold border-b border-dashed border-slate-300 flex-1 pb-1">{item}</p>
                </div>
              ))}
            </div>
          )}

          {meeting.status === 'completed' && activeTab === 'study guide' && (
            <div className="space-y-12">
              {/* Flashcards */}
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-900 italic underline decoration-blue-500/20">Active Recall Cards</h3>
                  <div className="rotate-12 border-2 border-red-600/20 text-red-600/20 font-black text-[8px] px-2 py-0.5 uppercase rounded-sm border-double pointer-events-none">
                    Graded A+
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {meeting.flashcards?.map((card, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveFlashcard(activeFlashcard === i ? null : i)}
                      className="h-40 perspective cursor-pointer group"
                    >
                      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${activeFlashcard === i ? 'rotate-y-180' : ''}`}>
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden journal-card p-6 bg-white flex flex-col justify-between border-slate-200">
                          <p className="text-xs font-black text-blue-600 uppercase">Question</p>
                          <p className="text-sm font-bold text-slate-800 italic leading-snug">{card.q}</p>
                          <span className="material-symbols-outlined text-slate-300 text-right">forward</span>
                        </div>
                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 journal-card p-6 bg-blue-50 border-blue-200 flex flex-col justify-between">
                          <p className="text-xs font-black text-blue-800 uppercase">Answer</p>
                          <p className="text-sm font-medium text-blue-900 whitespace-pre-wrap">{card.a}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Glossary */}
              <section className="bg-slate-50/50 p-8 rounded-lg border-2 border-dashed border-slate-200">
                <h3 className="text-xl font-black text-slate-900 mb-6 italic">Teacher&apos;s Glossary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {meeting.glossary?.map((item, i) => (
                    <div key={i}>
                      <h4 className="font-black text-blue-700 uppercase text-xs tracking-widest mb-1 italic">{item.term}</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {meeting.status === 'completed' && activeTab === 'raw notes' && (
            <div className="bg-slate-50/50 p-6 rounded border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-serif text-sm leading-relaxed whitespace-pre-wrap italic">
                {meeting.transcript}
              </p>
            </div>
          )}

          {(processing || meeting.status === 'processing') && (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
              <p className="font-black text-slate-800 italic uppercase text-xs tracking-widest animate-pulse">
                Writing down everything...
              </p>
            </div>
          )}
        </div>
        </div>
        
        {/* Chat Sidebar */}
        {chatOpen && (
          <div className="w-full xl:w-80 journal-card bg-white flex flex-col h-[600px] xl:h-[700px] shrink-0 sticky top-12">
            <div className="p-4 border-b-2 border-slate-800 bg-slate-800 text-white flex justify-between items-center">
              <h4 className="font-black text-[10px] uppercase tracking-widest">Ask StudySlate</h4>
              <button onClick={() => setChatOpen(false)} className="material-symbols-outlined text-sm">close</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {chatHistory.length === 0 && (
                <div className="text-center py-20 opacity-30 italic text-xs font-bold px-4">
                  &quot;Confused about a topic? Ask me anything about this session.&quot;
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 journal-card ${
                    msg.role === 'user' 
                      ? 'bg-slate-800 text-white rotate-1 border-none' 
                      : 'bg-white text-slate-800 -rotate-1 border-blue-100'
                  }`}>
                    <p className="text-xs font-bold leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/50 p-4 journal-card -rotate-1 animate-pulse">
                    <div className="flex gap-2">
                      <div className="size-1.5 bg-slate-400 rounded-full"></div>
                      <div className="size-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="size-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={askAI} className="p-4 border-t-2 border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-50 border-b border-slate-300 py-1 px-2 text-xs focus:outline-none focus:border-blue-500 italic"
              />
              <button type="submit" className="material-symbols-outlined text-blue-600">send</button>
            </form>
          </div>
        )}
      </div>

      <footer className="mt-12 text-center opacity-30 text-[10px] font-bold uppercase tracking-widest">
        End of Entry #{id ? (typeof id === 'string' ? id.slice(-4) : id.id?.slice(-4)) : '...'}
      </footer>
    </main>
  );
}

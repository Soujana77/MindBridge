import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';
import { analyzeJournalSentiment } from '../services/geminiService';
import { PenTool, Save, Sparkles, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { JournalEntry } from '../types';

const Journal = () => {
  const { user, addXP, addNotification } = useApp();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data && !error) setEntries(data);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsSaving(true);

    try {
      // 1. Analyze with Gemini
      const analysis = await analyzeJournalSentiment(content);

      // 2. Save to Supabase
      if (supabase) {
        const { data, error } = await supabase.from('journal_entries').insert({
          user_id: user.id,
          content: content,
          mood_sentiment: analysis.sentiment,
          ai_suggestion: analysis.suggestion
        }).select();

        if (data && !error) {
           setEntries([data[0], ...entries]);
        }
      } else {
        // Demo mode local push
        const mockEntry: JournalEntry = {
          id: Date.now(),
          content,
          mood_sentiment: analysis.sentiment,
          ai_suggestion: analysis.suggestion,
          created_at: new Date().toISOString()
        };
        setEntries([mockEntry, ...entries]);
      }

      addXP(30);
      addNotification("Journal saved + AI Insights generated!");
      setContent('');
    } catch (err) {
      console.error(err);
      addNotification("Error saving journal.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col pb-24 md:pb-6">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <PenTool className="text-pink-500" /> Mood Journal
        </h2>
        <p className="text-slate-500">Write freely. Let AI help you reflect.</p>
      </header>

      {/* Editor */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind today? (e.g., 'I felt overwhelmed by exams...')"
          className="w-full h-32 p-4 bg-slate-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-200 text-slate-700"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Entry
          </button>
        </div>
      </div>

      {/* History */}
      <h3 className="font-bold text-slate-700 mb-4">Previous Entries</h3>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {isLoading ? (
           <div className="text-center py-10 text-slate-400">Loading history...</div>
        ) : entries.length === 0 ? (
           <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
             No entries yet. Start writing above!
           </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CalendarIcon size={14} />
                  {new Date(entry.created_at).toLocaleDateString()} • {new Date(entry.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                   entry.mood_sentiment === 'Positive' || entry.mood_sentiment === 'Happy' ? 'bg-green-100 text-green-700' :
                   entry.mood_sentiment === 'Anxious' || entry.mood_sentiment === 'Stressed' ? 'bg-orange-100 text-orange-700' :
                   'bg-blue-100 text-blue-700'
                }`}>
                  {entry.mood_sentiment}
                </span>
              </div>
              <p className="text-slate-700 mb-4 whitespace-pre-wrap">{entry.content}</p>
              
              {entry.ai_suggestion && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl flex gap-3 items-start">
                   <Sparkles size={18} className="text-purple-500 mt-1 shrink-0" />
                   <div>
                     <p className="text-xs font-bold text-purple-700 uppercase mb-1">AI Insight</p>
                     <p className="text-sm text-slate-600 italic">"{entry.ai_suggestion}"</p>
                   </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Journal;
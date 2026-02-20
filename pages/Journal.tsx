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
      const analysis = await analyzeJournalSentiment(content);

      if (supabase) {
        const { data } = await supabase.from('journal_entries').insert({
          user_id: user.id,
          content,
          mood_sentiment: analysis.sentiment,
          ai_suggestion: analysis.suggestion
        }).select();

        if (data) setEntries([data[0], ...entries]);
      }

      addXP(30);
      addNotification("Journal saved ✨");
      setContent('');
    } catch (err) {
      addNotification("Error saving journal.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 md:pb-6">

      {/* HEADER */}
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <PenTool className="text-purple-500" /> Mood Journal
        </h2>
        <p className="text-slate-500">Express freely. Heal gently 💜</p>
      </header>

      {/* ✨ WRITING SECTION */}
      <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-3xl shadow-xl border border-white/40 backdrop-blur-xl">

        {/* Floating sparkles */}
        <Sparkles className="absolute top-4 right-4 text-purple-300 animate-pulse" />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write what's in your heart..."
          className="w-full h-40 p-6 bg-white/70 backdrop-blur rounded-2xl resize-none focus:outline-none focus:ring-4 focus:ring-purple-200 text-slate-700 text-lg shadow-inner transition-all"
        />

        {/* SAVE BUTTON */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving
              ? <Loader2 className="animate-spin" size={20} />
              : <Save size={20} />}
            Save Entry
          </button>
        </div>
      </div>

      {/* HISTORY */}
      <h3 className="font-bold text-slate-700 mt-8 mb-4">Your Reflections</h3>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-slate-400">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-center text-slate-400">No entries yet 🌸</div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-slate-100 shadow-lg transition hover:shadow-2xl"
            >
              <div className="flex justify-between mb-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <CalendarIcon size={14} />
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
                <span className="font-semibold text-purple-600">
                  {entry.mood_sentiment}
                </span>
              </div>

              <p className="text-slate-700 mb-4 whitespace-pre-wrap">
                {entry.content}
              </p>

              {entry.ai_suggestion && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl flex gap-3">
                  <Sparkles size={18} className="text-purple-500 mt-1" />
                  <p className="text-sm text-slate-600 italic">
                    "{entry.ai_suggestion}"
                  </p>
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
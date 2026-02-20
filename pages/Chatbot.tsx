import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, AlertTriangle, Mic, Volume2 } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { useApp } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const Chatbot = () => {
  const { chatMessages, setChatMessages, setActivePage } = useApp();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🎤 Voice input
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
    };
  };

  // 🔊 Read Aloud (ChatGPT style toggle)
  const speak = (text: string, id: string) => {
    speechSynthesis.cancel();

    if (speakingId === id) {
      setSpeakingId(null);
      return;
    }

    // Remove emojis before speaking
    const cleanText = text.replace(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
      ""
    );

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Prefer female voice
    const voices = speechSynthesis.getVoices();
    utterance.voice =
      voices.find(v => v.name.includes("Zira")) ||
      voices.find(v => v.name.includes("Samantha")) ||
      voices[0];

    utterance.rate = 0.8;
    utterance.pitch = 1.1;

    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);

    speechSynthesis.speak(utterance);
  };

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // 📤 Send message
  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = chatMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await getChatResponse(text, history);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };

      setChatMessages(prev => [...prev, botMsg]);

    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "I feel anxious",
    "Academic stress",
    "Can't sleep",
    "Feeling lonely"
  ];

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto md:p-6 pb-20 md:pb-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl flex-1 flex flex-col overflow-hidden border border-white/20">

        {/* HEADER */}
        <div className="p-4 border-b border-slate-100 flex justify-between bg-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold">MindBridge AI</h3>
              <p className="text-xs text-slate-500">Always here to listen</p>
            </div>
          </div>

          <button
            onClick={() => setActivePage("COUNSELING")}
            className="text-xs bg-rose-50 text-rose-600 px-3 py-1 rounded-full"
          >
            Emergency Help
          </button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">

          {chatMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >

              {/* Avatar */}
              {msg.role === 'model' && (
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <Bot size={16} />
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white text-slate-700 shadow-sm border'
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>

                {/* Read aloud */}
                {msg.role === 'model' && (
                  <button
                    onClick={() => speak(msg.text, msg.id)}
                    className="mt-2 text-xs text-indigo-500 flex items-center gap-1"
                  >
                    <Volume2 size={14} />
                    {speakingId === msg.id ? "Stop" : "Read aloud"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Typing animation */}
          {isLoading && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <Bot size={16} />
              </div>

              <div className="bg-white rounded-2xl p-4 flex gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* QUICK ACTIONS */}
        <div className="p-4 border-t overflow-x-auto">
          <div className="flex gap-2">
            {quickActions.map(action => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                className="px-4 py-2 bg-slate-100 rounded-full text-sm"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT */}
        <div className="p-4 bg-white">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Type your thoughts here..."
              className="flex-1 bg-slate-100 rounded-xl px-4 py-3"
            />

            <button
              onClick={() => handleSend(input)}
              className="bg-indigo-500 text-white p-3 rounded-xl"
            >
              <Send size={20} />
            </button>

            <button
              onClick={startListening}
              className="bg-slate-200 p-3 rounded-xl"
            >
              <Mic size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Chatbot;
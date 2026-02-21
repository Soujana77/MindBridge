import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Mic, Volume2, Heart } from "lucide-react";
import { getChatResponse } from "../services/geminiService";
import { useApp } from "../context/AppContext";
import ReactMarkdown from "react-markdown";

/* ---------------- TYPES ---------------- */
interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

/* ---------------- AFFIRMATIONS ---------------- */
const affirmations = [
  "You’re safe here. This is a judgment-free space.",
  "Your feelings are valid, even if they’re hard to explain.",
  "Nothing you share here is judged or shared.",
  "You can take your time — there’s no rush.",
  "You’re not weak for feeling this way.",
  "It’s okay to ask for help. You’re doing your best.",
  "Every small step you take is a win.",
  "You have the strength to get through this.",
  "Breathe. You're doing better than you think.",
  "It's okay to not have all the answers right now.",
  "You are enough, exactly as you are.",
  "Be patient with yourself. Healing takes time.",
];

/* ---------------- ANIMATIONS ---------------- */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const bubble = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

const affirmationAnim = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/* ---------------- COMPONENT ---------------- */
const Chatbot = () => {
  const { chatMessages, setChatMessages, setActivePage } = useApp();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* 🔁 Rotate affirmations */
  useEffect(() => {
    const interval = setInterval(() => {
      setAffirmationIndex((i) => (i + 1) % affirmations.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  /* 🎤 Voice input */
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

  /* 🔊 Read aloud */
  const speak = (text: string, id: string) => {
    speechSynthesis.cancel();

    if (speakingId === id) {
      setSpeakingId(null);
      return;
    }

    const cleanText = text.replace(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
      ""
    );

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = speechSynthesis.getVoices();

    utterance.voice =
      voices.find((v) => v.name.includes("Zira")) ||
      voices.find((v) => v.name.includes("Samantha")) ||
      voices[0];

    utterance.rate = 0.8;
    utterance.pitch = 1.1;

    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);

    speechSynthesis.speak(utterance);
  };

  /* 🔽 Auto-scroll */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isLoading]);

  /* 📤 Send message */
  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const history = chatMessages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    try {
      const responseText = await getChatResponse(text, history);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: responseText,
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "I feel anxious",
    "Academic stress",
    "Can't sleep",
    "Feeling lonely",
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="h-[calc(100vh-60px)] flex flex-col max-w-4xl mx-auto md:p-4 pb-4"
    >
      {/* CHAT CARD */}
      <motion.div
        variants={item}
        className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-indigo-100/40
        flex-1 flex flex-col overflow-hidden border border-white relative z-10"
      >
        {/* HEADER */}
        <motion.div
          variants={item}
          className="p-5 border-b border-slate-100 flex justify-between bg-white/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">MindBridge AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-xs text-slate-500 font-medium">Always here to listen</p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePage("COUNSELING")}
            className="text-xs bg-rose-50 text-rose-600 font-bold px-4 py-2 rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors"
          >
            Emergency Help
          </motion.button>
        </motion.div>

        {/* MESSAGES */}
        <motion.div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
          <AnimatePresence>
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                variants={bubble}
                initial="hidden"
                animate="show"
                exit="exit"
                className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {msg.role === "model" && (
                  <div className="w-8 h-8 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-indigo-500 mb-1">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-[24px] p-4 shadow-sm ${msg.role === "user"
                    ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-none"
                    : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                    }`}
                >
                  <div className="prose prose-slate prose-sm max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>

                  {msg.role === "model" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => speak(msg.text, msg.id)}
                      className="mt-3 text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-600 flex items-center gap-1.5 px-2 py-1 bg-indigo-50/50 rounded-lg transition-colors"
                    >
                      <Volume2 size={12} />
                      {speakingId === msg.id ? "Stop" : "Read aloud"}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-indigo-500 mb-1">
                <Bot size={16} />
              </div>
              <div className="bg-white rounded-[24px] rounded-bl-none p-4 flex gap-1.5 border border-slate-100 shadow-sm">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </motion.div>

        {/* QUICK ACTIONS */}
        <div className="px-6 py-3 border-t border-slate-50 bg-white/50 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {quickActions.map((action) => (
              <motion.button
                key={action}
                whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSend(action)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 whitespace-nowrap shadow-sm hover:border-indigo-200 transition-all"
              >
                {action}
              </motion.button>
            ))}
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="p-6 bg-white border-t border-slate-50 relative">
          <div className="flex gap-3 relative z-20 mb-6">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="What's on your mind?"
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all rounded-2xl px-5 py-4 text-slate-700 font-medium outline-none shadow-inner"
            />

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={startListening}
                className="bg-slate-50 text-slate-500 hover:text-indigo-600 border border-slate-200 w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
              >
                <Mic size={22} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, translateZ: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSend(input)}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200"
              >
                <Send size={22} />
              </motion.button>
            </div>
          </div>

          {/* 🌱 AFFIRMATION STRIP — Integrated at bottom-center of card */}
          <div className="flex justify-center pb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={affirmationIndex}
                {...affirmationAnim}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-indigo-50/50 to-violet-50/50 backdrop-blur-md px-8 py-2 rounded-full shadow-sm text-xs text-slate-400 flex items-center gap-3 border border-indigo-100/30"
              >
                <Heart className="text-rose-300 fill-rose-50" size={12} />
                <span className="font-medium tracking-wide italic">
                  {affirmations[affirmationIndex]}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Chatbot;
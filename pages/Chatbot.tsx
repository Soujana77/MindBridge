import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Mic, Volume2 } from "lucide-react";
import { getChatResponse } from "../services/geminiService";
import { useApp } from "../context/AppContext";
import ReactMarkdown from "react-markdown";

/* ---------------- TYPES ---------------- */
interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

/* ---------------- ANIMATION VARIANTS ---------------- */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
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

const Chatbot = () => {
  const { chatMessages, setChatMessages, setActivePage } = useApp();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      className="h-full flex flex-col max-w-4xl mx-auto md:p-6 pb-20 md:pb-6"
    >
      <motion.div
        variants={item}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl
        flex-1 flex flex-col overflow-hidden border border-white/20"
      >
        {/* HEADER */}
        <motion.div
          variants={item}
          className="p-4 border-b border-slate-100 flex justify-between bg-white/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold">MindBridge AI</h3>
              <p className="text-xs text-slate-500">
                Always here to listen
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setActivePage("COUNSELING")}
            className="text-xs bg-rose-50 text-rose-600 px-3 py-1 rounded-full"
          >
            Emergency Help
          </motion.button>
        </motion.div>

        {/* MESSAGES */}
        <motion.div
          variants={container}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
        >
          <AnimatePresence>
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                variants={bubble}
                initial="hidden"
                animate="show"
                exit="exit"
                className={`flex items-end gap-2 ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.role === "model" && (
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === "user"
                      ? "bg-indigo-500 text-white"
                      : "bg-white text-slate-700 shadow-sm border"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>

                  {msg.role === "model" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => speak(msg.text, msg.id)}
                      className="mt-2 text-xs text-indigo-500 flex items-center gap-1"
                    >
                      <Volume2 size={14} />
                      {speakingId === msg.id
                        ? "Stop"
                        : "Read aloud"}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end gap-2"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <Bot size={16} />
              </div>

              <div className="bg-white rounded-2xl p-4 flex gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </motion.div>
          )}

          <div ref={scrollRef} />
        </motion.div>

        {/* QUICK ACTIONS */}
        <motion.div
          variants={item}
          className="p-4 border-t overflow-x-auto"
        >
          <div className="flex gap-2">
            {quickActions.map((action) => (
              <motion.button
                key={action}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSend(action)}
                className="px-4 py-2 bg-slate-100 rounded-full text-sm"
              >
                {action}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* INPUT */}
        <motion.div variants={item} className="p-4 bg-white">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSend(input)
              }
              placeholder="Type your thoughts here..."
              className="flex-1 bg-slate-100 rounded-xl px-4 py-3"
            />

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSend(input)}
              className="bg-indigo-500 text-white p-3 rounded-xl"
            >
              <Send size={20} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={startListening}
              className="bg-slate-200 p-3 rounded-xl"
            >
              <Mic size={20} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Chatbot;
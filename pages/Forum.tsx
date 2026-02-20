import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { supabase } from "../services/supabaseClient";
import {
  Users,
  MessageSquare,
  Heart,
  Send,
  Loader2,
} from "lucide-react";
import { ForumPost } from "../types";

/* ---------------- ANIMATION VARIANTS ---------------- */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Forum = () => {
  const { user, addNotification } = useApp();

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTag, setSelectedTag] = useState("General");

  const tags = ["General", "Stress", "Exams", "Relationships", "Anxiety"];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("forum_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && !error) setPosts(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!newPost.trim()) return;
    setSubmitting(true);

    try {
      const alias = `Student_${Math.floor(Math.random() * 9000) + 1000}`;

      if (supabase) {
        const { data, error } = await supabase
          .from("forum_posts")
          .insert({
            user_id: user.id,
            author_alias: alias,
            content: newPost,
            tags: [selectedTag],
            upvotes: 0,
          })
          .select();

        if (data && !error) {
          setPosts([data[0], ...posts]);
        }
      } else {
        const mock: ForumPost = {
          id: Date.now(),
          user_id: user.id,
          author_alias: alias,
          content: newPost,
          tags: [selectedTag],
          upvotes: 0,
          created_at: new Date().toISOString(),
        };
        setPosts([mock, ...posts]);
      }

      setNewPost("");
      addNotification("Posted anonymously!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (id: number, currentVotes: number) => {
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, upvotes: currentVotes + 1 } : p
      )
    );

    if (supabase) {
      await supabase
        .from("forum_posts")
        .update({ upvotes: currentVotes + 1 })
        .eq("id", id);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 max-w-4xl mx-auto h-full flex flex-col pb-24 md:pb-6"
    >
      {/* HEADER */}
      <motion.header variants={item} className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="text-indigo-500" /> Peer Support Forum
        </h2>
        <p className="text-slate-500">
          Anonymous support from your campus community.
        </p>
      </motion.header>

      {/* POST CREATOR */}
      <motion.div
        variants={item}
        className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8"
      >
        <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
          {tags.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
              ${
                selectedTag === tag
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder={`Share something about ${selectedTag}... (Anonymous)`}
            className="flex-1 bg-slate-50 rounded-xl px-4 py-3
            focus:ring-2 focus:ring-indigo-300 outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={submitting || !newPost.trim()}
            className="bg-indigo-500 text-white p-3 rounded-xl disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* FEED */}
      <motion.div
        variants={container}
        className="flex-1 overflow-y-auto space-y-4"
      >
        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-slate-400" />
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              variants={item}
              whileHover={{ scale: 1.01 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100
                    rounded-full flex items-center justify-center
                    text-indigo-500 text-xs font-bold"
                  >
                    {post.author_alias.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      {post.author_alias}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="bg-slate-100 text-slate-500 text-[10px]
                      px-2 py-1 rounded-full uppercase tracking-wide font-bold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-slate-700 text-lg mb-4">
                {post.content}
              </p>

              <div className="flex items-center gap-4 border-t border-slate-50 pt-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleUpvote(post.id, post.upvotes)}
                  className="flex items-center gap-1 text-slate-400 hover:text-pink-500 transition-colors"
                >
                  <Heart size={18} />
                  <span className="text-sm font-semibold">
                    {post.upvotes} Support
                  </span>
                </motion.button>

                <button className="flex items-center gap-1 text-slate-400 hover:text-indigo-500">
                  <MessageSquare size={18} />
                  <span className="text-sm font-semibold">Reply</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default Forum;
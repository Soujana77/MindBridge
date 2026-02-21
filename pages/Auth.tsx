import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../services/supabaseClient";
import { useApp } from "../context/AppContext";

const Auth: React.FC = () => {
  const { setActivePage, addNotification } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      addNotification("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        addNotification(error.message);
        return;
      }

      if (data.session) {
        addNotification("Login successful 🎉");
        setActivePage("DASHBOARD");
      }
    } catch (err) {
      console.error(err);
      addNotification("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-200/30 rounded-full blur-[120px]" />

      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        className="
          bg-white/80 backdrop-blur-xl
          p-10 rounded-[40px]
          shadow-2xl shadow-violet-200/40
          w-full max-w-md space-y-10
          border border-white
          relative z-10
          transition-all duration-300
          hover:shadow-violet-300/50
        "
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-violet-200">
            <span className="text-white text-3xl font-bold">M</span>
          </div>

          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-lg">
            Your wellness journey continues here
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-5 py-4 rounded-2xl
                bg-white/70 focus:bg-white
                border border-slate-200
                focus:ring-4 focus:ring-violet-300
                outline-none transition
              "
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full px-5 py-4 rounded-2xl
                bg-white/70 focus:bg-white
                border border-slate-200
                focus:ring-4 focus:ring-violet-300
                outline-none transition
              "
            />
          </div>
        </div>

        {/* PRIMARY LOGIN BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-5 text-xl font-extrabold rounded-2xl
            text-white
            bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900
            shadow-xl shadow-indigo-900/40
            hover:shadow-2xl hover:shadow-indigo-900/60
            hover:scale-[1.03]
            active:scale-[0.97]
            transition-all duration-300
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? "Logging in..." : "Login to MindBridge"}
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-slate-500 pt-2">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => setActivePage("SIGNUP")}
            className="text-violet-600 font-extrabold hover:underline"
          >
            Create an account
          </button>
        </p>
      </motion.form>
    </div>
  );
};

export default Auth;
import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useApp } from "../context/AppContext";

const Auth: React.FC = () => {
  const { setActivePage, addNotification } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ CRITICAL

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
        setActivePage("DASHBOARD"); // ✅ NAVIGATION
      }
    } catch (err) {
      console.error(err);
      addNotification("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-slate-500">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => setActivePage("SIGNUP")}
            className="text-indigo-600 underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Auth;

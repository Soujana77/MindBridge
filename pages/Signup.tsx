import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { motion } from "framer-motion";

const Signup = ({ onSuccess }: any) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    age: "",
    gender: "",
    college: "",
    course: "",
    year: "",
    goal: "",
  });

  // 📅 Calculate age from DOB
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDOBChange = (e: any) => {
    const dob = e.target.value;
    const age = calculateAge(dob);

    setForm({
      ...form,
      dob,
      age: age.toString(),
    });
  };

  const handleSignup = async () => {
    if (!form.dob) {
      alert("Please select Date of Birth");
      return;
    }

    const age = calculateAge(form.dob);

    if (age < 12) {
      alert("You must be at least 12 years old to use MindBridge.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;

    await supabase.from("profiles").insert({
      id: userId,
      name: form.name,
      dob: form.dob,
      age: age,
      gender: form.gender,
      college: form.college,
      course: form.course,
      year: form.year,
      goal: form.goal,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`,
      level: 1,
      xp: 0,
      streak: 0,
    });

    alert("Account created successfully 💜");
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen py-12 flex items-center justify-center bg-slate-50 px-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-200/30 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.005 }}
        className="
          bg-white/80 backdrop-blur-xl
          p-10 rounded-[40px]
          shadow-2xl shadow-violet-200/40
          w-full max-w-2xl space-y-10
          border border-white
          relative z-10
          transition-all duration-300
          hover:shadow-violet-300/50
        "
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Join MindBridge
          </h2>
          <p className="text-slate-500 text-lg">
            Your personalized path to mental wellness starts here
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input label="Full Name" name="name" placeholder="John Doe" onChange={handleChange} />
          <Input label="Email Address" name="email" placeholder="john@example.com" onChange={handleChange} />
          <Input label="Password" name="password" type="password" placeholder="••••••••" onChange={handleChange} />

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900 ml-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleDOBChange}
              className="input-mindbridge bg-white/70 focus:bg-white"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-600 ml-1 opacity-50">
              Calculated Age
            </label>
            <input
              value={form.age}
              disabled
              className="input-mindbridge bg-slate-50/50 border-dashed cursor-not-allowed text-slate-400"
            />
          </div>

          <Select label="Gender" name="gender" onChange={handleChange} options={["Male", "Female", "Other"]} />
          <Input label="College Name" name="college" placeholder="University of..." onChange={handleChange} />

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900 ml-1">
              Course / Year
            </label>
            <div className="flex gap-2">
              <input
                name="course"
                placeholder="B.Tech"
                onChange={handleChange}
                className="input-mindbridge flex-1 bg-white/70 focus:bg-white"
              />
              <select
                name="year"
                onChange={handleChange}
                className="input-mindbridge w-32 bg-white/70 focus:bg-white"
              >
                <option value="">Year</option>
                <option>1st</option>
                <option>2nd</option>
                <option>3rd</option>
                <option>4th</option>
              </select>
            </div>
          </div>
        </div>

        <Select
          label="Primary Wellness Goal"
          name="goal"
          onChange={handleChange}
          options={[
            "Reduce stress",
            "Improve sleep",
            "Improve focus",
            "Emotional support",
          ]}
        />

        {/* PRIMARY SIGNUP BUTTON */}
        <button
          onClick={handleSignup}
          className="
            w-full py-5 text-xl font-extrabold rounded-2xl
            text-white
            bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900
            shadow-xl shadow-indigo-900/40
            hover:shadow-2xl hover:shadow-indigo-900/60
            hover:scale-[1.03]
            active:scale-[0.97]
            transition-all duration-300
            mt-6
          "
        >
          Create Your Profile
        </button>

        <p className="text-sm text-center text-slate-500">
          Already lead a mindful life?{" "}
          <button
            type="button"
            onClick={() => onSuccess && onSuccess()}
            className="text-violet-600 font-extrabold hover:underline"
          >
            Log in here
          </button>
        </p>
      </motion.div>
    </div>
  );
};

/* ---------- Small Reusable Inputs ---------- */

const Input = ({ label, ...props }: any) => (
  <div className="space-y-3">
    <label className="block text-sm font-bold text-slate-900 ml-1">
      {label}
    </label>
    <input
      {...props}
      className="input-mindbridge bg-white/70 focus:bg-white"
    />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div className="space-y-3">
    <label className="block text-sm font-bold text-slate-900 ml-1">
      {label}
    </label>
    <select
      {...props}
      className="input-mindbridge bg-white/70 focus:bg-white"
    >
      <option value="">Select</option>
      {options.map((o: string) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

export default Signup;
import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";

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
    goal: ""
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

  // 🔄 Handle input change
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 📅 DOB change (auto age)
  const handleDOBChange = (e: any) => {
    const dob = e.target.value;
    const age = calculateAge(dob);

    setForm({
      ...form,
      dob,
      age: age.toString()
    });
  };

  // 🚀 SIGNUP FUNCTION
  const handleSignup = async () => {

    if (!form.dob) {
      alert("Please select Date of Birth");
      return;
    }

    const age = calculateAge(form.dob);

    // 🚫 Block under 12
    if (age < 12) {
      alert("You must be at least 12 years old to use MindBridge.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;

    // 👤 Create profile row
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
      streak: 0
    });

    alert("Account created successfully 💜");

    if (onSuccess) onSuccess(); // ⬅️ go back to Login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-[500px] space-y-3">

        <h2 className="text-2xl font-bold text-center">
          Create Your MindBridge Profile
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="input"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="input"
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          className="input"
        />

        {/* DOB */}
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleDOBChange}
            className="input"
          />
        </div>

        {/* AGE */}
        <div>
          <label>Age</label>
          <input
            value={form.age}
            disabled
            className="input bg-gray-100"
          />
        </div>

        <select name="gender" onChange={handleChange} className="input">
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          name="college"
          placeholder="College Name"
          onChange={handleChange}
          className="input"
        />

        <input
          name="course"
          placeholder="Course / Branch"
          onChange={handleChange}
          className="input"
        />

        <select name="year" onChange={handleChange} className="input">
          <option value="">Year</option>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
        </select>

        <select name="goal" onChange={handleChange} className="input">
          <option value="">Main Goal</option>
          <option>Reduce stress</option>
          <option>Improve sleep</option>
          <option>Improve focus</option>
          <option>Emotional support</option>
        </select>

        <button
          onClick={handleSignup}
          className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
        >
          Create Account
        </button>

        {/* 🔁 Back to Login */}
        <p className="text-sm text-center text-slate-500 mt-3">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              if (onSuccess) onSuccess();
            }}
            className="text-indigo-600 hover:underline font-medium"
          >
            Log in
          </button>
        </p>

      </div>
    </div>
  );
};

export default Signup;
import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { supabase } from "../services/supabaseClient";
import { Save, Lock, User, Calendar, GraduationCap, Target } from "lucide-react";

const Profile = () => {

  const { user } = useApp();

  // Avatar state
  const [avatar, setAvatar] = useState(
    user.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=default`
  );

  // Edit mode toggle
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    age: "",
    dob: "",
    gender: "",
    college: "",
    course: "",
    year: "",
    goal: ""
  });

  const [password, setPassword] = useState("");

  useEffect(() => {
    setAvatar(
      user.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=default`
    );

    setForm({
      name: user.name || "",
      age: (user as any).age || "",
      dob: (user as any).dob || "",
      gender: (user as any).gender || "",
      college: (user as any).college || "",
      course: (user as any).course || "",
      year: (user as any).year || "",
      goal: (user as any).goal || ""
    });

  }, [user]);

  // Generate new avatar
  const generateAvatar = () => {
    const newAvatar =
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
    setAvatar(newAvatar);
  };

  // Handle form change
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Save profile
  const saveProfile = async () => {

    if (!supabase || !user.id) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        ...form,
        avatar: avatar
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile updated successfully 💜");
    window.location.reload();
  };

  // Change password
  const changePassword = async () => {

    if (!password) {
      alert("Enter new password");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully");
    setPassword("");
  };

  return (

    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-lg flex items-center gap-6">

        <div className="flex flex-col items-center">

          <img
            src={avatar}
            className="w-24 h-24 rounded-full border-4 border-white"
          />

          <button
            onClick={generateAvatar}
            className="bg-white text-indigo-600 px-3 py-1 rounded-lg mt-2 text-sm hover:bg-gray-100"
          >
            Generate Avatar
          </button>

        </div>

        <div>

          <h1 className="text-2xl font-bold">
            {form.name || "User"}
          </h1>

          <p className="opacity-80">
            Level {user.level} • {user.xp} XP • Streak {user.streak}
          </p>

        </div>

      </div>

      {/* PROFILE DETAILS */}
      <div className="grid grid-cols-2 gap-4">

        <ProfileCard icon={<User size={18}/>} label="Age" name="age" value={form.age} editMode={editMode} onChange={handleChange} />
        <ProfileCard icon={<Calendar size={18}/>} label="Date of Birth" name="dob" value={form.dob} editMode={editMode} onChange={handleChange} />
        <ProfileCard icon={<User size={18}/>} label="Gender" name="gender" value={form.gender} editMode={editMode} onChange={handleChange} />
        <ProfileCard icon={<GraduationCap size={18}/>} label="College" name="college" value={form.college} editMode={editMode} onChange={handleChange} />
        <ProfileCard icon={<GraduationCap size={18}/>} label="Course" name="course" value={form.course} editMode={editMode} onChange={handleChange} />
        <ProfileCard icon={<GraduationCap size={18}/>} label="Year" name="year" value={form.year} editMode={editMode} onChange={handleChange} />
        <ProfileCard icon={<Target size={18}/>} label="Goal" name="goal" value={form.goal} editMode={editMode} onChange={handleChange} />

      </div>

      {/* EDIT BUTTON */}
      <button
        onClick={() => setEditMode(!editMode)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        {editMode ? "Cancel Editing" : "Edit Profile"}
      </button>

      {/* FLOATING SAVE BUTTON ⭐ */}
      {editMode && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={saveProfile}
            className="bg-green-600 text-white px-8 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-green-700 transition"
          >
            <Save size={20}/>
            Save Changes
          </button>
        </div>
      )}

      {/* PASSWORD CHANGE */}
      <div className="bg-white p-6 rounded-xl shadow-sm">

        <h2 className="font-bold mb-3 flex items-center gap-2">
          <Lock size={18}/>
          Change Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />

        <button
          onClick={changePassword}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Update Password
        </button>

      </div>

    </div>

  );

};

// PROFILE CARD COMPONENT
const ProfileCard = ({
  label,
  value,
  editMode,
  name,
  onChange,
  icon
}: any) => {

  return (

    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">

      <div className="text-sm text-slate-500 flex items-center gap-2">
        {icon}
        {label}
      </div>

      {editMode ? (

        <input
          name={name}
          value={value}
          onChange={onChange}
          className="border p-2 rounded w-full mt-2"
        />

      ) : (

        <div className="text-lg font-semibold mt-2 text-indigo-600">
          {value || "Not set"}
        </div>

      )}

    </div>

  );

};

export default Profile;

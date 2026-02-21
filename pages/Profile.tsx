import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { supabase } from "../services/supabaseClient";
import {
  Save,
  Lock,
  User,
  Calendar,
  GraduationCap,
  Target,
} from "lucide-react";

/* ---------------- ANIMATION VARIANTS ---------------- */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Profile = () => {
  const { user } = useApp();

  const [avatar, setAvatar] = useState(
    user.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=default`
  );

  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    dob: "",
    gender: "",
    college: "",
    course: "",
    year: "",
    goal: "",
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
      goal: (user as any).goal || "",
    });
  }, [user]);

  const generateAvatar = () => {
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
    setAvatar(newAvatar);
  };

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    if (!supabase || !user.id) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        ...form,
        avatar: avatar,
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile updated successfully 💜");
    window.location.reload();
  };

  const changePassword = async () => {
    if (!password) {
      alert("Enter new password");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully");
    setPassword("");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 max-w-5xl mx-auto space-y-6"
    >
      {/* HEADER */}
      <motion.div
        variants={item}
        className="bg-gradient-to-r from-violet-600 to-fuchsia-600
        text-white p-6 rounded-xl shadow-lg flex items-center gap-6"
      >
        <div className="flex flex-col items-center">
          <motion.img
            src={avatar}
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-full border-4 border-white"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={generateAvatar}
            className="bg-white text-slate-900 px-3 py-1 rounded-lg mt-2 text-sm font-bold shadow-sm"
          >
            Generate Avatar
          </motion.button>
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            {form.name || "User"}
          </h1>
          <p className="opacity-80">
            Level {user.level} • {user.xp} XP • Streak {user.streak}
          </p>
        </div>
      </motion.div>

      {/* PROFILE DETAILS */}
      <motion.div
        variants={container}
        className="grid grid-cols-2 gap-4"
      >
        <ProfileCard
          icon={<User size={18} />}
          label="Age"
          name="age"
          value={form.age}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileCard
          icon={<Calendar size={18} />}
          label="Date of Birth"
          name="dob"
          value={form.dob}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileCard
          icon={<User size={18} />}
          label="Gender"
          name="gender"
          value={form.gender}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileCard
          icon={<GraduationCap size={18} />}
          label="College"
          name="college"
          value={form.college}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileCard
          icon={<GraduationCap size={18} />}
          label="Course"
          name="course"
          value={form.course}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileCard
          icon={<GraduationCap size={18} />}
          label="Year"
          name="year"
          value={form.year}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileCard
          icon={<Target size={18} />}
          label="Goal"
          name="goal"
          value={form.goal}
          editMode={editMode}
          onChange={handleChange}
        />
      </motion.div>

      {/* EDIT BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setEditMode(!editMode)}
        className="bg-violet-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-violet-700 transition"
      >
        {editMode ? "Cancel Editing" : "Edit Profile"}
      </motion.button>

      {/* FLOATING SAVE BUTTON */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={saveProfile}
              className="bg-green-600 text-white px-8 py-3
              rounded-full shadow-lg flex items-center gap-2"
            >
              <Save size={20} />
              Save Changes
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PASSWORD CHANGE */}
      <motion.div
        variants={item}
        className="bg-white p-6 rounded-xl shadow-sm"
      >
        <h2 className="font-bold mb-3 flex items-center gap-2">
          <Lock size={18} />
          Change Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={changePassword}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Update Password
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

/* ---------------- PROFILE CARD ---------------- */
const ProfileCard = ({
  label,
  value,
  editMode,
  name,
  onChange,
  icon,
}: any) => {
  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-slate-400">{icon}</span>
        <label className="text-sm text-slate-500 font-semibold">{label}</label>
      </div>

      {editMode ? (
        <input
          name={name}
          value={value || ""}
          onChange={onChange}
          className="input-mindbridge border-2 border-slate-900"
        />
      ) : (
        <div className="text-lg font-bold text-slate-900 ml-1">
          {value || "Not set"}
        </div>
      )}
    </motion.div>
  );
};

export default Profile;
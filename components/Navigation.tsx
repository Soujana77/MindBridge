import React from 'react';
import {
  Home,
  MessageCircle,
  PenTool,
  Wind,
  Users,
  Calendar,
  LayoutDashboard,
  Moon,
  Clock,
  LogOut
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { PageView } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';

interface NavItemProps {
  page: PageView;
  icon: any;
  label: string;
}

const NavItem = ({ page, icon: Icon, label }: NavItemProps) => {
  const { activePage, setActivePage } = useApp();
  const isActive = activePage === page;

  return (
    <button
      onClick={() => setActivePage(page)}
      className={`flex items-center gap-3 p-3 rounded-xl transition ${
        isActive
          ? "bg-indigo-500 text-white"
          : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      <Icon size={22} />
      {label}
    </button>
  );
};

export const Sidebar = () => {
  const { user, setActivePage } = useApp();

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="hidden md:flex flex-col w-64 h-screen bg-white border-r p-6 fixed left-0 top-0">

      {/* NAV */}
      <nav className="flex-1 space-y-2">

        <NavItem page="DASHBOARD" icon={Home} label="Dashboard" />
        <NavItem page="CHATBOT" icon={MessageCircle} label="AI Companion" />
        <NavItem page="JOURNAL" icon={PenTool} label="Journal" />
        <NavItem page="BREATHE" icon={Wind} label="Breathe" />
        <NavItem page="FOCUS" icon={Clock} label="Focus Timer" />
        <NavItem page="SLEEP" icon={Moon} label="Sleep Coach" />
        <NavItem page="PEER" icon={Users} label="Peer Support" />
        <NavItem page="COUNSELING" icon={Calendar} label="Counseling" />
        <NavItem page="ADMIN" icon={LayoutDashboard} label="Admin" />

      </nav>

      {/* PROFILE */}
      <div
  onClick={() => setActivePage("PROFILE")}
  className="cursor-pointer mt-6 flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition"
>
  {/* Avatar */}
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-emerald-400 flex items-center justify-center text-white font-bold">
    {(user.name || "U")[0]}
  </div>

  {/* Name */}
  <p className="font-semibold text-slate-700">
    {user.name || "User"}
  </p>
</div>


      {/* LOGOUT */}
      <button
  onClick={handleLogout}
  className="mt-4 flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition"
>
  <LogOut size={18} />
  Logout
</button>

    </div>
  );
};

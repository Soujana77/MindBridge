import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { INITIAL_ACHIEVEMENTS, LEVEL_THRESHOLDS } from '../constants';
import { supabase } from '../services/supabaseClient';

/* ================= TYPES ================= */

// ⭐ Define User type here (since you don't have types.ts)

export interface MoodEntry {
  date: string;
  value: number;
  tags: string[];
}

export type PageView =
  | "AUTH"
  | "SIGNUP"
  | "DASHBOARD"
  | "PROFILE"
  | "CHATBOT"
  | "JOURNAL"
  | "BREATHE"
  | "FOCUS"
  | "SLEEP"
  | "PEER"
  | "COUNSELING"
  | "GAMES";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;

  // ⭐ Profile fields from signup
  age?: number;
  dob?: string;
  gender?: string;
  college?: string;
  course?: string;
  year?: string;
  goal?: string;

  level: number;
  xp: number;
  streak: number;
  moodHistory: MoodEntry[];

  pet: {
    name: string;
    health: number;
    happiness: number;
    status: string;
    evolutionStage: number;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

/* ================= CONTEXT ================= */

interface AppContextType {
  user: User;
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  addXP: (amount: number) => void;
  updateMood: (mood: number) => void;
  toggleAchievement: (id: string) => void;
  achievements: Achievement[];
  notifications: string[];
  addNotification: (msg: string) => void;

  chatMessages: Message[];
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const defaultUser: User = {
  id: '',
  name: '',
  avatar: '',
  level: 1,
  xp: 0,
  streak: 0,
  moodHistory: [],
  pet: {
    name: 'Leafy',
    health: 80,
    happiness: 75,
    status: 'Neutral',
    evolutionStage: 1
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<User>(defaultUser);

  // ⭐ Start app at login page
  const [activePage, setActivePage] = useState<PageView>('AUTH');

  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [notifications, setNotifications] = useState<string[]>([]);

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm your MindBridge companion. I'm here to listen without judgment. How are you feeling today?"
    }
  ]);

  /* ================= LOAD USER ================= */

  useEffect(() => {

    if (!supabase) return;

    const loadUser = async () => {

      const { data } = await supabase.auth.getUser();
      const authUser = data.user;

      if (!authUser) {
        setUser(defaultUser);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar,

          // ⭐ LOAD SIGNUP DETAILS
          age: profile.age,
          dob: profile.dob,
          gender: profile.gender,
          college: profile.college,
          course: profile.course,
          year: profile.year,
          goal: profile.goal,

          level: profile.level,
          xp: profile.xp,
          streak: profile.streak,
          moodHistory: [],
          pet: profile.pet
        });

        // ⭐ Go to dashboard after login
        setActivePage("DASHBOARD");
      }
    };

    loadUser();

    const { data: listener } =
      supabase.auth.onAuthStateChange(() => {
        loadUser();
      });

    return () => listener.subscription.unsubscribe();

  }, []);

  /* ================= FUNCTIONS ================= */

  const addNotification = (msg: string) => {
    setNotifications(prev => [...prev, msg]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 4000);
  };

  const addXP = async (amount: number) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      let newLevel = prev.level;

      if (newXP >= LEVEL_THRESHOLDS[prev.level]) {
        newLevel += 1;
        addNotification(`Level Up! You are now level ${newLevel}`);
      } else {
        addNotification(`+${amount} XP gained`);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        pet: {
          ...prev.pet,
          happiness: Math.min(100, prev.pet.happiness + 5)
        }
      };
    });
  };

  const updateMood = async (mood: number) => {
    const newEntry: MoodEntry = {
      date: new Date().toISOString(),
      value: mood,
      tags: []
    };

    setUser(prev => ({
      ...prev,
      moodHistory: [...prev.moodHistory, newEntry],
      streak: prev.streak + 1
    }));

    addXP(20);
    addNotification("Daily check-in complete!");

    if (supabase) {
      await supabase.from('mood_logs').insert({
        user_id: user.id,
        value: mood,
        tags: []
      });
    }
  };

  const toggleAchievement = (id: string) => {
    setAchievements(prev =>
      prev.map(a => a.id === id ? { ...a, unlocked: true } : a)
    );
  };

  return (
    <AppContext.Provider value={{
      user,
      activePage,
      setActivePage,
      addXP,
      updateMood,
      toggleAchievement,
      achievements,
      notifications,
      addNotification,
      chatMessages,
      setChatMessages
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

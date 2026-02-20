export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  moodHistory: MoodEntry[];
  pet: PetState;
}

export interface PetState {
  name: string;
  health: number; // 0-100
  happiness: number; // 0-100
  status: 'Happy' | 'Neutral' | 'Tired' | 'Wilted';
  evolutionStage: 1 | 2 | 3;
}

export interface MoodEntry {
  date: string;
  value: number; // 1-5
  tags: string[];
  note?: string;
}

export interface ForumPost {
  id: number;
  user_id: string;
  author_alias: string;
  content: string;
  tags: string[];
  upvotes: number;
  created_at: string;
}

export interface JournalEntry {
  id: number;
  content: string;
  mood_sentiment: string;
  ai_suggestion: string;
  created_at: string;
}

export interface Counselor {
  id: string;
  name: string;
  specialty: string;
  availableSlots: string[];
  rating: number;
  imageUrl: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

//////////////////////////////////////////////
// ⭐⭐⭐ FINAL PAGE VIEW (VERY IMPORTANT) ⭐⭐⭐
//////////////////////////////////////////////

export type PageView =
  | "LANDING"
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

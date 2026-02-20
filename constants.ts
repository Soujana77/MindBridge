import { Achievement, Counselor, ForumPost } from './types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: '7-Day Streak', description: 'Complete check-ins for 7 days in a row', icon: '🔥', unlocked: false },
  { id: '2', title: 'Zen Master', description: 'Complete 10 breathing sessions', icon: '🧘', unlocked: false },
  { id: '3', title: 'Journalist', description: 'Write 5 journal entries', icon: '✍️', unlocked: true },
  { id: '4', title: 'Sleep Champion', description: 'Track sleep for a week', icon: '😴', unlocked: false },
];

export const MOCK_POSTS: ForumPost[] = [
  { 
    id: 1, 
    user_id: 'user_01',
    author_alias: 'SunnyCloud', 
    content: 'Finals week is crushing me. How do you guys manage caffeine jitters?', 
    tags: ['Exams', 'Stress'], 
    upvotes: 24, 
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() 
  },
  { 
    id: 2, 
    user_id: 'user_02',
    author_alias: 'BlueOcean', 
    content: 'Just had a great session with a counselor. Highly recommend breaking the stigma.', 
    tags: ['Anxiety'], 
    upvotes: 45, 
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() 
  },
  { 
    id: 3, 
    user_id: 'user_03',
    author_alias: 'ForestWalker', 
    content: 'Feeling lonely on campus this weekend. Anyone want to study virtually?', 
    tags: ['Relationships'], 
    upvotes: 12, 
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() 
  },
];

export const MOCK_COUNSELORS: Counselor[] = [
  { id: '1', name: 'Dr. Sarah Chen', specialty: 'Academic Stress & Anxiety', availableSlots: ['Mon 10:00 AM', 'Tue 2:00 PM'], rating: 4.9, imageUrl: 'https://picsum.photos/100/100?random=1' },
  { id: '2', name: 'Mr. James Wilson', specialty: 'Career Guidance & Depression', availableSlots: ['Wed 11:00 AM', 'Fri 4:00 PM'], rating: 4.8, imageUrl: 'https://picsum.photos/100/100?random=2' },
];

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500];

export const COPING_STRATEGIES = [
  "Take a deep breath. Inhale for 4 seconds, hold for 7, exhale for 8.",
  "Step outside for a moment and look at the sky.",
  "Drink a glass of cold water slowly.",
  "Write down three things you can see, two things you can feel, and one thing you can hear.",
];
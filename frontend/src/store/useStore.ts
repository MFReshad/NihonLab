import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProgress {
  xp: number;
  streak: number;
  lastVisit: string;
  level: number;
  cardsLearned: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider?: 'email' | 'google';
}

interface Store {
  userProgress: UserProgress;
  user: User | null;
  isAuthenticated: boolean;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  incrementCardsLearned: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const getTodayDate = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const checkStreak = (lastVisit: string): number => {
  const today = getTodayDate();
  const lastDate = lastVisit.split('T')[0]; // Extract date part
  
  if (today === lastDate) return 0; // Same day, no change
  
  const todayObj = new Date(today);
  const lastObj = new Date(lastDate);
  const diffTime = todayObj.getTime() - lastObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 1; // Consecutive day
  return -1; // Streak broken
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      userProgress: {
        xp: 0,
        streak: 0,
        lastVisit: new Date().toISOString(),
        level: 1,
        cardsLearned: 0,
      },
      user: null,
      isAuthenticated: false,
      addXP: (amount: number) =>
        set((state) => {
          const newXP = state.userProgress.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          return {
            userProgress: {
              ...state.userProgress,
              xp: newXP,
              level: newLevel,
            },
          };
        }),
      updateStreak: () =>
        set((state) => {
          const streakChange = checkStreak(state.userProgress.lastVisit);
          const newStreak =
            streakChange === -1
              ? 1
              : state.userProgress.streak + (streakChange === 1 ? 1 : 0);
          
          return {
            userProgress: {
              ...state.userProgress,
              streak: newStreak,
              lastVisit: new Date().toISOString(),
            },
          };
        }),
      incrementCardsLearned: () =>
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            cardsLearned: state.userProgress.cardsLearned + 1,
          },
        })),
      login: async (email: string, password: string) => {
        // Mock login - in production, this would call an API
        await new Promise(resolve => setTimeout(resolve, 800));
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
          provider: 'email' as const,
        };
        set({ user, isAuthenticated: true });
      },
      signup: async (name: string, email: string, password: string) => {
        // Mock signup - in production, this would call an API
        await new Promise(resolve => setTimeout(resolve, 800));
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          provider: 'email' as const,
        };
        set({ user, isAuthenticated: true });
      },
      loginWithGoogle: async () => {
        // Mock Google OAuth - in production, this would use real OAuth
        await new Promise(resolve => setTimeout(resolve, 1000));
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email: 'sakura.user@gmail.com',
          name: 'Sakura Y.',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sakura',
          provider: 'google' as const,
        };
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'nihonlab-storage',
    }
  )
);

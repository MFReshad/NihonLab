import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, User, setTokens, clearTokens, getAccessToken } from '@/lib/utils';

interface UserProgress {
  streak: number;
  cardsLearned: number;
  level: number;
  xp: number;
}

interface AuthState {
  user: User | null;
  userProgress: UserProgress;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setUserProgress: (progress: UserProgress) => void;
  updateUserProgress: (updates: Partial<UserProgress>) => void;
  updateStreak: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

type StoreState = AuthState & AuthActions;

// Default user progress for new users
const DEFAULT_USER_PROGRESS: UserProgress = {
  streak: 0,
  cardsLearned: 0,
  level: 1,
  xp: 0,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      userProgress: DEFAULT_USER_PROGRESS,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        });
        
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      },

      setUserProgress: (progress) => {
        set({ userProgress: progress });
      },

      updateUserProgress: (updates) => {
        set((state) => ({
          userProgress: { ...state.userProgress, ...updates }
        }));
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.login(email, password);
          
          // Store tokens
          setTokens(response.tokens);
          
          // Update state with default progress initially
          set({
            user: response.user,
            userProgress: DEFAULT_USER_PROGRESS,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          localStorage.setItem('user', JSON.stringify(response.user));

          // TODO: Fetch actual user progress from backend
          // try {
          //   const userProgress = await api.getUserProgress();
          //   set({ userProgress });
          // } catch (error) {
          //   console.error('Failed to fetch user progress:', error);
          // }
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      signup: async (firstName, lastName, email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.register(email, password, firstName, lastName);
          
          // Store tokens
          setTokens(response.tokens);
          
          // Update state with default progress for new users
          set({
            user: response.user,
            userProgress: DEFAULT_USER_PROGRESS,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          localStorage.setItem('user', JSON.stringify(response.user));

          // TODO: Create initial user progress in backend
          // try {
          //   await api.createUserProgress(DEFAULT_USER_PROGRESS);
          // } catch (error) {
          //   console.error('Failed to create user progress:', error);
          // }
        } catch (error: any) {
          set({
            error: error.message || 'Signup failed',
            isLoading: false,
          });
          throw error;
        }
      },

      loginWithGoogle: async (credential) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.googleAuth(credential);
          
          // Store tokens
          setTokens(response.tokens);
          
          // Update state with default progress initially
          set({
            user: response.user,
            userProgress: DEFAULT_USER_PROGRESS,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          localStorage.setItem('user', JSON.stringify(response.user));

          // TODO: Fetch or create user progress from backend
          // try {
          //   const userProgress = await api.getUserProgress();
          //   set({ userProgress });
          // } catch (error) {
          //   // If user progress doesn't exist, create it
          //   await api.createUserProgress(DEFAULT_USER_PROGRESS);
          // }
        } catch (error: any) {
          set({
            error: error.message || 'Google login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await api.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear tokens and state
          clearTokens();
          set({
            user: null,
            userProgress: DEFAULT_USER_PROGRESS,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        const accessToken = getAccessToken();
        
        if (!accessToken) {
          set({ 
            isAuthenticated: false, 
            user: null, 
            userProgress: DEFAULT_USER_PROGRESS 
          });
          return;
        }

        try {
          // Try to get user profile to verify token
          const user = await api.getProfile();
          
          set({
            user,
            userProgress: DEFAULT_USER_PROGRESS,
            isAuthenticated: true,
            error: null,
          });

          // TODO: Fetch actual user progress
          // try {
          //   const userProgress = await api.getUserProgress();
          //   set({ userProgress });
          // } catch (error) {
          //   console.error('Failed to fetch user progress:', error);
          // }
        } catch (error) {
          // Token is invalid, clear everything
          clearTokens();
          set({
            user: null,
            userProgress: DEFAULT_USER_PROGRESS,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastVisit = localStorage.getItem('lastVisit');
        
        if (lastVisit !== today) {
          localStorage.setItem('lastVisit', today);
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              streak: state.userProgress.streak + 1
            }
          }));
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        userProgress: state.userProgress,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
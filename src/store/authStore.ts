import { create } from 'zustand';
import { AuthState, User } from '../types';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser,
  loginWithGoogle,
  loginWithApple,
  sendOTP,
  verifyOTP
} from '../services/authService';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  otpSent: boolean;
  otpVerified: boolean;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpSent: false,
  otpVerified: false,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginUser(email, password);
      set({ user, isAuthenticated: true, isLoading: false, otpSent: false, otpVerified: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Login failed', isLoading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginWithGoogle();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Google login failed', isLoading: false });
    }
  },

  loginWithApple: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginWithApple();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Apple login failed', isLoading: false });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await registerUser(userData);
      set({ user, isAuthenticated: true, isLoading: false, otpSent: false, otpVerified: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Registration failed', isLoading: false });
    }
  },

  logout: () => {
    logoutUser();
    set({ user: null, isAuthenticated: false, otpSent: false, otpVerified: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  sendOTP: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await sendOTP(email);
      set({ otpSent: true, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to send OTP', isLoading: false });
    }
  },

  verifyOTP: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      await verifyOTP(email, otp);
      set({ otpVerified: true, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'OTP verification failed', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
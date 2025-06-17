import { User } from '../types';
import { getMockUser, setMockUser } from '../lib/mockData';

// Mock OTP storage (in production, this would be stored securely on the backend)
const otpStorage = new Map<string, { otp: string; expires: number; verified: boolean }>();

// Generate a random 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simulate sending OTP via email
export const sendOTP = async (email: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const otp = generateOTP();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
  
  otpStorage.set(email, { otp, expires, verified: false });
  
  // In production, this would send an actual email
  console.log(`OTP for ${email}: ${otp}`);
  
  // Show OTP in alert for demo purposes
  alert(`Your OTP is: ${otp}\n\nIn production, this would be sent to your email.`);
};

// Verify OTP
export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const stored = otpStorage.get(email);
  if (!stored) {
    throw new Error('No OTP found for this email');
  }
  
  if (Date.now() > stored.expires) {
    otpStorage.delete(email);
    throw new Error('OTP has expired');
  }
  
  if (stored.otp !== otp) {
    throw new Error('Invalid OTP');
  }
  
  stored.verified = true;
  return true;
};

// Check if OTP is verified
export const isOTPVerified = (email: string): boolean => {
  const stored = otpStorage.get(email);
  return stored?.verified || false;
};

// Clear OTP after successful login
export const clearOTP = (email: string): void => {
  otpStorage.delete(email);
};

// Simulated login function with OTP verification
export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check credentials
  if (email === 'demo@example.com' && password === 'password') {
    // Check if OTP is verified
    if (!isOTPVerified(email)) {
      throw new Error('Please verify your email with the OTP first');
    }
    
    const user = getMockUser();
    
    // Store token in localStorage
    localStorage.setItem('auth_token', 'mock_jwt_token');
    
    // Clear OTP after successful login
    clearOTP(email);
    
    return user;
  }
  
  throw new Error('Invalid email or password');
};

// Google OAuth login simulation
export const loginWithGoogle = async (): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, this would use Google OAuth SDK
  const user: User = {
    id: 'google_user_1',
    email: 'user@gmail.com',
    firstName: 'Google',
    lastName: 'User',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  setMockUser(user);
  localStorage.setItem('auth_token', 'mock_google_jwt_token');
  
  return user;
};

// Apple OAuth login simulation
export const loginWithApple = async (): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, this would use Apple Sign In SDK
  const user: User = {
    id: 'apple_user_1',
    email: 'user@icloud.com',
    firstName: 'Apple',
    lastName: 'User',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  setMockUser(user);
  localStorage.setItem('auth_token', 'mock_apple_jwt_token');
  
  return user;
};

// Simulated registration function
export const registerUser = async (userData: Partial<User> & { password: string }): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if OTP is verified for registration
  if (userData.email && !isOTPVerified(userData.email)) {
    throw new Error('Please verify your email with the OTP first');
  }
  
  // In a real app, this would be an API call to a backend
  const newUser: User = {
    id: 'user1',
    email: userData.email || '',
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    role: userData.role || 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Save the mock user
  setMockUser(newUser);
  
  // Store token in localStorage
  localStorage.setItem('auth_token', 'mock_jwt_token');
  
  // Clear OTP after successful registration
  if (userData.email) {
    clearOTP(userData.email);
  }
  
  return newUser;
};

// Simulated logout function
export const logoutUser = (): void => {
  // Clear token from localStorage
  localStorage.removeItem('auth_token');
};

// Simulated function to get the current user
export const getCurrentUser = async (): Promise<User | null> => {
  // Check if token exists
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return null;
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would validate the token and get user data
  try {
    const user = getMockUser();
    return user;
  } catch (error) {
    // Invalid token
    localStorage.removeItem('auth_token');
    return null;
  }
};
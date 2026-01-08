import api from '../../lib/api';
import { User } from '../../types';

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
}

const mapUserResponse = (userData: AuthResponse['user']): User => ({
  id: userData.id,
  email: userData.email,
  firstName: userData.first_name,
  lastName: userData.last_name,
  role: userData.role as 'admin' | 'user',
  createdAt: userData.created_at,
  updatedAt: userData.updated_at,
});

export const registerUser = async (userData: Partial<User> & { password: string }): Promise<User> => {
  const registerData: RegisterData = {
    email: userData.email || '',
    password: userData.password,
    first_name: userData.firstName || '',
    last_name: userData.lastName || '',
  };

  const response = await api.post<AuthResponse>('/auth/register', registerData);

  localStorage.setItem('auth_token', response.data.access_token);

  return mapUserResponse(response.data.user);
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const loginData: LoginData = {
    email,
    password,
  };

  const response = await api.post<AuthResponse>('/auth/login', loginData);

  localStorage.setItem('auth_token', response.data.access_token);

  return mapUserResponse(response.data.user);
};

export const logoutUser = (): void => {
  localStorage.removeItem('auth_token');
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return null;
  }

  try {
    const response = await api.get<AuthResponse['user']>('/auth/me');
    return mapUserResponse(response.data);
  } catch (error) {
    localStorage.removeItem('auth_token');
    return null;
  }
};

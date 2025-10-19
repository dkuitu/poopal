import api from './api';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string | null;
    onboardingCompleted: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export const register = async (
  email: string,
  password: string,
  username?: string
): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/register', { email, password, username });
  return data.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data;
};

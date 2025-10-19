import pool from '../config/pg-client';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, JwtPayload } from '../utils/jwt';
import { AppError } from '../middleware/error-handler.middleware';

export interface RegisterInput {
  email: string;
  password: string;
  username?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string | null;
    onboardingCompleted: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  // Check if user exists
  const existingUsersResult = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [input.email]
  );

  if (existingUsersResult.rows.length > 0) {
    throw new AppError(409, 'User with this email already exists');
  }

  if (input.username) {
    const existingUsernamesResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [input.username]
    );

    if (existingUsernamesResult.rows.length > 0) {
      throw new AppError(409, 'Username already taken');
    }
  }

  // Hash password
  const passwordHash = await hashPassword(input.password);

  // Create user
  const result = await pool.query(
    'INSERT INTO users (id, email, username, password_hash) VALUES (gen_random_uuid()::text, $1, $2, $3) RETURNING id, email, username, onboarding_completed',
    [input.email, input.username || null, passwordHash]
  );

  const user = result.rows[0];

  // Generate tokens
  const payload: JwtPayload = { userId: user.id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      onboardingCompleted: user.onboarding_completed,
    },
    accessToken,
    refreshToken,
  };
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  // Find user
  const result = await pool.query(
    'SELECT id, email, username, password_hash, onboarding_completed FROM users WHERE email = $1',
    [input.email]
  );

  if (result.rows.length === 0) {
    throw new AppError(401, 'Invalid email or password');
  }

  const user = result.rows[0];

  // Verify password
  const isValid = await comparePassword(input.password, user.password_hash);

  if (!isValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  // Generate tokens
  const payload: JwtPayload = { userId: user.id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      onboardingCompleted: user.onboarding_completed,
    },
    accessToken,
    refreshToken,
  };
};

export const getMe = async (userId: string) => {
  const result = await pool.query(
    'SELECT id, email, username, avatar_url, onboarding_completed, theme_preference, created_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, 'User not found');
  }

  const user = result.rows[0];

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    avatarUrl: user.avatar_url,
    onboardingCompleted: user.onboarding_completed,
    themePreference: user.theme_preference,
    createdAt: user.created_at,
  };
};

export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/poopal_db';

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

export const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);
export const ALLOWED_IMAGE_TYPES = (
  process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp'
).split(',');

export const RATE_LIMIT_WINDOW_MS = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || '900000',
  10
);
export const RATE_LIMIT_MAX_REQUESTS = parseInt(
  process.env.RATE_LIMIT_MAX_REQUESTS || '100',
  10
);

export const AI_CACHE_TTL_SECONDS = parseInt(process.env.AI_CACHE_TTL_SECONDS || '86400', 10);
export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
export const DEEPSEEK_API_URL =
  process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1';

export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
export const PORT = parseInt(process.env.PORT || '3000', 10);

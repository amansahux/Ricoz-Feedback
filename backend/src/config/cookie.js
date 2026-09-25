import { env } from "./env.js";

const isProduction = env.NODE_ENV === 'production';

export const getAccessTokenCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes
});

export const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

// Backward compatibility alias for single token
export const getCookieOptions = () => getRefreshTokenCookieOptions();
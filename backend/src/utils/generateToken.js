import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateAccessToken = (userId, organizationId) => {
  return jwt.sign(
    { userId, organizationId, type: 'access' },
    env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (userId, organizationId) => {
  return jwt.sign(
    { userId, organizationId, type: 'refresh' },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const generateAuthTokens = (userId, organizationId) => {
  const accessToken = generateAccessToken(userId, organizationId);
  const refreshToken = generateRefreshToken(userId, organizationId);
  return { accessToken, refreshToken };
};

// Legacy fallback
export const generateToken = (userId, organizationId) => {
  return generateAccessToken(userId, organizationId);
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
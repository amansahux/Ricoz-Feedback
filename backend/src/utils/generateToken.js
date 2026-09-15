import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateToken = (userId, organizationId) => {
  return jwt.sign(
    { userId, organizationId },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
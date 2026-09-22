import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import surveyRoutes from './routes/survey.routes.js';
import responseRoutes from './routes/response.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import customerRoutes from './routes/customer.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { env } from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 2. Helmet Security Headers with Recoz Platform Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'default-src': ["'self'"],
        'img-src': ["'self'", 'data:', 'blob:', 'https://lh3.googleusercontent.com', 'https://*.googleusercontent.com', 'https://ik.imagekit.io', 'https://ik.imagekit.io/recoz'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        'connect-src': ["'self'", env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5000', 'https://ik.imagekit.io'],
        'frame-src': ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// 3. Rate Limiter (General API limiter)
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 300, // Max 300 requests per 5 minutes
  message: { message: 'Too many requests from this IP, please try again after 5 minutes.' },
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter Auth Rate Limiter for login & registration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { message: 'Too many authentication attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

// 4. API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/customers', customerRoutes);

// 5. Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Recoz Feedback API' });
});

// 6. Public Frontend SPA fallback
app.get('{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// 7. Error handling middleware
app.use(errorMiddleware);

export default app;
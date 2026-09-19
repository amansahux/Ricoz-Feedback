import express from 'express';
import cookieParser from 'cookie-parser';


import authRoutes from './routes/auth.routes.js';
import surveyRoutes from './routes/survey.routes.js';
import responseRoutes from './routes/response.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import customerRoutes from './routes/customer.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();


app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/customers', customerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorMiddleware);

export default app;
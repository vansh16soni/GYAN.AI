import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db';
import authRoutes from './routes/auth';
import notesRoutes from './routes/notes';
import settingsRoutes from './routes/settings';

async function main() {
  await connectDB();

  const app = express();

  // 1. Direct Universal CORS & Preflight Handling (Must be first before all other middleware)
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    next();
  });

  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // 2. HTTP Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false,
    })
  );

  // 3. Body Parsing Limit
  app.use(express.json({ limit: '2mb' }));

  // 4. Rate Limiting Protection
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again later.' },
  });
  app.use('/api', globalLimiter);

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'TOO_MANY_AUTH_ATTEMPTS', message: 'Too many authentication attempts, please try again later.' },
  });
  app.use('/api/auth', authLimiter);

  const generateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'GENERATION_RATE_LIMIT', message: 'Synthesis request rate limit exceeded. Please wait a moment.' },
  });
  app.use('/api/notes/generate', generateLimiter);

  // 5. API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/notes', notesRoutes);
  app.use('/api/settings', settingsRoutes);

  // 6. Health Check Endpoint
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ ok: true, timestamp: new Date().toISOString(), service: 'gyan-ai-backend' });
  });

  // 7. Global Production Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled API Error:', err?.message || err);
    res.status(err?.status || 500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err?.message,
    });
  });

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`gyan.ai server running securely on port :${port}`));
}

main().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});

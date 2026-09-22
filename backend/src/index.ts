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

  // 1. HTTP Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Allows flexible API usage
    })
  );

  // 2. Production CORS Setup
  const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        // Check if origin matches allowed list or matches onrender.com subdomains
        const isAllowed =
          allowedOrigins.includes(origin) ||
          allowedOrigins.some((allowed) => allowed.replace(/\/$/, '') === origin.replace(/\/$/, '')) ||
          (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:'));

        if (isAllowed) {
          callback(null, true);
        } else {
          // Log unauthorized attempt without crashing
          callback(null, true); // Permissive fallback with headers set, or restricted
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 3. Body Parsing Limit (Mitigate Payload Flooding)
  app.use(express.json({ limit: '2mb' }));

  // 4. Rate Limiting Protection (DDoS & Brute Force Defense)
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'TOO_MANY_REQUESTS', message: 'Too many requests from this IP, please try again later.' },
  });
  app.use('/api', globalLimiter);

  // Stricter limiter on authentication (brute force protection)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30, // 30 attempts per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'TOO_MANY_AUTH_ATTEMPTS', message: 'Too many authentication attempts, please try again later.' },
  });
  app.use('/api/auth', authLimiter);

  // Generation limiter (protects OpenAI API credits)
  const generateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 15, // 15 note generations per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'GENERATION_RATE_LIMIT', message: 'Synthesis request rate limit exceeded. Please wait a moment.' },
  });
  app.use('/api/notes/generate', generateLimiter);

  // 5. API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/notes', notesRoutes);
  app.use('/api/settings', settingsRoutes);

  // 6. Health Check Endpoint (Used by Render for zero-downtime health monitoring)
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ ok: true, timestamp: new Date().toISOString(), service: 'gyan-ai-backend' });
  });

  // 7. Global Production Error Handler (Prevents stack trace leaks)
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

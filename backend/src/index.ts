import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import authRoutes from './routes/auth';
import notesRoutes from './routes/notes';
import settingsRoutes from './routes/settings';

async function main() {
  await connectDB();

  const app = express();
  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
  app.use(express.json({ limit: '2mb' }));

  app.use('/api/auth', authRoutes);
  app.use('/api/notes', notesRoutes);
  app.use('/api/settings', settingsRoutes);

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`gyan.ai server on :${port}`));
}

main().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});


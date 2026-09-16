import { Router } from 'express';
import { z } from 'zod';
import { auth, AuthedRequest } from '../middleware/auth';
import { Note } from '../models/Note';
import { extractContent } from '../services/extract';
import { generateNotes } from '../services/generate';

const router = Router();
router.use(auth);

const generateSchema = z.object({
  input: z.string().min(1).max(2000),
});

router.post('/generate', async (req: AuthedRequest, res) => {
  req.setTimeout(120_000);

  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'INVALID_INPUT', details: parsed.error.flatten() });
  }
  const input = parsed.data.input.trim();

  try {
    const extracted = await extractContent(input);
    const generated = await generateNotes(extracted.type, input, extracted.text);

    const note = await Note.create({
      userId: req.userId,
      input,
      inputType: extracted.type,
      title: generated.title,
      content: generated.content,
    });

    res.status(201).json({ note });
  } catch (err: any) {
    const errMsg = err?.message;
    if (errMsg === 'OPENAI_KEY_MISSING') {
      return res.status(503).json({
        error: 'OPENAI_KEY_MISSING',
        message: 'OpenAI API key is missing. Please add your OPENAI_API_KEY to server/.env',
      });
    }
    if (errMsg === 'INVALID_YOUTUBE_URL') {
      return res.status(400).json({
        error: 'INVALID_YOUTUBE_URL',
        message: 'Invalid YouTube link format. Please provide a valid YouTube video URL.',
      });
    }
    if (errMsg === 'TRANSCRIPTION_FAILED' || errMsg === 'TRANSCRIPTION_EMPTY') {
      return res.status(422).json({
        error: 'TRANSCRIPTION_FAILED',
        message: 'Could not extract captions/transcript from this YouTube video. Ensure it has captions enabled.',
      });
    }
    if (errMsg === 'INSTAGRAM_UNSUPPORTED') {
      return res.status(422).json({
        error: 'INSTAGRAM_UNSUPPORTED',
        message: 'Instagram link support is coming soon. Please use a YouTube link or type a topic.',
      });
    }
    if (errMsg === 'UNSUPPORTED_SOURCE') {
      return res.status(422).json({
        error: 'UNSUPPORTED_SOURCE',
        message: 'Unsupported link. Please paste a YouTube link or type a topic directly.',
      });
    }

    console.error('generate error:', err);
    res.status(502).json({
      error: 'GENERATION_FAILED',
      message: err?.message || 'Something went wrong generating notes. Please try again.',
    });
  }
});

router.get('/history', async (req: AuthedRequest, res) => {
  try {
    const notes = await Note.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('_id title input inputType createdAt')
      .lean();
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ error: 'HISTORY_FETCH_FAILED', message: err?.message });
  }
});

router.get('/:id', async (req: AuthedRequest, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!note) return res.status(404).json({ error: 'NOT_FOUND', message: 'Note not found' });
    res.json(note);
  } catch (err: any) {
    res.status(500).json({ error: 'NOTE_FETCH_FAILED', message: err?.message });
  }
});

router.delete('/:id', async (req: AuthedRequest, res) => {
  try {
    const result = await Note.deleteOne({ _id: req.params.id, userId: req.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Note not found' });
    }
    res.json({ ok: true });
  } catch (err: any) {
    console.error('Delete note error:', err);
    res.status(500).json({ error: 'DELETE_FAILED', message: err?.message });
  }
});

export default router;

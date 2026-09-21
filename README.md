# gyan.ai

Notes generator. Paste a topic, get structured Markdown notes via OpenAI. (YouTube URL support lands in milestone 6.)

## Status: milestones 1–4 complete

- [x] Scaffold frontend + backend, MongoDB wired
- [x] Auth: register/login, JWT middleware
- [x] Note model
- [x] `/notes/generate` — topic input, end-to-end, saved to DB
- [ ] YouTube URL support (milestone 6)
- [ ] Sidebar history wiring polish / delete UI (routes exist, basic UI wired)
- [ ] Final styling polish, toasts

## Run it

### Backend
```bash
cd backend
cp .env.example .env   # fill in MONGODB_URI, OPENAI_API_KEY, JWT_SECRET
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend on :5173, backend on :5000.

## Notes on choices

- `youtube-transcript` pinned in server deps for milestone 6, not yet wired into `extract.ts`.
- Zod validates all request bodies.
- OpenAI key never touches the frontend — all generation happens server-side.

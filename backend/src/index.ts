import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { bingoRouter } from './routes/bingo';
import { adminRouter } from './routes/admin';
import { brukerRouter } from './routes/bruker';
import { authRouter } from './routes/auth';

// Load environment variables (try .env.local first, then .env)
dotenv.config({ path: '.env' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRouter);
app.use('/api/bruker', brukerRouter);
app.use('/api/bingo', bingoRouter);
app.use('/api/admin', adminRouter);

app.get('/api/helse', (_req, res) => {
  res.json({ status: 'ok', melding: 'Alpinbingo API kjører!' });
});

// Serve static files from frontend build
const frontendPath = path.join(__dirname, '../../frontend/dist');
console.log('Frontend path:', frontendPath);
app.use(express.static(frontendPath));

// Serve index.html for all non-API routes (SPA fallback)
app.get('*', (_req, res) => {
  console.log('Serving index.html for:', _req.path);
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server kjører på port ${PORT}`);
});

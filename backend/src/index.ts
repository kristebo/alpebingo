import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import { bingoRouter } from './routes/bingo';
import { adminRouter } from './routes/admin';
import { brukerRouter } from './routes/bruker';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use('/api/bruker', brukerRouter);
app.use('/api/bingo', bingoRouter);
app.use('/api/admin', adminRouter);

app.get('/api/helse', (_req, res) => {
  res.json({ status: 'ok', melding: 'Alpinbingo API kjører!' });
});

app.listen(PORT, () => {
  console.log(`Server kjører på port ${PORT}`);
});

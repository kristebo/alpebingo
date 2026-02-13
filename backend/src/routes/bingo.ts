import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { hentKortForBruker, lagreKort, hentKort } from '../data/bingokort';
import { genererTilfeldigKort, hentAktiveHendelser, hentAlleKategorier } from '../data/hendelser';

export const bingoRouter = Router();

bingoRouter.get('/hendelser', (_req, res) => {
  res.json(hentAktiveHendelser());
});

bingoRouter.get('/kategorier', (_req, res) => {
  res.json(hentAlleKategorier());
});

bingoRouter.get('/kort', authMiddleware, (req: AuthRequest, res: Response) => {
  const brukerId = req.brukerId!;
  let kort = hentKortForBruker(brukerId);

  if (!kort) {
    kort = genererTilfeldigKort(brukerId);
    lagreKort(kort);
  }

  res.json(kort);
});

bingoRouter.post('/kort/nytt', authMiddleware, (req: AuthRequest, res: Response) => {
  const brukerId = req.brukerId!;
  const kort = genererTilfeldigKort(brukerId);
  lagreKort(kort);
  res.json(kort);
});

bingoRouter.post('/kort/:kortId/kryss/:feltId', authMiddleware, (req: AuthRequest, res: Response) => {
  const { kortId, feltId } = req.params;
  const kort = hentKort(kortId);

  if (!kort) {
    res.status(404).json({ feil: 'Kort ikke funnet' });
    return;
  }

  if (kort.brukerId !== req.brukerId) {
    res.status(403).json({ feil: 'Ikke tilgang til dette kortet' });
    return;
  }

  if (!kort.kryssedeFelt.includes(feltId)) {
    kort.kryssedeFelt.push(feltId);
    lagreKort(kort);
  }

  const harBingo = sjekkBingo(kort.felt, kort.kryssedeFelt);

  res.json({ kort, harBingo });
});

function sjekkBingo(felt: { id: string }[][], kryssede: string[]): boolean {
  for (let rad = 0; rad < 5; rad++) {
    if (felt[rad].every(f => kryssede.includes(f.id))) return true;
  }

  for (let kol = 0; kol < 5; kol++) {
    if (felt.every(rad => kryssede.includes(rad[kol].id))) return true;
  }

  if (felt.every((rad, i) => kryssede.includes(rad[i].id))) return true;
  if (felt.every((rad, i) => kryssede.includes(rad[4 - i].id))) return true;

  return false;
}

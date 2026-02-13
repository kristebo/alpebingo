import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { hentBruker } from '../data/brukere';

export const brukerRouter = Router();

brukerRouter.get('/meg', authMiddleware, (req: AuthRequest, res: Response) => {
  const bruker = hentBruker(req.brukerId!);
  
  if (!bruker) {
    res.status(404).json({ feil: 'Bruker ikke funnet' });
    return;
  }

  res.json({
    id: bruker.id,
    brukernavn: bruker.brukernavn,
    epost: bruker.epost,
    rolle: bruker.rolle,
    teamId: bruker.teamId,
  });
});

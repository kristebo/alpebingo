import { Router, Response } from 'express';
import { clerkAuthMiddleware, brukerMiddleware, adminMiddleware, AuthRequest } from '../middleware/clerkAuth';
import { hentAlleBrukere, lagreBruker, hentBruker, hentAlleTeams, lagreTeam, hentTeam, slettTeam } from '../data/brukere';
import { 
  hentAlleKategorier, lagreKategori, hentKategori, slettKategori,
  hentAlleHendelser, lagreHendelse, hentHendelse, slettHendelse 
} from '../data/hendelser';
import { Team } from '../types/bruker';
import { Kategori, BingoFelt } from '../types/bingo';

export const adminRouter = Router();

adminRouter.use(clerkAuthMiddleware);
adminRouter.use(brukerMiddleware);
adminRouter.use(adminMiddleware);

adminRouter.get('/brukere', (_req, res: Response) => {
  const brukere = hentAlleBrukere().map(b => ({
    id: b.id,
    brukernavn: b.brukernavn,
    epost: b.epost,
    rolle: b.rolle,
    teamId: b.teamId,
    opprettet: b.opprettet,
  }));
  res.json(brukere);
});

adminRouter.put('/brukere/:brukerId/team', (req: AuthRequest, res: Response) => {
  const { brukerId } = req.params;
  const { teamId } = req.body;

  const bruker = hentBruker(brukerId);
  if (!bruker) {
    res.status(404).json({ feil: 'Bruker ikke funnet' });
    return;
  }

  if (teamId && !hentTeam(teamId)) {
    res.status(400).json({ feil: 'Team finnes ikke' });
    return;
  }

  bruker.teamId = teamId || undefined;
  lagreBruker(bruker);

  res.json({ id: bruker.id, brukernavn: bruker.brukernavn, teamId: bruker.teamId });
});

adminRouter.put('/brukere/:brukerId/rolle', (req: AuthRequest, res: Response) => {
  const { brukerId } = req.params;
  const { rolle } = req.body;

  if (rolle !== 'bruker' && rolle !== 'admin') {
    res.status(400).json({ feil: 'Ugyldig rolle' });
    return;
  }

  const bruker = hentBruker(brukerId);
  if (!bruker) {
    res.status(404).json({ feil: 'Bruker ikke funnet' });
    return;
  }

  bruker.rolle = rolle;
  lagreBruker(bruker);

  res.json({ id: bruker.id, brukernavn: bruker.brukernavn, rolle: bruker.rolle });
});

adminRouter.get('/teams', (_req, res: Response) => {
  res.json(hentAlleTeams());
});

adminRouter.post('/teams', (req: AuthRequest, res: Response) => {
  const { navn } = req.body;

  if (!navn) {
    res.status(400).json({ feil: 'Navn er påkrevd' });
    return;
  }

  const team: Team = {
    id: crypto.randomUUID(),
    navn,
    opprettet: new Date(),
  };

  lagreTeam(team);
  res.status(201).json(team);
});

adminRouter.put('/teams/:teamId', (req: AuthRequest, res: Response) => {
  const { teamId } = req.params;
  const { navn } = req.body;

  const team = hentTeam(teamId);
  if (!team) {
    res.status(404).json({ feil: 'Team ikke funnet' });
    return;
  }

  if (navn) team.navn = navn;
  lagreTeam(team);

  res.json(team);
});

adminRouter.delete('/teams/:teamId', (req: AuthRequest, res: Response) => {
  const { teamId } = req.params;
  
  if (!slettTeam(teamId)) {
    res.status(404).json({ feil: 'Team ikke funnet' });
    return;
  }

  res.status(204).send();
});

adminRouter.get('/kategorier', (_req, res: Response) => {
  res.json(hentAlleKategorier());
});

adminRouter.post('/kategorier', (req: AuthRequest, res: Response) => {
  const { navn } = req.body;

  if (!navn) {
    res.status(400).json({ feil: 'Navn er påkrevd' });
    return;
  }

  const id = navn.toLowerCase().replace(/\s+/g, '-');
  const kategori: Kategori = {
    id,
    navn,
    opprettet: new Date(),
  };

  lagreKategori(kategori);
  res.status(201).json(kategori);
});

adminRouter.put('/kategorier/:kategoriId', (req: AuthRequest, res: Response) => {
  const { kategoriId } = req.params;
  const { navn } = req.body;

  const kategori = hentKategori(kategoriId);
  if (!kategori) {
    res.status(404).json({ feil: 'Kategori ikke funnet' });
    return;
  }

  if (navn) kategori.navn = navn;
  lagreKategori(kategori);

  res.json(kategori);
});

adminRouter.delete('/kategorier/:kategoriId', (req: AuthRequest, res: Response) => {
  const { kategoriId } = req.params;
  
  if (!slettKategori(kategoriId)) {
    res.status(404).json({ feil: 'Kategori ikke funnet' });
    return;
  }

  res.status(204).send();
});

adminRouter.get('/hendelser', (_req, res: Response) => {
  res.json(hentAlleHendelser());
});

adminRouter.post('/hendelser', (req: AuthRequest, res: Response) => {
  const { tekst, kategoriId, aktiv = true } = req.body;

  if (!tekst || !kategoriId) {
    res.status(400).json({ feil: 'Tekst og kategoriId er påkrevd' });
    return;
  }

  if (!hentKategori(kategoriId)) {
    res.status(400).json({ feil: 'Kategori finnes ikke' });
    return;
  }

  const hendelse: BingoFelt = {
    id: crypto.randomUUID(),
    tekst,
    kategoriId,
    aktiv,
    opprettet: new Date(),
  };

  lagreHendelse(hendelse);
  res.status(201).json(hendelse);
});

adminRouter.put('/hendelser/:hendelseId', (req: AuthRequest, res: Response) => {
  const { hendelseId } = req.params;
  const { tekst, kategoriId, aktiv } = req.body;

  const hendelse = hentHendelse(hendelseId);
  if (!hendelse) {
    res.status(404).json({ feil: 'Hendelse ikke funnet' });
    return;
  }

  if (tekst) hendelse.tekst = tekst;
  if (kategoriId) {
    if (!hentKategori(kategoriId)) {
      res.status(400).json({ feil: 'Kategori finnes ikke' });
      return;
    }
    hendelse.kategoriId = kategoriId;
  }
  if (typeof aktiv === 'boolean') hendelse.aktiv = aktiv;

  lagreHendelse(hendelse);
  res.json(hendelse);
});

adminRouter.delete('/hendelser/:hendelseId', (req: AuthRequest, res: Response) => {
  const { hendelseId } = req.params;
  
  if (!slettHendelse(hendelseId)) {
    res.status(404).json({ feil: 'Hendelse ikke funnet' });
    return;
  }

  res.status(204).send();
});

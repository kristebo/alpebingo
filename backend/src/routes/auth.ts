import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { hentBrukerMedEpost, lagreBruker, hentAlleBrukere } from '../data/brukere';
import { Bruker } from '../types/bruker';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'din-hemmelige-nøkkel-her';

// Registrer ny bruker
authRouter.post('/registrer', async (req: Request, res: Response) => {
  try {
    const { brukernavn, epost, passord } = req.body;

    if (!brukernavn || !epost || !passord) {
      res.status(400).json({ feil: 'Alle felt er påkrevd' });
      return;
    }

    // Sjekk om bruker allerede eksisterer
    const eksisterendeBruker = hentBrukerMedEpost(epost);
    if (eksisterendeBruker) {
      res.status(400).json({ feil: 'Epost er allerede registrert' });
      return;
    }

    // Hash passord
    const hashetPassord = await bcrypt.hash(passord, 10);

    // Opprett bruker
    const nyBruker: Bruker = {
      id: crypto.randomUUID(),
      brukernavn,
      epost,
      passord: hashetPassord,
      rolle: 'bruker',
      opprettet: new Date(),
    };

    lagreBruker(nyBruker);

    // Generer JWT token
    const token = jwt.sign({ brukerId: nyBruker.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      bruker: {
        id: nyBruker.id,
        brukernavn: nyBruker.brukernavn,
        epost: nyBruker.epost,
        rolle: nyBruker.rolle,
      },
    });
  } catch (error) {
    console.error('Registrering feilet:', error);
    res.status(500).json({ feil: 'Serverfeil ved registrering' });
  }
});

// Logg inn
authRouter.post('/logg-inn', async (req: Request, res: Response) => {
  try {
    const { epost, passord } = req.body;

    if (!epost || !passord) {
      res.status(400).json({ feil: 'Epost og passord er påkrevd' });
      return;
    }

    // Finn bruker
    const bruker = hentBrukerMedEpost(epost);
    if (!bruker || !bruker.passord) {
      res.status(401).json({ feil: 'Ugyldig epost eller passord' });
      return;
    }

    // Sjekk passord
    const passordMatch = await bcrypt.compare(passord, bruker.passord);
    if (!passordMatch) {
      res.status(401).json({ feil: 'Ugyldig epost eller passord' });
      return;
    }

    // Generer JWT token
    const token = jwt.sign({ brukerId: bruker.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      bruker: {
        id: bruker.id,
        brukernavn: bruker.brukernavn,
        epost: bruker.epost,
        rolle: bruker.rolle,
      },
    });
  } catch (error) {
    console.error('Innlogging feilet:', error);
    res.status(500).json({ feil: 'Serverfeil ved innlogging' });
  }
});

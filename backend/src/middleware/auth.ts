import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { hentBruker } from '../data/brukere';

export interface AuthRequest extends Request {
  brukerId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'din-hemmelige-nøkkel-her';

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ feil: 'Ingen token oppgitt' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { brukerId: string };
    
    req.brukerId = decoded.brukerId;
    next();
  } catch (error) {
    console.error('Auth-feil:', error);
    res.status(401).json({ feil: 'Ugyldig token' });
  }
}

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const brukerId = req.brukerId;
  if (!brukerId) {
    res.status(401).json({ feil: 'Mangler autentisering' });
    return;
  }

  const bruker = hentBruker(brukerId);
  if (!bruker || bruker.rolle !== 'admin') {
    res.status(403).json({ feil: 'Krever admin-tilgang' });
    return;
  }

  next();
}

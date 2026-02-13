import { Request, Response, NextFunction } from 'express';
import { requireAuth, getAuth, clerkClient } from '@clerk/express';
import { hentBruker, hentBrukerMedClerkId, lagreBruker } from '../data/brukere';
import { Bruker } from '../types/bruker';

export interface AuthRequest extends Request {
  brukerId?: string;
  clerkUserId?: string;
}

export const clerkAuthMiddleware = requireAuth();

export async function brukerMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const auth = getAuth(req);
    
    if (!auth.userId) {
      res.status(401).json({ feil: 'Ikke autentisert' });
      return;
    }

    req.clerkUserId = auth.userId;

    let bruker = hentBrukerMedClerkId(auth.userId);
    
    if (!bruker) {
      try {
        const clerkUser = await clerkClient.users.getUser(auth.userId);
        
        bruker = {
          id: crypto.randomUUID(),
          clerkId: auth.userId,
          brukernavn: clerkUser.username || clerkUser.firstName || 'Bruker',
          epost: clerkUser.emailAddresses[0]?.emailAddress || '',
          rolle: 'bruker',
          opprettet: new Date(),
        };
      } catch (clerkError) {
        console.error('Clerk API feil:', clerkError);
        bruker = {
          id: crypto.randomUUID(),
          clerkId: auth.userId,
          brukernavn: 'Bruker',
          epost: '',
          rolle: 'bruker',
          opprettet: new Date(),
        };
      }
      
      lagreBruker(bruker);
    }

    req.brukerId = bruker.id;
    next();
  } catch (error) {
    console.error('Auth-feil:', error);
    res.status(401).json({ feil: 'Autentisering feilet' });
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

export type Rolle = 'bruker' | 'admin';

export interface Team {
  id: string;
  navn: string;
  opprettet: Date;
}

export interface Bruker {
  id: string;
  clerkId?: string; // Optional for backwards compatibility
  brukernavn: string;
  epost: string;
  passord?: string; // Hashed password
  rolle: Rolle;
  teamId?: string;
  opprettet: Date;
}

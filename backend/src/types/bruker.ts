export type Rolle = 'bruker' | 'admin';

export interface Team {
  id: string;
  navn: string;
  opprettet: Date;
}

export interface Bruker {
  id: string;
  clerkId: string;
  brukernavn: string;
  epost: string;
  rolle: Rolle;
  teamId?: string;
  opprettet: Date;
}

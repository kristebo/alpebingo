import { Bruker, Team } from '../types/bruker';

export const brukere: Map<string, Bruker> = new Map();
export const teams: Map<string, Team> = new Map();

export function hentBrukerMedEpost(epost: string): Bruker | undefined {
  for (const bruker of brukere.values()) {
    if (bruker.epost === epost) return bruker;
  }
  return undefined;
}

export function hentBruker(id: string): Bruker | undefined {
  return brukere.get(id);
}

export function lagreBruker(bruker: Bruker): void {
  brukere.set(bruker.id, bruker);
}

export function hentAlleBrukere(): Bruker[] {
  return Array.from(brukere.values());
}

export function hentTeam(id: string): Team | undefined {
  return teams.get(id);
}

export function hentAlleTeams(): Team[] {
  return Array.from(teams.values());
}

export function lagreTeam(team: Team): void {
  teams.set(team.id, team);
}

export function slettTeam(id: string): boolean {
  return teams.delete(id);
}

import { BingoKort } from '../types/bingo';

export const bingoKort: Map<string, BingoKort> = new Map();

export function hentKortForBruker(brukerId: string): BingoKort | undefined {
  for (const kort of bingoKort.values()) {
    if (kort.brukerId === brukerId) return kort;
  }
  return undefined;
}

export function lagreKort(kort: BingoKort): void {
  bingoKort.set(kort.id, kort);
}

export function hentKort(id: string): BingoKort | undefined {
  return bingoKort.get(id);
}

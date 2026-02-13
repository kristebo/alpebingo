export interface Kategori {
  id: string;
  navn: string;
  opprettet: Date;
}

export interface BingoFelt {
  id: string;
  tekst: string;
  kategoriId: string;
  aktiv: boolean;
  opprettet: Date;
}

export interface BingoKort {
  id: string;
  brukerId: string;
  felt: BingoFelt[][];
  kryssedeFelt: string[];
  opprettet: Date;
}

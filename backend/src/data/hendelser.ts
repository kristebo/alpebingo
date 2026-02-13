import { BingoFelt, Kategori } from '../types/bingo';

export const kategorier: Map<string, Kategori> = new Map([
  ['heis', { id: 'heis', navn: 'Heis', opprettet: new Date() }],
  ['barn', { id: 'barn', navn: 'Barn', opprettet: new Date() }],
  ['uhell', { id: 'uhell', navn: 'Uhell', opprettet: new Date() }],
  ['skiskole', { id: 'skiskole', navn: 'Skiskole', opprettet: new Date() }],
  ['antrekk', { id: 'antrekk', navn: 'Antrekk', opprettet: new Date() }],
  ['sikkerhet', { id: 'sikkerhet', navn: 'Sikkerhet', opprettet: new Date() }],
  ['sosiale-medier', { id: 'sosiale-medier', navn: 'Sosiale medier', opprettet: new Date() }],
  ['kantine', { id: 'kantine', navn: 'Kantine', opprettet: new Date() }],
  ['praktisk', { id: 'praktisk', navn: 'Praktisk', opprettet: new Date() }],
  ['annet', { id: 'annet', navn: 'Annet', opprettet: new Date() }],
]);

export const alpinHendelser: Map<string, BingoFelt> = new Map([
  ['1', { id: '1', tekst: 'Noen faller i heiskøen', kategoriId: 'heis', aktiv: true, opprettet: new Date() }],
  ['2', { id: '2', tekst: 'Barn gråter i bakken', kategoriId: 'barn', aktiv: true, opprettet: new Date() }],
  ['3', { id: '3', tekst: 'Noen mister en ski', kategoriId: 'uhell', aktiv: true, opprettet: new Date() }],
  ['4', { id: '4', tekst: 'Voksen på skiskole', kategoriId: 'skiskole', aktiv: true, opprettet: new Date() }],
  ['5', { id: '5', tekst: 'Krasj mellom skiløpere', kategoriId: 'uhell', aktiv: true, opprettet: new Date() }],
  ['6', { id: '6', tekst: 'Noen kjører feil vei', kategoriId: 'uhell', aktiv: true, opprettet: new Date() }],
  ['7', { id: '7', tekst: 'Heisen stopper', kategoriId: 'heis', aktiv: true, opprettet: new Date() }],
  ['8', { id: '8', tekst: 'Barn i snørekøen', kategoriId: 'heis', aktiv: true, opprettet: new Date() }],
  ['9', { id: '9', tekst: 'Noen går på ski i jeans', kategoriId: 'antrekk', aktiv: true, opprettet: new Date() }],
  ['10', { id: '10', tekst: 'Skiløper uten hjelm', kategoriId: 'sikkerhet', aktiv: true, opprettet: new Date() }],
  ['11', { id: '11', tekst: 'Noen tar selfie i bakken', kategoriId: 'sosiale-medier', aktiv: true, opprettet: new Date() }],
  ['12', { id: '12', tekst: 'Køkaos i kantina', kategoriId: 'kantine', aktiv: true, opprettet: new Date() }],
  ['13', { id: '13', tekst: 'Noen klager på prisen', kategoriId: 'kantine', aktiv: true, opprettet: new Date() }],
  ['14', { id: '14', tekst: 'Barn som ikke vil hjem', kategoriId: 'barn', aktiv: true, opprettet: new Date() }],
  ['15', { id: '15', tekst: 'Noen har glemt skipass', kategoriId: 'praktisk', aktiv: true, opprettet: new Date() }],
  ['16', { id: '16', tekst: 'Skiløper i shorts', kategoriId: 'antrekk', aktiv: true, opprettet: new Date() }],
  ['17', { id: '17', tekst: 'Noen trenger hjelp med bindinger', kategoriId: 'praktisk', aktiv: true, opprettet: new Date() }],
  ['18', { id: '18', tekst: 'Forelder bærer barn oppover', kategoriId: 'barn', aktiv: true, opprettet: new Date() }],
  ['19', { id: '19', tekst: 'Noen snubler i skisko', kategoriId: 'uhell', aktiv: true, opprettet: new Date() }],
  ['20', { id: '20', tekst: 'Fullt i parkeringen', kategoriId: 'praktisk', aktiv: true, opprettet: new Date() }],
  ['21', { id: '21', tekst: 'Noen har med egen mat', kategoriId: 'kantine', aktiv: true, opprettet: new Date() }],
  ['22', { id: '22', tekst: 'Barn på akebrett i skiløypa', kategoriId: 'barn', aktiv: true, opprettet: new Date() }],
  ['23', { id: '23', tekst: 'Noen sitter midt i bakken', kategoriId: 'uhell', aktiv: true, opprettet: new Date() }],
  ['24', { id: '24', tekst: 'Høy musikk fra høyttaler', kategoriId: 'annet', aktiv: true, opprettet: new Date() }],
  ['25', { id: '25', tekst: 'Noen filmer seg selv', kategoriId: 'sosiale-medier', aktiv: true, opprettet: new Date() }],
]);

export function hentAlleKategorier(): Kategori[] {
  return Array.from(kategorier.values());
}

export function hentKategori(id: string): Kategori | undefined {
  return kategorier.get(id);
}

export function lagreKategori(kategori: Kategori): void {
  kategorier.set(kategori.id, kategori);
}

export function slettKategori(id: string): boolean {
  return kategorier.delete(id);
}

export function hentAlleHendelser(): BingoFelt[] {
  return Array.from(alpinHendelser.values());
}

export function hentAktiveHendelser(): BingoFelt[] {
  return Array.from(alpinHendelser.values()).filter(h => h.aktiv);
}

export function hentHendelse(id: string): BingoFelt | undefined {
  return alpinHendelser.get(id);
}

export function lagreHendelse(hendelse: BingoFelt): void {
  alpinHendelser.set(hendelse.id, hendelse);
}

export function slettHendelse(id: string): boolean {
  return alpinHendelser.delete(id);
}

export function genererTilfeldigKort(brukerId: string): { id: string; brukerId: string; felt: BingoFelt[][]; kryssedeFelt: string[]; opprettet: Date } {
  const aktiveHendelser = hentAktiveHendelser();
  const stokkedeHendelser = [...aktiveHendelser].sort(() => Math.random() - 0.5);
  const valgte = stokkedeHendelser.slice(0, 25);
  
  const felt: BingoFelt[][] = [];
  for (let rad = 0; rad < 5; rad++) {
    felt.push(valgte.slice(rad * 5, rad * 5 + 5));
  }

  return {
    id: crypto.randomUUID(),
    brukerId,
    felt,
    kryssedeFelt: [],
    opprettet: new Date(),
  };
}

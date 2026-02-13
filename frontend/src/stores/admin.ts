import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

interface Bruker {
  id: string;
  brukernavn: string;
  epost: string;
  rolle: 'bruker' | 'admin';
  teamId?: string;
  opprettet: string;
}

interface Team {
  id: string;
  navn: string;
  opprettet: string;
}

interface Kategori {
  id: string;
  navn: string;
  opprettet: string;
}

interface Hendelse {
  id: string;
  tekst: string;
  kategoriId: string;
  aktiv: boolean;
  opprettet: string;
}

export const useAdminStore = defineStore('admin', () => {
  const brukere = ref<Bruker[]>([]);
  const teams = ref<Team[]>([]);
  const kategorier = ref<Kategori[]>([]);
  const hendelser = ref<Hendelse[]>([]);
  const laster = ref(false);

  async function hentBrukere() {
    laster.value = true;
    try {
      brukere.value = await api.get('/admin/brukere');
    } finally {
      laster.value = false;
    }
  }

  async function oppdaterBrukerTeam(brukerId: string, teamId: string | null) {
    await api.put(`/admin/brukere/${brukerId}/team`, { teamId });
    await hentBrukere();
  }

  async function oppdaterBrukerRolle(brukerId: string, rolle: 'bruker' | 'admin') {
    await api.put(`/admin/brukere/${brukerId}/rolle`, { rolle });
    await hentBrukere();
  }

  async function hentTeams() {
    teams.value = await api.get('/admin/teams');
  }

  async function opprettTeam(navn: string) {
    await api.post('/admin/teams', { navn });
    await hentTeams();
  }

  async function oppdaterTeam(teamId: string, navn: string) {
    await api.put(`/admin/teams/${teamId}`, { navn });
    await hentTeams();
  }

  async function slettTeam(teamId: string) {
    await api.delete(`/admin/teams/${teamId}`);
    await hentTeams();
  }

  async function hentKategorier() {
    kategorier.value = await api.get('/admin/kategorier');
  }

  async function opprettKategori(navn: string) {
    await api.post('/admin/kategorier', { navn });
    await hentKategorier();
  }

  async function oppdaterKategori(kategoriId: string, navn: string) {
    await api.put(`/admin/kategorier/${kategoriId}`, { navn });
    await hentKategorier();
  }

  async function slettKategori(kategoriId: string) {
    await api.delete(`/admin/kategorier/${kategoriId}`);
    await hentKategorier();
  }

  async function hentHendelser() {
    hendelser.value = await api.get('/admin/hendelser');
  }

  async function opprettHendelse(tekst: string, kategoriId: string) {
    await api.post('/admin/hendelser', { tekst, kategoriId, aktiv: true });
    await hentHendelser();
  }

  async function oppdaterHendelse(hendelseId: string, data: { tekst?: string; kategoriId?: string; aktiv?: boolean }) {
    await api.put(`/admin/hendelser/${hendelseId}`, data);
    await hentHendelser();
  }

  async function slettHendelse(hendelseId: string) {
    await api.delete(`/admin/hendelser/${hendelseId}`);
    await hentHendelser();
  }

  return {
    brukere,
    teams,
    kategorier,
    hendelser,
    laster,
    hentBrukere,
    oppdaterBrukerTeam,
    oppdaterBrukerRolle,
    hentTeams,
    opprettTeam,
    oppdaterTeam,
    slettTeam,
    hentKategorier,
    opprettKategori,
    oppdaterKategori,
    slettKategori,
    hentHendelser,
    opprettHendelse,
    oppdaterHendelse,
    slettHendelse,
  };
});

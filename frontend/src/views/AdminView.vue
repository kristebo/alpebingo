<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const aktivFane = ref<'brukere' | 'teams' | 'kategorier' | 'hendelser'>('brukere');

const nyTeamNavn = ref('');
const nyKategoriNavn = ref('');
const nyHendelseTekst = ref('');
const nyHendelseKategori = ref('');

onMounted(async () => {
  await Promise.all([
    adminStore.hentBrukere(),
    adminStore.hentTeams(),
    adminStore.hentKategorier(),
    adminStore.hentHendelser(),
  ]);
});

async function leggTilTeam() {
  if (!nyTeamNavn.value.trim()) return;
  await adminStore.opprettTeam(nyTeamNavn.value);
  nyTeamNavn.value = '';
}

async function leggTilKategori() {
  if (!nyKategoriNavn.value.trim()) return;
  await adminStore.opprettKategori(nyKategoriNavn.value);
  nyKategoriNavn.value = '';
}

async function leggTilHendelse() {
  if (!nyHendelseTekst.value.trim() || !nyHendelseKategori.value) return;
  await adminStore.opprettHendelse(nyHendelseTekst.value, nyHendelseKategori.value);
  nyHendelseTekst.value = '';
}

function hentTeamNavn(teamId?: string): string {
  if (!teamId) return '-';
  const team = adminStore.teams.find(t => t.id === teamId);
  return team?.navn || '-';
}

function hentKategoriNavn(kategoriId: string): string {
  const kategori = adminStore.kategorier.find(k => k.id === kategoriId);
  return kategori?.navn || kategoriId;
}
</script>

<template>
  <div class="admin-side">
    <h1>Administrasjon</h1>

    <div class="faner">
      <button 
        v-for="fane in ['brukere', 'teams', 'kategorier', 'hendelser']" 
        :key="fane"
        :class="['fane-knapp', { aktiv: aktivFane === fane }]"
        @click="aktivFane = fane as typeof aktivFane"
      >
        {{ fane.charAt(0).toUpperCase() + fane.slice(1) }}
      </button>
    </div>

    <div v-if="aktivFane === 'brukere'" class="panel">
      <h2>Brukere</h2>
      <table class="tabell">
        <thead>
          <tr>
            <th>Brukernavn</th>
            <th>E-post</th>
            <th>Rolle</th>
            <th>Team</th>
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bruker in adminStore.brukere" :key="bruker.id">
            <td>{{ bruker.brukernavn }}</td>
            <td>{{ bruker.epost }}</td>
            <td>
              <select 
                :value="bruker.rolle" 
                @change="adminStore.oppdaterBrukerRolle(bruker.id, ($event.target as HTMLSelectElement).value as 'bruker' | 'admin')"
              >
                <option value="bruker">Bruker</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td>
              <select 
                :value="bruker.teamId || ''" 
                @change="adminStore.oppdaterBrukerTeam(bruker.id, ($event.target as HTMLSelectElement).value || null)"
              >
                <option value="">Ingen team</option>
                <option v-for="team in adminStore.teams" :key="team.id" :value="team.id">
                  {{ team.navn }}
                </option>
              </select>
            </td>
            <td>{{ hentTeamNavn(bruker.teamId) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="aktivFane === 'teams'" class="panel">
      <h2>Teams</h2>
      <div class="legg-til-rad">
        <input v-model="nyTeamNavn" placeholder="Nytt team-navn" @keyup.enter="leggTilTeam" />
        <button class="knapp knapp-primær" @click="leggTilTeam">Legg til</button>
      </div>
      <table class="tabell">
        <thead>
          <tr>
            <th>Navn</th>
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in adminStore.teams" :key="team.id">
            <td>{{ team.navn }}</td>
            <td>
              <button class="knapp-liten slett" @click="adminStore.slettTeam(team.id)">Slett</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="aktivFane === 'kategorier'" class="panel">
      <h2>Kategorier</h2>
      <div class="legg-til-rad">
        <input v-model="nyKategoriNavn" placeholder="Ny kategori-navn" @keyup.enter="leggTilKategori" />
        <button class="knapp knapp-primær" @click="leggTilKategori">Legg til</button>
      </div>
      <table class="tabell">
        <thead>
          <tr>
            <th>Navn</th>
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="kategori in adminStore.kategorier" :key="kategori.id">
            <td>{{ kategori.navn }}</td>
            <td>
              <button class="knapp-liten slett" @click="adminStore.slettKategori(kategori.id)">Slett</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="aktivFane === 'hendelser'" class="panel">
      <h2>Bingofelt-hendelser</h2>
      <div class="legg-til-rad">
        <input v-model="nyHendelseTekst" placeholder="Ny hendelse-tekst" />
        <select v-model="nyHendelseKategori">
          <option value="">Velg kategori</option>
          <option v-for="kategori in adminStore.kategorier" :key="kategori.id" :value="kategori.id">
            {{ kategori.navn }}
          </option>
        </select>
        <button class="knapp knapp-primær" @click="leggTilHendelse">Legg til</button>
      </div>
      <table class="tabell">
        <thead>
          <tr>
            <th>Tekst</th>
            <th>Kategori</th>
            <th>Aktiv</th>
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hendelse in adminStore.hendelser" :key="hendelse.id">
            <td>{{ hendelse.tekst }}</td>
            <td>{{ hentKategoriNavn(hendelse.kategoriId) }}</td>
            <td>
              <input 
                type="checkbox" 
                :checked="hendelse.aktiv"
                @change="adminStore.oppdaterHendelse(hendelse.id, { aktiv: ($event.target as HTMLInputElement).checked })"
              />
            </td>
            <td>
              <button class="knapp-liten slett" @click="adminStore.slettHendelse(hendelse.id)">Slett</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.admin-side {
  max-width: 1000px;
  margin: 0 auto;
}

.admin-side h1 {
  margin-bottom: var(--mellomrom-lg);
}

.faner {
  display: flex;
  gap: var(--mellomrom-sm);
  margin-bottom: var(--mellomrom-lg);
  border-bottom: 1px solid var(--farge-grense);
  padding-bottom: var(--mellomrom-sm);
}

.fane-knapp {
  padding: var(--mellomrom-sm) var(--mellomrom-md);
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--farge-tekst-dempet);
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.fane-knapp:hover {
  background: var(--farge-hover);
}

.fane-knapp.aktiv {
  color: var(--farge-primær);
  background: var(--farge-primær-alpha);
  font-weight: 500;
}

.panel {
  background: var(--farge-bakgrunn-kort);
  padding: var(--mellomrom-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--farge-grense);
}

.panel h2 {
  margin-bottom: var(--mellomrom-md);
}

.legg-til-rad {
  display: flex;
  gap: var(--mellomrom-sm);
  margin-bottom: var(--mellomrom-lg);
}

.legg-til-rad input,
.legg-til-rad select {
  padding: var(--mellomrom-sm) var(--mellomrom-md);
  border: 1px solid var(--farge-grense);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  flex: 1;
}

.tabell {
  width: 100%;
  border-collapse: collapse;
}

.tabell th,
.tabell td {
  padding: var(--mellomrom-sm) var(--mellomrom-md);
  text-align: left;
  border-bottom: 1px solid var(--farge-grense);
}

.tabell th {
  font-weight: 600;
  color: var(--farge-tekst-dempet);
}

.tabell select {
  padding: var(--mellomrom-xs) var(--mellomrom-sm);
  border: 1px solid var(--farge-grense);
  border-radius: var(--radius-sm);
}

.knapp-liten {
  padding: var(--mellomrom-xs) var(--mellomrom-sm);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.85rem;
}

.knapp-liten.slett {
  background: var(--farge-feil);
  color: white;
}

.knapp-liten.slett:hover {
  opacity: 0.9;
}
</style>

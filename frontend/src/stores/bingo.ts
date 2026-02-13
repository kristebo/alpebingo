import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

interface BingoFelt {
  id: string;
  tekst: string;
  kategori: string;
}

interface BingoKort {
  id: string;
  brukerId: string;
  felt: BingoFelt[][];
  kryssedeFelt: string[];
  opprettet: string;
}

interface KryssFeltRespons {
  kort: BingoKort;
  harBingo: boolean;
}

export const useBingoStore = defineStore('bingo', () => {
  const kort = ref<BingoKort | null>(null);
  const harBingo = ref(false);
  const laster = ref(false);

  async function hentKort() {
    console.log('[BingoStore] hentKort() kalt');
    laster.value = true;
    try {
      kort.value = await api.get('/bingo/kort');
      console.log('[BingoStore] Kort hentet:', kort.value);
    } catch (error) {
      console.error('[BingoStore] Feil ved henting av kort:', error);
    } finally {
      laster.value = false;
    }
  }

  async function nyttKort() {
    console.log('[BingoStore] nyttKort() kalt');
    laster.value = true;
    try {
      kort.value = await api.post('/bingo/kort/nytt', {});
      console.log('[BingoStore] Nytt kort laget:', kort.value);
      harBingo.value = false;
    } catch (error) {
      console.error('[BingoStore] Feil ved oppretting av nytt kort:', error);
    } finally {
      laster.value = false;
    }
  }

  async function kryssFelt(feltId: string) {
    if (!kort.value) return;
    
    const respons = await api.post<KryssFeltRespons>(`/bingo/kort/${kort.value.id}/kryss/${feltId}`, {});
    kort.value = respons.kort;
    harBingo.value = respons.harBingo;
  }

  return { kort, harBingo, laster, hentKort, nyttKort, kryssFelt };
});

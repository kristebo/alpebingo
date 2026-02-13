import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/services/api';

interface Bruker {
  id: string;
  brukernavn: string;
  epost: string;
  rolle: 'bruker' | 'admin';
}

export const useAuthStore = defineStore('auth', () => {
  const bruker = ref<Bruker | null>(null);
  const laster = ref(false);

  const erInnlogget = computed(() => !!bruker.value);
  const erAdmin = computed(() => bruker.value?.rolle === 'admin');

  async function hentBrukerInfo() {
    laster.value = true;
    try {
      bruker.value = await api.get('/bruker/meg');
    } catch {
      bruker.value = null;
    } finally {
      laster.value = false;
    }
  }

  function nullstill() {
    bruker.value = null;
  }

  return { bruker, laster, erInnlogget, erAdmin, hentBrukerInfo, nullstill };
});

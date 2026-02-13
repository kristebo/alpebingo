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
  const token = ref<string | null>(localStorage.getItem('token'));
  const laster = ref(false);

  const erInnlogget = computed(() => !!bruker.value && !!token.value);
  const erAdmin = computed(() => bruker.value?.rolle === 'admin');

  async function loggInn(epost: string, passord: string) {
    laster.value = true;
    try {
      const data = await api.post<{ token: string; bruker: Bruker }>('/auth/logg-inn', { epost, passord });
      token.value = data.token;
      bruker.value = data.bruker;
      localStorage.setItem('token', data.token);
      return true;
    } catch (error) {
      console.error('Innlogging feilet:', error);
      return false;
    } finally {
      laster.value = false;
    }
  }

  async function registrer(brukernavn: string, epost: string, passord: string) {
    laster.value = true;
    try {
      const data = await api.post<{ token: string; bruker: Bruker }>('/auth/registrer', { brukernavn, epost, passord });
      token.value = data.token;
      bruker.value = data.bruker;
      localStorage.setItem('token', data.token);
      return true;
    } catch (error) {
      console.error('Registrering feilet:', error);
      return false;
    } finally {
      laster.value = false;
    }
  }

  async function hentBrukerInfo() {
    if (!token.value) return;
    
    laster.value = true;
    try {
      bruker.value = await api.get('/bruker/meg');
    } catch {
      // Token er ugyldig, logg ut
      loggUt();
    } finally {
      laster.value = false;
    }
  }

  function loggUt() {
    bruker.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return { 
    bruker, 
    token,
    laster, 
    erInnlogget, 
    erAdmin, 
    loggInn,
    registrer,
    hentBrukerInfo, 
    loggUt 
  };
});

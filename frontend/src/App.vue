<script setup lang="ts">
import { watch, ref } from 'vue';
import { RouterView } from 'vue-router';
import { useAuth, useSession } from '@clerk/vue';
import NavBar from './components/NavBar.vue';
import { setTokenGetter } from './services/api';
import { useAuthStore } from './stores/auth';

const { isSignedIn, isLoaded } = useAuth();
const { session } = useSession();
const authStore = useAuthStore();

console.log('[App] Init - isLoaded:', isLoaded.value, 'isSignedIn:', isSignedIn.value, 'session:', session.value);

setTokenGetter(async () => {
  try {
    console.log('[App] Token getter kalt, isLoaded:', isLoaded.value, 'session:', session.value);
    
    // Vent på at Clerk er ferdig lastet
    if (!isLoaded.value) {
      console.log('[App] Clerk ikke lastet ennå, venter...');
      await new Promise<void>((resolve) => {
        const unwatch = watch(isLoaded, (loaded) => {
          console.log('[App] isLoaded endret til:', loaded);
          if (loaded) {
            unwatch();
            resolve();
          }
        }, { immediate: true });
      });
      console.log('[App] Clerk er nå lastet');
    }
    
    const currentSession = session.value;
    if (!currentSession) {
      console.log('[App] Ingen session tilgjengelig');
      return null;
    }
    
    console.log('[App] Henter token fra session...');
    const token = await currentSession.getToken();
    console.log('[App] Token hentet:', token ? `${token.substring(0, 30)}...` : 'null');
    return token;
  } catch (e) {
    console.error('[App] Feil ved henting av token:', e);
    return null;
  }
});

watch([isLoaded, isSignedIn], async ([loaded, signedIn]) => {
  console.log('[App] Auth state endret - isLoaded:', loaded, 'isSignedIn:', signedIn);
  if (loaded && signedIn) {
    await authStore.hentBrukerInfo();
  } else if (loaded && !signedIn) {
    authStore.nullstill();
  }
}, { immediate: true });
</script>

<template>
  <div class="app">
    <NavBar />
    <main class="hovedinnhold">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hovedinnhold {
  flex: 1;
  padding: var(--mellomrom-lg);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

// Hent brukerinfo når appen laster hvis vi har en token
onMounted(async () => {
  if (authStore.token) {
    await authStore.hentBrukerInfo();
  }
});
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

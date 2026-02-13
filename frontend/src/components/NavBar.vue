<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function loggUt() {
  authStore.loggUt();
  router.push('/logginn');
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-innhold">
      <RouterLink to="/" class="logo">
        🎿 Alpinbingo
      </RouterLink>
      
      <div class="nav-lenker">
        <template v-if="authStore.erInnlogget">
          <RouterLink to="/bingo" class="nav-lenke">Mitt kort</RouterLink>
          <RouterLink to="/kart" class="nav-lenke">🗺️ Kart</RouterLink>
          <RouterLink v-if="authStore.erAdmin" to="/admin" class="nav-lenke">Admin</RouterLink>
          <div class="bruker-info">
            <span>{{ authStore.bruker?.brukernavn }}</span>
            <button @click="loggUt" class="knapp knapp-sekundær">Logg ut</button>
          </div>
        </template>
        <template v-else>
          <RouterLink to="/logginn" class="knapp knapp-sekundær">Logg inn</RouterLink>
          <RouterLink to="/registrer" class="knapp knapp-primær">Registrer</RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: var(--farge-bakgrunn-nav);
  border-bottom: 1px solid var(--farge-grense);
  padding: var(--mellomrom-md) var(--mellomrom-lg);
}

.navbar-innhold {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--farge-primær);
  text-decoration: none;
}

.nav-lenker {
  display: flex;
  gap: var(--mellomrom-md);
  align-items: center;
}

.nav-lenke {
  color: var(--farge-tekst);
  text-decoration: none;
  padding: var(--mellomrom-sm) var(--mellomrom-md);
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}

.nav-lenke:hover {
  background: var(--farge-hover);
}

.bruker-info {
  display: flex;
  align-items: center;
  gap: var(--mellomrom-md);
}

.bruker-info span {
  color: var(--farge-tekst);
  font-weight: 500;
}

.knapp {
  padding: var(--mellomrom-sm) var(--mellomrom-md);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.knapp:hover {
  opacity: 0.9;
}

.knapp-primær {
  background: var(--farge-primær);
  color: white;
}

.knapp-sekundær {
  background: var(--farge-sekundær);
  color: var(--farge-tekst);
}
</style>

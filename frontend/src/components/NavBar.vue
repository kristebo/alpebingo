<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { SignedIn, SignedOut, UserButton } from '@clerk/vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <nav class="navbar">
    <div class="navbar-innhold">
      <RouterLink to="/" class="logo">
        🎿 Alpinbingo
      </RouterLink>
      
      <div class="nav-lenker">
        <SignedIn>
          <RouterLink to="/bingo" class="nav-lenke">Mitt kort</RouterLink>
          <RouterLink to="/kart" class="nav-lenke">🗺️ Kart</RouterLink>
          <RouterLink v-if="authStore.erAdmin" to="/admin" class="nav-lenke">Admin</RouterLink>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <RouterLink to="/logginn" class="knapp knapp-sekundær">Logg inn</RouterLink>
          <RouterLink to="/registrer" class="knapp knapp-primær">Registrer</RouterLink>
        </SignedOut>
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
</style>

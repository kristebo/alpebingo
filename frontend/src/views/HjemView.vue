<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="hjem">
    <div class="hero">
      <h1 class="tittel">🎿 Alpinbingo</h1>
      <p class="undertittel">Bøler Alpinlandslag</p>
      <p class="beskrivelse">
        Gjør alpindagen mer spennende! Kryss av hendelser du ser i bakken og vinn bingo!
      </p>
      
      <div class="handlinger">
        <RouterLink 
          v-if="authStore.erInnlogget" 
          to="/bingo" 
          class="knapp knapp-primær knapp-stor"
        >
          Se mitt kort
        </RouterLink>
        <template v-else>
          <RouterLink to="/registrer" class="knapp knapp-primær knapp-stor">
            Kom i gang
          </RouterLink>
          <RouterLink to="/logginn" class="knapp knapp-sekundær knapp-stor">
            Logg inn
          </RouterLink>
        </template>
      </div>
    </div>

    <div class="funksjoner">
      <div class="funksjon-kort">
        <span class="funksjon-ikon">🎯</span>
        <h3>25 morsomme felt</h3>
        <p>Typiske hendelser du garantert ser i alpinbakken</p>
      </div>
      <div class="funksjon-kort">
        <span class="funksjon-ikon">📱</span>
        <h3>Bruk på mobilen</h3>
        <p>Ta med bingokortet i bakken</p>
      </div>
      <div class="funksjon-kort">
        <span class="funksjon-ikon">🏆</span>
        <h3>Vinn bingo!</h3>
        <p>Kryss av rad, kolonne eller diagonal</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hjem {
  text-align: center;
}

.hero {
  padding: var(--mellomrom-xl) 0;
}

.tittel {
  font-size: 3rem;
  color: var(--farge-primær);
  margin-bottom: var(--mellomrom-sm);
}

.undertittel {
  font-size: 1.5rem;
  color: var(--farge-tekst-dempet);
  margin-bottom: var(--mellomrom-lg);
}

.beskrivelse {
  font-size: 1.2rem;
  max-width: 500px;
  margin: 0 auto var(--mellomrom-xl);
  color: var(--farge-tekst);
}

.handlinger {
  display: flex;
  gap: var(--mellomrom-md);
  justify-content: center;
  flex-wrap: wrap;
}

.funksjoner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--mellomrom-lg);
  margin-top: var(--mellomrom-xl);
}

.funksjon-kort {
  background: var(--farge-bakgrunn-kort);
  padding: var(--mellomrom-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--farge-grense);
}

.funksjon-ikon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: var(--mellomrom-md);
}

.funksjon-kort h3 {
  margin-bottom: var(--mellomrom-sm);
  color: var(--farge-tekst);
}

.funksjon-kort p {
  color: var(--farge-tekst-dempet);
}
</style>

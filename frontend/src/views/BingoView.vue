<script setup lang="ts">
import { watch, watchEffect } from 'vue';
import { useAuth } from '@clerk/vue';
import { useBingoStore } from '@/stores/bingo';
import BingoKort from '@/components/BingoKort.vue';

const { isSignedIn } = useAuth();
const bingoStore = useBingoStore();

console.log('[BingoView] Komponent montert, isSignedIn:', isSignedIn.value);

watchEffect(() => {
  console.log('[BingoView] watchEffect - isSignedIn:', isSignedIn.value, 'kort:', bingoStore.kort, 'laster:', bingoStore.laster);
});

watch(isSignedIn, (signedIn, oldVal) => {
  console.log('[BingoView] isSignedIn endret fra', oldVal, 'til', signedIn);
  if (signedIn) {
    console.log('[BingoView] Kaller hentKort()...');
    bingoStore.hentKort();
  }
}, { immediate: true });
</script>

<template>
  <div class="bingo-side">
    <template v-if="!isSignedIn">
      <div class="ikke-innlogget">
        <h2>Du må logge inn for å se bingokort</h2>
        <p>Gå til <router-link to="/logginn">Logg inn</router-link> for å starte.</p>
      </div>
    </template>

    <template v-else>
      <div class="bingo-header">
        <h1>Mitt Bingokort</h1>
        <button @click="bingoStore.nyttKort()" class="knapp knapp-sekundær">
          🔄 Nytt kort
        </button>
      </div>

      <div v-if="bingoStore.laster" class="laster">
        Laster kort...
      </div>

      <template v-else-if="bingoStore.kort">
        <div v-if="bingoStore.harBingo" class="bingo-feiring">
          🎉 BINGO! 🎉
        </div>

        <BingoKort
          :felt="bingoStore.kort.felt"
          :kryssede-felt="bingoStore.kort.kryssedeFelt"
          @kryss="bingoStore.kryssFelt($event)"
        />

        <p class="krysset-teller">
          {{ bingoStore.kort.kryssedeFelt.length }} av 25 felt krysset
        </p>
      </template>
    </template>
  </div>
</template>

<style scoped>
.bingo-side {
  max-width: 700px;
  margin: 0 auto;
}

.ikke-innlogget {
  text-align: center;
  padding: var(--mellomrom-xl);
  background: var(--farge-bakgrunn-sekundær);
  border-radius: var(--radius-lg);
}

.ikke-innlogget h2 {
  margin-bottom: var(--mellomrom-md);
}

.ikke-innlogget a {
  color: var(--farge-primær);
  font-weight: bold;
}

.bingo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--mellomrom-lg);
  flex-wrap: wrap;
  gap: var(--mellomrom-md);
}

.bingo-header h1 {
  color: var(--farge-tekst);
}

.laster {
  text-align: center;
  padding: var(--mellomrom-xl);
  color: var(--farge-tekst-dempet);
}

.bingo-feiring {
  text-align: center;
  font-size: 2rem;
  padding: var(--mellomrom-lg);
  background: var(--farge-suksess-bakgrunn);
  border-radius: var(--radius-lg);
  margin-bottom: var(--mellomrom-lg);
  animation: puls 1s infinite;
}

@keyframes puls {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.krysset-teller {
  text-align: center;
  margin-top: var(--mellomrom-lg);
  color: var(--farge-tekst-dempet);
}
</style>

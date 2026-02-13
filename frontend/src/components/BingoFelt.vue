<script setup lang="ts">
defineProps<{
  felt: {
    id: string;
    tekst: string;
    kategori: string;
  };
  erKrysset: boolean;
}>();

const emit = defineEmits<{
  kryss: [feltId: string];
}>();
</script>

<template>
  <button
    class="bingo-felt"
    :class="{ 'krysset': erKrysset }"
    @click="emit('kryss', felt.id)"
  >
    <span class="felt-tekst">{{ felt.tekst }}</span>
    <span v-if="erKrysset" class="kryss-merke">✓</span>
  </button>
</template>

<style scoped>
.bingo-felt {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--mellomrom-sm);
  background: var(--farge-bakgrunn-kort);
  border: 2px solid var(--farge-grense);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  text-align: center;
}

.bingo-felt:hover:not(.krysset) {
  background: var(--farge-hover);
  border-color: var(--farge-primær);
  transform: scale(1.02);
}

.bingo-felt.krysset {
  background: var(--farge-suksess-bakgrunn);
  border-color: var(--farge-suksess);
}

.felt-tekst {
  font-size: 0.85rem;
  line-height: 1.3;
  color: var(--farge-tekst);
}

.kryss-merke {
  position: absolute;
  top: 4px;
  right: 6px;
  font-size: 1.2rem;
  color: var(--farge-suksess);
}
</style>

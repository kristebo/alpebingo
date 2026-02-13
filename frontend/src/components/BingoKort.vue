<script setup lang="ts">
import BingoFelt from './BingoFelt.vue';

defineProps<{
  felt: {
    id: string;
    tekst: string;
    kategori: string;
  }[][];
  kryssedeFelt: string[];
}>();

const emit = defineEmits<{
  kryss: [feltId: string];
}>();
</script>

<template>
  <div class="bingo-kort">
    <div v-for="(rad, radIndex) in felt" :key="radIndex" class="bingo-rad">
      <BingoFelt
        v-for="f in rad"
        :key="f.id"
        :felt="f"
        :er-krysset="kryssedeFelt.includes(f.id)"
        @kryss="emit('kryss', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.bingo-kort {
  display: flex;
  flex-direction: column;
  gap: var(--mellomrom-sm);
  max-width: 600px;
  margin: 0 auto;
}

.bingo-rad {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--mellomrom-sm);
}
</style>

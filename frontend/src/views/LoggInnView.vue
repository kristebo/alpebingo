<script setup lang="ts">
import { SignIn } from '@clerk/vue';
</script>

<template>
  <div class="auth-side">
    <div class="auth-kort">
      <h1>Logg inn</h1>
      <SignIn 
        :routing="'path'" 
        path="/logginn"
        sign-up-url="/registrer"
      />
    </div>
  </div>
</template>

<style scoped>
.auth-side {
  display: flex;
  justify-content: center;
  padding: var(--mellomrom-xl) 0;
}

.auth-kort {
  background: var(--farge-bakgrunn-kort);
  padding: var(--mellomrom-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--farge-grense);
  width: 100%;
  max-width: 450px;
}

.auth-kort h1 {
  text-align: center;
  margin-bottom: var(--mellomrom-lg);
  color: var(--farge-tekst);
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const epost = ref('');
const passord = ref('');
const feilmelding = ref('');

async function loggInn() {
  feilmelding.value = '';
  
  const suksess = await authStore.loggInn(epost.value, passord.value);
  if (suksess) {
    router.push('/');
  } else {
    feilmelding.value = 'Ugyldig epost eller passord';
  }
}
</script>

<template>
  <div class="auth-side">
    <div class="auth-kort">
      <h1>Logg inn</h1>
      
      <form @submit.prevent="loggInn">
        <div class="form-gruppe">
          <label for="epost">Epost</label>
          <input 
            id="epost" 
            v-model="epost" 
            type="email" 
            required
            autocomplete="email"
          />
        </div>

        <div class="form-gruppe">
          <label for="passord">Passord</label>
          <input 
            id="passord" 
            v-model="passord" 
            type="password" 
            required
            autocomplete="current-password"
          />
        </div>

        <div v-if="feilmelding" class="feilmelding">
          {{ feilmelding }}
        </div>

        <button type="submit" class="btn-primær" :disabled="authStore.laster">
          {{ authStore.laster ? 'Logger inn...' : 'Logg inn' }}
        </button>
      </form>

      <p class="registrer-link">
        Har du ikke konto? <router-link to="/registrer">Registrer deg her</router-link>
      </p>
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

.form-gruppe {
  margin-bottom: var(--mellomrom-md);
}

.form-gruppe label {
  display: block;
  margin-bottom: var(--mellomrom-xs);
  font-weight: 500;
  color: var(--farge-tekst);
}

.form-gruppe input {
  width: 100%;
  padding: var(--mellomrom-sm);
  border: 1px solid var(--farge-grense);
  border-radius: var(--radius-md);
  font-size: 1rem;
  background: var(--farge-bakgrunn);
  color: var(--farge-tekst);
}

.form-gruppe input:focus {
  outline: none;
  border-color: var(--farge-primær);
}

.feilmelding {
  color: #e63946;
  margin-bottom: var(--mellomrom-md);
  text-align: center;
  padding: var(--mellomrom-sm);
  background: rgba(230, 57, 70, 0.1);
  border-radius: var(--radius-md);
}

.btn-primær {
  width: 100%;
  padding: var(--mellomrom-md);
  background: var(--farge-primær);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primær:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primær:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.registrer-link {
  text-align: center;
  margin-top: var(--mellomrom-md);
  color: var(--farge-tekst-sekundær);
}

.registrer-link a {
  color: var(--farge-primær);
  text-decoration: none;
}

.registrer-link a:hover {
  text-decoration: underline;
}
</style>

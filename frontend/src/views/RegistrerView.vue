<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const brukernavn = ref('');
const epost = ref('');
const passord = ref('');
const bekreftPassord = ref('');
const feilmelding = ref('');

async function registrer() {
  feilmelding.value = '';
  
  if (passord.value !== bekreftPassord.value) {
    feilmelding.value = 'Passordene matcher ikke';
    return;
  }

  if (passord.value.length < 6) {
    feilmelding.value = 'Passordet må være minst 6 tegn';
    return;
  }

  const suksess = await authStore.registrer(brukernavn.value, epost.value, passord.value);
  if (suksess) {
    router.push('/');
  } else {
    feilmelding.value = 'Registrering feilet. Eposten kan allerede være i bruk.';
  }
}
</script>

<template>
  <div class="auth-side">
    <div class="auth-kort">
      <h1>Registrer deg</h1>
      
      <form @submit.prevent="registrer">
        <div class="form-gruppe">
          <label for="brukernavn">Brukernavn</label>
          <input 
            id="brukernavn" 
            v-model="brukernavn" 
            type="text" 
            required
            autocomplete="username"
          />
        </div>

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
            autocomplete="new-password"
            minlength="6"
          />
        </div>

        <div class="form-gruppe">
          <label for="bekreft-passord">Bekreft passord</label>
          <input 
            id="bekreft-passord" 
            v-model="bekreftPassord" 
            type="password" 
            required
            autocomplete="new-password"
            minlength="6"
          />
        </div>

        <div v-if="feilmelding" class="feilmelding">
          {{ feilmelding }}
        </div>

        <button type="submit" class="btn-primær" :disabled="authStore.laster">
          {{ authStore.laster ? 'Registrerer...' : 'Registrer' }}
        </button>
      </form>

      <p class="logg-inn-link">
        Har du allerede konto? <router-link to="/logginn">Logg inn her</router-link>
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

.logg-inn-link {
  text-align: center;
  margin-top: var(--mellomrom-md);
  color: var(--farge-tekst-sekundær);
}

.logg-inn-link a {
  color: var(--farge-primær);
  text-decoration: none;
}

.logg-inn-link a:hover {
  text-decoration: underline;
}
</style>

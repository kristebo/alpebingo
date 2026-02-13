import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { clerkPlugin } from '@clerk/vue';
import App from './App.vue';
import router from './router';
import './stil/main.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Mangler VITE_CLERK_PUBLISHABLE_KEY i miljøvariabler');
}

const app = createApp(App);

app.use(createPinia());
app.use(clerkPlugin, {
  publishableKey: PUBLISHABLE_KEY,
});
app.use(router);

app.mount('#app');

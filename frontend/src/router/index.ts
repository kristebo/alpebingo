import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'hjem',
      component: () => import('@/views/HjemView.vue'),
    },
    {
      path: '/logginn',
      name: 'logginn',
      component: () => import('@/views/LoggInnView.vue'),
    },
    {
      path: '/registrer',
      name: 'registrer',
      component: () => import('@/views/RegistrerView.vue'),
    },
    {
      path: '/bingo',
      name: 'bingo',
      component: () => import('@/views/BingoView.vue'),
      meta: { kreverAuth: true },
    },
    {
      path: '/kart',
      name: 'kart',
      component: () => import('@/views/KartView.vue'),
      meta: { kreverAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { kreverAuth: true, kreverAdmin: true },
    },
  ],
});

// Auth guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.kreverAuth && !authStore.erInnlogget) {
    next('/logginn');
  } else if (to.meta.kreverAdmin && !authStore.erAdmin) {
    next('/');
  } else {
    next();
  }
});

export default router;


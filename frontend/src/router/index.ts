import { createRouter, createWebHistory } from 'vue-router';

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
      path: '/logginn/:pathMatch(.*)*',
      name: 'logginn-catchall',
      component: () => import('@/views/LoggInnView.vue'),
    },
    {
      path: '/registrer',
      name: 'registrer',
      component: () => import('@/views/RegistrerView.vue'),
    },
    {
      path: '/registrer/:pathMatch(.*)*',
      name: 'registrer-catchall',
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

export default router;

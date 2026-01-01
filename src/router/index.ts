import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Print from '../views/PrintView.vue';
import Share from '../views/ShareView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/print',
      name: 'print',
      component: Print,
    },
    {
      path: '/share',
      name: 'share',
      component: Share,
    },
  ],
});

export default router;

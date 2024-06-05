import { RouteRecordRaw } from 'vue-router';
import { logged, noLogged } from 'src/router/guards/loggedGuard';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'home',
      },
      {
        path: 'authentication',
        component: () => import('pages/AuthPage.vue'),
        name: 'auth',
        beforeEnter: [noLogged],
      },
      {
        path: 'forms',
        component: () => import('pages/FormPage.vue'),
        name: 'forms',
        beforeEnter: [logged],
      },
      {
        path: 'profile',
        component: () => import('pages/ProfilePage.vue'),
        name: 'profile',
        beforeEnter: [logged],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

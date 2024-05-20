import { RouteRecordRaw } from 'vue-router';
import {noLogged} from 'src/router/guards/loggedGuard';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), name: 'home' },
      { path: 'authentication', component: () => import('pages/AuthPage.vue'), name: 'auth', beforeEnter: [noLogged] }
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

import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import useUserStore from 'stores/useUserStore';

export function logged(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const userStore = useUserStore();
  if (userStore.id && !!localStorage.getItem('token')) {
    next();
  } else {
    next({
      name: 'auth',
    });
  }
}

export function noLogged(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const userStore = useUserStore();
  if (!userStore.id && !localStorage.getItem('token')) {
    next();
  } else {
    next({
      name: 'home',
    });
  }
}

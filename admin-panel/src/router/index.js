import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/authService';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('../views/AuthCallback.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/staff',
    name: 'StaffList',
    component: () => import('../views/StaffListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/staff/create',
    name: 'StaffCreate',
    component: () => import('../views/StaffFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/staff/:id',
    name: 'StaffDetail',
    component: () => import('../views/StaffDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/staff/:id/edit',
    name: 'StaffEdit',
    component: () => import('../views/StaffFormView.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = authService.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next({ name: 'Login' });
  } else if (to.name === 'Login' && isAuthenticated) {
    // Redirect to dashboard if user is already authenticated
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;

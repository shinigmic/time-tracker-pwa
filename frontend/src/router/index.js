import { createRouter, createWebHistory } from 'vue-router';

// Import views
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Activities from '../views/Activities.vue';
import ActivityTypesEditor from '../views/ActivityTypesEditor.vue';
import StatisticsTable from '../views/StatisticsTable.vue';
// Assuming StatsTable is defined; otherwise, remove this route
// import StatsTable from '../views/StatsTable.vue';

const routes = [
  {
    path: '/',
    name: 'Activities',
    component: Activities,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/activity-types',
    name: 'ActivityTypesEditor',
    component: ActivityTypesEditor,
    meta: { requiresAuth: true },
  },
  {
    path: '/statistics',
    name: 'StatisticsTable',
    component: StatisticsTable,
    meta: { requiresAuth: true },
  },
  // {
  //   path: '/stats/table',
  //   name: 'StatsTable',
  //   component: StatsTable,
  //   meta: { requiresAuth: true },
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard to check authentication
router.beforeEach((to, from, next) => {
  // If the route requires authentication, check if the token exists
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to the Login page if no token is found
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

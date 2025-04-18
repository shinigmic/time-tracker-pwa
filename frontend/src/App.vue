<template>
  <v-app>
    <!-- Navigation Drawer for mobile and desktop navigation -->
    <v-navigation-drawer v-model="drawer" app color="primary" dark temporary>
      <!-- 👤 Display user email at the top -->
      <v-list-item class="px-4 py-2">
        <v-list-item-content>
          <v-list-item-title class="text-subtitle-1">
            {{ authStore.userEmail || 'Guest' }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="mb-1" />

      <!-- 📋 Main navigation links -->
      <v-list dense>
        <v-list-item-group>
          <v-list-item
            v-for="(item, index) in navItems"
            :key="index"
            :to="item.to"
            link
            @click="drawer = false"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-spacer />

      <v-divider class="my-1" />

      <!-- 🔐 Auth actions (Login / Logout) at the bottom -->
      <v-list dense>
        <template v-if="authStore.isAuthenticated">
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon color="red-lighten-2">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item :to="{ name: 'Login' }" link @click="drawer = false">
            <v-list-item-icon>
              <v-icon color="green-lighten-2">mdi-login</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'Register' }" link @click="drawer = false">
            <v-list-item-icon>
              <v-icon color="amber">mdi-account-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Register</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar with navigation buttons as links -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title
        class="text-truncate font-weight-bold"
        style="font-size: 1.1rem"
      >
        ⏱ Time Tracker
      </v-toolbar-title>
      <v-spacer />

      <!-- Navigation buttons: only visible on medium and larger screens -->
      <div class="d-none d-md-flex align-center">
        <v-btn text :to="{ name: 'Activities' }">Activities</v-btn>
        <v-btn text :to="{ name: 'ActivityTypesEditor' }">Activity Types</v-btn>
        <v-btn text :to="{ name: 'StatisticsTable' }">Statistics</v-btn>

        <template v-if="authStore.isAuthenticated">
          <v-btn text>{{ authStore.userEmail || 'User' }}</v-btn>
          <v-btn text @click="logout">Logout</v-btn>
        </template>
        <template v-else>
          <v-btn text :to="{ name: 'Login' }">Login</v-btn>
          <v-btn text :to="{ name: 'Register' }">Register</v-btn>
        </template>
      </div>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main>
      <v-container fluid class="pa-4">
        <router-view />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app color="primary" dark class="footer" style="position: static">
      <v-col class="text-center white--text"> &copy; 2025 Time Tracker </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth'; // Import the auth store

// Local state for navigation drawer and nav items
const drawer = ref(false);
const navItems = ref([
  { title: 'Activities', to: { name: 'Activities' }, icon: 'mdi-calendar' },
  {
    title: 'Activity Types',
    to: { name: 'ActivityTypesEditor' },
    icon: 'mdi-format-list-bulleted',
  },
  {
    title: 'Statistics',
    to: { name: 'StatisticsTable' },
    icon: 'mdi-chart-line',
  },
]);

const router = useRouter();
const authStore = useAuthStore();

// Logout method
const logout = () => {
  authStore.logout();
  router.push({ name: 'Login' });
};
</script>

<style>
.v-main {
  max-width: 1200px !important;
  margin: 0 auto;
  padding: 24px 16px;
}
</style>

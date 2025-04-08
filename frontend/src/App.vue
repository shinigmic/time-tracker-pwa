<template>
  <v-app>
    <!-- Navigation Drawer for mobile and desktop navigation -->
    <v-navigation-drawer v-model="drawer" app color="primary" dark temporary>
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
    </v-navigation-drawer>

    <!-- App Bar with navigation buttons as links -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Time Tracker</v-toolbar-title>
      <v-spacer />

      <!-- Navigation buttons for authorized users -->
      <v-btn text :to="{ name: 'Activities' }">Activities</v-btn>
      <v-btn text :to="{ name: 'ActivityTypesEditor' }">Activity Types</v-btn>
      <v-btn text :to="{ name: 'StatisticsTable' }">Statistics</v-btn>

      <!-- Conditionally display login/register or user info with logout -->
      <template v-if="authStore.isAuthenticated">
        <v-btn text>{{ authStore.userEmail || 'User' }}</v-btn>
        <v-btn text @click="logout">Logout</v-btn>
      </template>
      <template v-else>
        <v-btn text :to="{ name: 'Login' }">Login</v-btn>
        <v-btn text :to="{ name: 'Register' }">Register</v-btn>
      </template>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main>
      <v-container fluid class="pa-4">
        <router-view />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app color="primary" dark>
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
html,
body,
#app {
  height: 100%;
  margin: 0;
}

.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>

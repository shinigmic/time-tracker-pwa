<template>
  <v-app>
    <!-- Main Content Area -->
    <v-main>
      <v-container fluid class="pa-4">
        <h1>Welcome, {{ userEmail }}</h1>
        <!-- Here you can add components or content for displaying user's activities -->
        <p>This is the main page where your activities are displayed.</p>
        <!-- Example logout button -->
        <v-btn color="primary" @click="logout">Logout</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth'; // Adjust path if needed
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Create computed properties to derive reactive data from store
const userEmail = computed(() => authStore.userEmail || 'User');

// Logout method: calls store's logout action and navigates to Login page
const logout = () => {
  authStore.logout();
  router.push({ name: 'Login' });
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>

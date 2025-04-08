<template>
  <v-app>
    <!-- Main Content Area -->
    <v-main>
      <v-container fluid class="pa-4">
        <h1>Welcome, {{ userEmail }}</h1>
        <!-- Here you can add components or content for displaying user's activities -->
        <p>This is the main page where your activities are displayed.</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'Activities',
  data() {
    return {
      drawer: false,
      navItems: [
        {
          title: 'Activities',
          to: { name: 'Activities' },
          icon: 'mdi-calendar',
        },
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
      ],
    };
  },
  computed: {
    userEmail() {
      return localStorage.getItem('userEmail') || 'User';
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      this.$router.push({ name: 'Login' });
    },
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>

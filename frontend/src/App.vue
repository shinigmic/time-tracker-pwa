<template>
  <v-app>
    <!-- Navigation Drawer for mobile and desktop navigation -->
    <v-navigation-drawer v-model="drawer" app color="primary" dark temporary>
      <v-list dense>
        <v-list-item-group>
          <v-list-item
            v-for="(item, i) in navItems"
            :key="i"
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
      <!-- These buttons act as router links -->
      <v-btn text :to="{ name: 'Activities' }">Activities</v-btn>
      <v-btn text :to="{ name: 'ActivityTypesEditor' }">Activity Types</v-btn>
      <v-btn text :to="{ name: 'StatisticsTable' }">Statistics</v-btn>
      <template v-if="isLoggedIn">
        <v-btn text>
          {{ userEmail }}
        </v-btn>
        <v-btn text @click="logout">Logout</v-btn>
      </template>
      <template v-else>
        <v-btn text :to="{ name: 'Login' }">Login</v-btn>
        <v-btn text :to="{ name: 'Register' }">Register</v-btn>
      </template></v-app-bar
    >

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

<script>
export default {
  name: 'App',

  data() {
    return {
      drawer: false,
      // Navigation items for the drawer
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
    isLoggedIn() {
      // Checks if token exists; you might also check its validity if needed
      return !!localStorage.getItem('token');
    },
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

<style>
/* Ensure full height for app container */
html,
body,
#app {
  height: 100%;
  margin: 0;
}

/* Set default font family for the application */
.v-application {
  font-family: 'Roboto', sans-serif;
}

/* Additional global styling if needed */
</style>

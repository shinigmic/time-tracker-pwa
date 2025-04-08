<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height login-container">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card>
              <v-card-title class="headline">Login</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="email"
                  label="Email"
                  type="email"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
                <v-alert v-if="error" type="error" dense outlined class="mt-3">
                  {{ error }}
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async login() {
      try {
        const credentials = btoa(`${this.email}:${this.password}`);
        const response = await fetch('http://localhost:3000/login', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${credentials}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          this.error = data.message || 'Login failed';
          return;
        }
        const data = await response.json();
        console.log(data);
        // Save token and user email for further requests
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', this.email);
        this.$router.push({ name: 'Activities' });
      } catch (err) {
        console.error('Login error:', err);
        this.error = 'Login failed';
      }
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
/* Центрування форми вертикально */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

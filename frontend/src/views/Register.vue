<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card>
              <v-card-title class="headline">Register</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="name"
                  label="Name"
                  required
                ></v-text-field>
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
                <v-btn color="primary" @click="register">Register</v-btn>
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
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async register() {
      try {
        // Replace with your actual API endpoint for registration
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password,
          }),
        });
        if (!response.ok) {
          const data = await response.json();
          this.error = data.message || 'Registration failed';
          return;
        }
        const data = await response.json();
        console.log('User registered:', data);
        // Redirect to login page after successful registration
        this.$router.push({ name: 'Login' });
      } catch (err) {
        console.error('Registration error:', err);
        this.error = 'Registration failed';
      }
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>

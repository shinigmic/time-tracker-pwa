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
                />
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                />
                <v-alert v-if="error" type="error" dense outlined class="mt-3">
                  {{ error }}
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="handleLogin">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref(null);

const handleLogin = async () => {
  error.value = null;
  try {
    await authStore.login(email.value, password.value);
    router.push({ name: 'Activities' });
  } catch (err) {
    console.error('Login error:', err);
    error.value = err.message || 'Login failed';
  }
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

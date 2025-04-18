<template>
  <v-app>
    <v-main>
      <div class="login-wrapper">
        <v-card class="login-card rounded-xl elevation-3">
          <v-card-title class="text-h5 font-weight-bold text-center pa-2">
            Login to Time Tracker
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                variant="outlined"
                required
                autocomplete="email"
                density="comfortable"
              />

              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                variant="outlined"
                required
                autocomplete="current-password"
                density="comfortable"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-alert
                v-if="error"
                type="error"
                class="mt-3"
                variant="tonal"
                density="comfortable"
              >
                {{ error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                class="mt-5"
                size="large"
                block
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </div>
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
const showPassword = ref(false);
const error = ref(null);

const isValidEmail = (value) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value);
};

const containsScriptTags = (value) => {
  return /<script.*?>.*?<\/script>/gi.test(value);
};

const handleLogin = async () => {
  error.value = null;

  // 💡 Клієнтська валідація
  if (!email.value || !password.value) {
    error.value = 'Email and password are required';
    return;
  }

  if (!isValidEmail(email.value)) {
    error.value = 'Please enter a valid email address';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  if (containsScriptTags(email.value) || containsScriptTags(password.value)) {
    error.value = 'Input contains forbidden characters';
    return;
  }

  try {
    await authStore.login(email.value, password.value);
    router.push({ name: 'Activities' });
  } catch (err) {
    console.error('Login error:', err);
    error.value = err.message || 'Invalid email or password';
  }
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 16px;
  min-height: calc(80vh - 64px - 56px); /* app-bar + footer */

  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 600px;
  min-width: 340px;
  padding: 24px;
  background: white;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}

::v-deep(.v-field__append-inner) {
  cursor: pointer;
  transition: color 0.2s ease;
  margin-left: 8px;
}

::v-deep(.v-field__append-inner:hover) {
  color: #0d47a1;
}
.v-card-title {
  margin-bottom: 16px;
}
@media (max-width: 480px) {
  .login-card {
    padding: 16px;
    border-radius: 0;
    box-shadow: none;
  }

  .login-wrapper {
    padding: 0;
    min-height: 100vh;
  }
}
</style>

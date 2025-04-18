<template>
  <v-app>
    <v-main>
      <div class="register-wrapper">
        <v-card class="register-card rounded-xl elevation-3">
          <v-card-title class="text-h5 font-weight-bold text-center pa-2">
            Create Your Account
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="name"
                label="Name"
                variant="outlined"
                required
                autocomplete="name"
                density="comfortable"
              />

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
                autocomplete="new-password"
                density="comfortable"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                density="comfortable"
              >
                {{ error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                class="mt-4"
                size="large"
                block
              >
                Register
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

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const error = ref(null);

const api = import.meta.env.VITE_API_BASE;

const isValidEmail = (value) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value);
};

const containsScriptTags = (value) => {
  return /<script.*?>.*?<\/script>/gi.test(value);
};

const register = async () => {
  error.value = null;

  // Валідація на клієнті
  if (name.value.trim().length < 2) {
    error.value = 'Name must be at least 2 characters';
    return;
  }

  if (!isValidEmail(email.value)) {
    error.value = 'Please enter a valid email';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  if (password.value.includes(' ')) {
    error.value = 'Password cannot contain spaces';
    return;
  }

  if (
    containsScriptTags(name.value) ||
    containsScriptTags(email.value) ||
    containsScriptTags(password.value)
  ) {
    error.value = 'Input contains forbidden tags';
    return;
  }

  try {
    const response = await fetch(`${api}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      error.value = data.message || 'Registration failed';
      return;
    }

    const data = await response.json();
    console.log('User registered:', data);
    router.push({ name: 'Login' });
  } catch (err) {
    console.error('Registration error:', err);
    error.value = 'Registration failed';
  }
};
</script>

<style scoped>
.register-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 16px;
  min-height: calc(80vh - 64px - 56px); /* AppBar + Footer */

  box-sizing: border-box;
}

.register-card {
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

.v-text-field {
  min-height: 12px;
  padding-top: 0px;
}

@media (max-width: 480px) {
  .register-card {
    padding: 16px;
    border-radius: 0;
    box-shadow: none;
  }

  .register-wrapper {
    padding: 0;
    min-height: 100vh;
  }
}
</style>

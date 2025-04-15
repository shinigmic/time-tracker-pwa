import { defineStore } from 'pinia';
const api = import.meta.env.VITE_API_BASE;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userEmail: localStorage.getItem('userEmail') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email, password) {
      const credentials = btoa(`${email}:${password}`);
      const response = await fetch(`${api}/login`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      this.token = data.token;
      this.userEmail = email;

      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', email);
    },

    logout() {
      this.token = null;
      this.userEmail = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    },
  },
});

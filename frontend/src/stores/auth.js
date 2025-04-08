import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userEmail: localStorage.getItem('userEmail') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    login(token, email) {
      this.token = token;
      this.userEmail = email;
      localStorage.setItem('token', token);
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

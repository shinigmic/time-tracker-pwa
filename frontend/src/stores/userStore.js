import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUserById: (state) => (id) => {
      // логіка пошуку юзера за id
    },
  },
  actions: {
    login(userData) {
      this.user = userData;
    },
    logout() {
      this.user = null;
    },
  },
});

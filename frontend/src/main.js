import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import './assets/styles/style.css';
import router from './router';

createApp(App).use(router).use(createPinia()).use(vuetify).mount('#app');

// src/plugins/vuetify.js
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// 1. Імпорт CSS із Material Design Icons
import '@mdi/font/css/materialdesignicons.css';

// 2. Створюємо Vuetify, вказуємо набір іконок
export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // <-- Вказуємо набір іконок
  },
});

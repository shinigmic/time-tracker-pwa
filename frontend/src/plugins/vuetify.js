// src/plugins/vuetify.js
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VTimePicker } from 'vuetify/labs/VTimePicker';

// Імпорт CSS із Material Design Icons
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  components: {
    ...components,
    VTimePicker,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#FFCDD2',
          error: '#EF5350',
          success: '#66BB6A',
          info: '#29B6F6',
          warning: '#FFA726',
        },
      },
    },
  },
});

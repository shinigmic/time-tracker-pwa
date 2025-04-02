import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically update service worker when new version is available
      // injectRegister: 'auto', // Automatically inject the service worker registration script
      // includeAssets: [
      //   // Additional assets to precache (e.g., custom icons, fonts, etc.)
      //   'favicon.ico',
      //   'robots.txt',
      //   'apple-touch-icon.png'
      // ],
      manifest: {
        // Basic manifest properties
        name: 'Personal Time Tracker',
        short_name: 'TimeTracker',
        description: 'Simple PWA to track your daily activities',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        scope: '/',
        display: 'fullscreen', // Fullscreen mode on mobile devices
        orientation: 'portrait', // Force portrait orientation (optional)
        categories: ['productivity', 'lifestyle'], // Categories for app stores
        // Shortcuts for quick actions
        // shortcuts: [
        //   {
        //     name: 'Start Tracking',
        //     short_name: 'Start',
        //     description: 'Quick start tracking your activities',
        //     url: '/?action=start',
        //     icons: [
        //       {
        //         src: '/favicon/shortcut-start.png',
        //         sizes: '96x96',
        //         type: 'image/png'
        //       }
        //     ]
        //   },
        //   {
        //     name: 'View Reports',
        //     short_name: 'Reports',
        //     description: 'View your daily and weekly reports',
        //     url: '/reports',
        //     icons: [
        //       {
        //         src: '/favicon/shortcut-reports.png',
        //         sizes: '96x96',
        //         type: 'image/png'
        //       }
        //     ]
        //   }
        // ],
        // Icons for different resolutions
        icons: [
          {
            src: './favicon/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: './favicon/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        // Screenshots for app stores or promotional purposes
        // screenshots: [
        //   {
        //     src: './screenshots/screen1.jpg',
        //     sizes: '1280x715',
        //     type: 'image/jpg',
        //     label: 'Main Screen',
        //     form_factor: 'wide'
        //   }
        // ]
      },
      workbox: {
        // Workbox configuration for caching strategies
        // globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'], // Files to precache
        // runtimeCaching: [
        //   {
        //     // Runtime caching for API requests (if needed)
        //     urlPattern: /^https:\/\/api\.example\.com\/.*$/,
        //     handler: 'NetworkFirst',
        //     options: {
        //       cacheName: 'api-cache',
        //       networkTimeoutSeconds: 10,
        //       expiration: {
        //         maxEntries: 50,
        //         maxAgeSeconds: 300,
        //       },
        //       cacheableResponse: {
        //         statuses: [0, 200],
        //       },
        //     },
        //   },
        //   {
        //     // Runtime caching for images
        //     urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
        //     handler: 'CacheFirst',
        //     options: {
        //       cacheName: 'image-cache',
        //       expiration: {
        //         maxEntries: 60,
        //         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        //       },
        //     },
        //   },
        // ],
        skipWaiting: true, // Force new service worker to take control immediately
        clientsClaim: true, // Claim clients immediately after activation
        cleanupOutdatedCaches: true, // Clean up caches that are no longer used
      },
      devOptions: {
        enabled: true, // Enable PWA plugin during development (optional)
        type: 'module',
      },
    }),
  ],
  preview: {
    // Enable HTTPS for preview with mkcert
    https: {
      key: fs.readFileSync('./certs/192.168.1.107+2-key.pem'),
      cert: fs.readFileSync('./certs/192.168.1.107+2.pem'),
    },
    host: '0.0.0.0', // Makes the preview accessible from other devices in your network
    port: 4173, // Port for preview
  },
});

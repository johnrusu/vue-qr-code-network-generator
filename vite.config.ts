import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';
import { createHtmlPlugin } from 'vite-plugin-html';

// App metadata configuration
const appMetadata = {
  title: 'QR Code Network Generator',
  author: 'Rusu Ionut',
  description:
    'A modern WiFi QR Code Generator built with Vue.js 3, TypeScript, Pinia, and TailwindCSS. Instantly generate QR codes for your WiFi networks with support for WPA, WEP, and open networks. Features include real-time validation, smooth animations with Lottie, form state management, print-ready downloads, and responsive design. Simply enter your network SSID, password, and authentication type to create shareable QR codes that allow guests to connect effortlessly by scanning with their devices.',
  keywords: 'qr code, network, generator, vue, wifi, qr, ionut rusu, wifi qr code, network setup',
};

// https://vite.dev/config/
export default defineConfig({
  base: '/vue-qr-code-network-generator/',
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          ...appMetadata,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

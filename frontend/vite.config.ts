import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    rollupOptions: {
      input: {
        todos: new URL('todos.html', import.meta.url).pathname,
        todo: new URL('todo.html', import.meta.url).pathname,
      },
    },
  },
});



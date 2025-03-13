import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ❌ REMOVE this line: import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react()], // ✅ Remove tailwindcss() from plugins

  base: '/Nos2/controlpanel/dashboard/', // Ensures correct asset paths
});


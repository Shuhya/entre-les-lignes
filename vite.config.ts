/* vite.config.ts — Infra Vite (étape 4 : build vérifié en CI dans dist-vite/,
   PAS encore branché en production — GitHub Pages sert toujours la racine du repo).
   Inputs explicites : index.html (landing) + jeu.html (le jeu).
   Le bundle réel (modules ES + hash de cache) viendra avec l'étape 5 (bascule Pages). */
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
    outDir: 'dist-vite',
    emptyOutDir: true,
    rollupOptions: {
      input: { index: 'index.html', jeu: 'jeu.html' }
    }
  }
});

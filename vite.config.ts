/* vite.config.ts — Infra Vite (étape finale de la migration, PAS encore active en production).
   Plan validé : build vérifié dans dist-vite/ sans changer les fichiers servis par GitHub Pages
   tant que la sortie n'est pas validée. Statut : inert — ne pas brancher la CI dessus avant l'étape build. */
import { defineConfig } from 'vite';

export default defineConfig({
  build: { target: 'es2020', outDir: 'dist-vite', emptyOutDir: true }
});

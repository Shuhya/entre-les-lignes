# Entre les lignes

Jeu narratif en messages (SMS / WhatsApp / fichiers simulés). Une enquête en 6 chapitres, 8 fins possibles — chaque réponse compte.

## 🎮 Jouer

- **En ligne** : https://shuhya.github.io/entre-les-lignes/
- **Hors ligne** : générer le fichier unique avec `python3 build/build-single.py` → `dist/entre-les-lignes.html` (double-cliquable, tout embarqué)

Histoire jouable : **« Le Dernier en Ligne »** (l'enquête de Léo) · 3 histoires supplémentaires · multi-apps simulées · appels téléphoniques · décors immersifs générés par IA.

## 🛠️ Architecture

```
index.html            structure HTML (3 Ko)
css/style.css         styles + animations
js/assets.js          clés des décors/avatars → fichiers
js/story.js           données narratives (nœuds S, sommaire STORIES)
js/engine.js          moteur (rendu, scènes, audio, apps simulées)
assets/img/*.jpg      14 décors + 3 avatars
assets/audio/pluie.mp3  ambiance sonore
build/build-single.py générateur du fichier unique
dist/                 export généré (ignoré par git)
```

Développé avec [Vibe (Mistral AI)](https://mistral.ai). Modifs : les fichiers sources, jamais le dist.

## 📜 Licence

Projet personnel de Dylan Gaucher.

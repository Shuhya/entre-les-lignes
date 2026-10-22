# Changelog — Entre les lignes

Format court. Détail complet des versions dans les messages de commit.

- **2.190** — Clarification fin W : « quelqu'un veille sur toi » (les six jours renvoient à la fuite de l'ancien numéro du joueur, prologue h1 — pas à l'âge du numéro de Nils, mort depuis vingt-trois jours) ; carnet de Nils : nouvelle ligne « 21/09. Station d'épuration, cuve 7. Tout transite par là. » (préparation chapitre 2, variante pov). Texte seul + VER + miroirs TS.
- **2.131** — E2E-chaos en CI (vrai Chromium) : chapitre 1 joué en entier avec clics imprévisibles (‹ bibliothèque, ⚙, 📖 notes, 📑 transfert, thème, voix, mnBack, clics ailleurs) + reprise systématique jusqu'à l'écran de fin ; anti-soft-lock (150 s sans progrès = échec), SEED reproductible.
- **2.99** — E2E élargie (début de partie complet joué en vrai navigateur) + infrastructure beta (branche beta + miroir /beta/ pour tester avant la mise en ligne).
- **2.98** — Fix ESLint restant : appel `save()` hors de portée dans l’écran de fin (code mort silencieux depuis la v2.83, le fin patché sauvegardait déjà) — retiré.
- **2.97** — Fix : overlay Paramètres/Guide de la landing enfin stylé (il manquait tout le CSS, la fenêtre apparaissait sous l’écran d’intro) ; config ESLint par fichier (globals AVF/VOICES, monkey-patching autorisé).
- **2.96** — Chantier qualité : test menu en CI, ESLint, E2E Playwright, CHANGELOG, déduplication des images de la landing (453→~90 Ko, réutilisation des fichiers du jeu).
- **2.95** — Fix : ⚙ Paramètres / 📖 Guide invisibles depuis le menu (overlays attachés au body, au-dessus du menu).
- **2.94** — Démo landing : bas du téléphone complet (barre de saisie + nav comme dans le jeu).
- **2.93** — Les 4 fonds ambiants en vraies photos adaptées à l'heure réelle.
- **2.92** — Fond nuit en vraie photo.
- **2.91** — Vraies photos de profil dans la démo (Juno / Numéro masqué / Papa) + fond crépuscule.
- **2.90** — Fond ambiant par moment de la journée (classes html.ambX).
- **2.89** — ⚙ Paramètres + 📖 Guide dans le menu du jeu (guideOv) ; fond teinté selon l'heure ; démo landing à la DA du jeu (bulles WhatsApp/SMS + notif).
- **2.88** — Démo landing au thème du jeu, overlays refondus, guide généraliste, affichage PC par défaut.
- **2.87** — Landing 2 colonnes avec téléphone démo, boutons ⚙/📖, retour accueil.
- **2.86** — Playtest mobile : prologue, choix, notifications.
- **2.85** — UI mobile allégée (body.mob), avatar Yasmine.

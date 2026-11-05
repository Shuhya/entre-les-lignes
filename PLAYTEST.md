# PLAYTEST — checklist manuelle + guide d'interface (v2.237)

À dérouler sur téléphone (iOS Safari + Android Chrome) et desktop. Cocher au fur et à mesure.

## 0. Comment utiliser l'interface
- **Page d'accueil** (`index.html`) : Commencer › · Réglages · Guide · ℹ Notice (visite guidée en images).
- **Dans le jeu** (barre du téléphone) :
  - **‹** (haut gauche) : menu — carte des chapitres directe, badge 🏁 fins, « ↺ Recommencer » (double confirmation).
  - **⚙** (haut droite) : réglages — thème nuit/jour/auto, ambiance, sons, vitesse de lecture, voix des appels, plein écran, transfert de partie, **stats de lecture**, notes de l'enquête.
  - **📖** (à côté de l'heure) : fiche progression — où tu en es, tes fins, tes notes.
  - **📜** : journal des échanges — tout le fil, avec recherche.
- **Écran de fin** : fins découvertes, « ↗ Partager cette fin », rejouer, chapitre suivant, menu.
- **Relecture** (depuis le menu des actes d'un chapitre) : bannière 👁 « ta progression n'est pas modifiée », puis écran de fin avec « 📖 Voir le résumé écrit ».
- **Sauvegarde** : automatique (ferme l'onglet, reviens plus tard). Transfert : ⚙ → « ⇄ Transférer ma partie » (code ou fichier).
- **Notice** : ℹ Notice depuis l'accueil ou le menu — 4 écrans du jeu en images.

## 1. Parcours de base
- [ ] Accueil → Commencer → menu chapitres s'ouvre directement (pas de niveau bibliothèque)
- [ ] Chapitre 1 → Acte I → écran prénom (nom + genre) → prologue (sautable) → écran verrouillé → déverrouiller → premiers messages
- [ ] Bulles arrivent avec fondu doux ; « écrit… » pendant la frappe ; choix en bas → réponse envoyée
- [ ] 📜 journal : tous les messages, recherche fonctionne
- [ ] ‹ menu à tout moment ; retour au chapitre en cours
- [ ] Fermer l'onglet / recharger → reprise automatique au même endroit

## 2. Chapitre 1 — 2 routes
- [ ] Route « piège » (MMS + appel) → fin h11p
- [ ] Route « honnête » (aveu, confiance) → fin h11w
- [ ] Badge 🏁 compte les fins ; liste des fins verrouillées/déverrouillées
- [ ] « ↺ Recommencer » : 1er clic = demande confirmation, 2e clic = efface

## 3. Chapitre 2 (Quai 9) — à valider manuellement (Acte III)
- [ ] Déblocage du ch2 après une fin du ch1 (ou « commencer par une fin du ch1 » si ch1 non joué → ch2pick, 8 presets)
- [ ] Acte I (q1) : nuit du numéro, appel Cora
- [ ] Acte II (q4) : le matin, Yasmine, Riffaud
- [ ] **Acte III (q9) : square des Tanneurs, Track App (carte), 5 presets de chemin** ← le point à valider
- [ ] Appels sur écran verrouillé (lkCall) : accepter/refuser → bonne branche
- [ ] Fins du ch2 atteintes ; badge 🏁 à jour

## 4. Écrans spéciaux
- [ ] Appel entrant en jeu (#incOv) : décrocher/raccrocher
- [ ] Notification (.notif) : clic ouvre la conversation ; vibration (si dispo)
- [ ] Fichiers/notes (scrOv) : ouvrir, lire
- [ ] Track App : carte du quai 9, points, « retour »
- [ ] Écran de fin : partage (Web Share / copie), résumé écrit

## 5. Relecture (GHOST)
- [ ] Depuis le menu des actes : « ▶ Acte … » sur un acte → bannière 👁 visible
- [ ] Jouer l'acte en relecture → **progression inchangée** (badge 🏁 identique, sauvegarde identique)
- [ ] Fin de relecture → « 📖 Voir le résumé écrit » → résumé ETL_SUM du chapitre

## 6. Réglages & transfert
- [ ] Thème nuit/jour/auto ; mode sobre (emojis off) ; vitesse de lecture (accélère le texte)
- [ ] Volume ambiance/sons ; voix des appels ; plein écran
- [ ] Stats de lecture visibles (min/messages/parties)
- [ ] Transfert : exporter un code → coller sur un autre appareil → « Charger ce code » → partie restaurée

## 7. Notice & landing
- [ ] ℹ Notice depuis l'accueil → 4 captures WebP → retour vers l'accueil (pas le jeu)
- [ ] ℹ Notice depuis le jeu → retour vers le jeu
- [ ] Réglages/Guide du landing : overlays OK
- [ ] Téléphone démo animé sur l'accueil

## 8. Mobile / perfs / accessibilité
- [ ] Safe-area (encoche) OK ; clavier ne clipse pas la zone de saisie
- [ ] Animations fluides (fondu bulles, transitions) ; pas de saccade sur téléphone milieu de gamme
- [ ] `prefers-reduced-motion` : aucune animation
- [ ] Hors-ligne (mode avion après 1er chargement) : le jeu se lance (service worker)
- [ ] PWA : « Ajouter à l'écran d'accueil » → icône + lancement standalone
- [ ] Double-clic rapide sur un choix → pas de double action
- [ ] Changement d'onglet en cours de partie → sauvegarde ; retour → reprise

## 9. Signaler un bug
Noter : appareil/navigateur, version (v2.237, visible dans ⚙ ou la notice), écran concerné, capture, étapes exactes.

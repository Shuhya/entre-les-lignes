# DA de base — « Entre les lignes » (référence, à ne pas casser)

Consignée le 03/11/2026 (v2.231). Toute évolution de DA doit rester un **mix sobre** de cette base.

## Esprit
Jeu narratif « message » sur téléphone : fond = photo du menu (`assets/img/menu.jpg`, assombri), tout le reste flotte **en transparence** dessus. Jamais de carte opaque pleine (le test « papier crème » v2.230 a été rejeté).

## Couleurs / matières de base
- Fond menus : wallpaper `menu.jpg` + voile sombre (radial/linear noir).
- Carte flottante (verre) : `rgba(12,20,36,.55)` + `backdrop-filter: blur(18px)`, bordure fine `1px rgba(160,190,240,.16)`, rayon 22px, ombre `0 24px 80px #000c` + filet haut `inset 0 1px 0 #ffffff14`. (Style de référence : `#endOv .card`.)
- Accent doré : `#ffd166` (titres fins, badges, états ouverts). Boutons `.bk.open` : filet gauche doré.
- Texte : blanc `#fff` / secondaire `#cfe0f5` / atténué `#9fb4d4`.
- Alertes (écraser/recommencer) : rouge discret sur verre (`rgba(255,110,110,…)`, texte `#ffb3b3`).
- Titres : serif Palatino/Georgia (`#mn h2` 34px).

## Éléments de base
- `.mnBack` / `.mnX` : pastilles 42px verre sombre, **icône SVG centrée** (pas de glyphe texte — décalage visuel).
- `.bk` : ligne transparente, séparateur gauche `2px #ffffff1f`, `.lock` = opacity réduite.
- `.st` : ligne pleine largeur, séparateur bas `1px #ffffff33`.
- Bouton « écraser » : **pastille compacte alignée à droite** (pas une grosse ligne pleine largeur).
- Badge fins : pastille `🏁 X / Y` alignée à droite.

## Écrans de jeu (NE PAS TOUCHER)
Bulles de chat, écrans de verrouillage/appels, applis (Track App…), horloge, typographies du jeu.

## Notice
`notice.html` = même DA que le menu (fond menu + carte verre), 4 captures dans `assets/img/notice/` (390×780, générées par la branche `demo-shots`, workflow Shots).

## Tokens CSS (v2.233)
Toutes les couleurs/radius DA sont des variables `:root` (`--w-*`, `--gold-*`, `--k-*`, `--blue-*`, `--tx-*`, `--navy*`, `--glass`, `--r-*`) définies en tête de `css/style.css` — ne plus remettre de littéraux hex dans les règles. Les 3 « systèmes de boutons » sont unifiés au niveau tokens : `.bk` (cartes) et `.st` (lignes, produites par le helper JS `row()` — `.row` n'a plus de CSS). Règle morte purgée : `.bkF`, `.storyList`, `.storyC`. Vérification « 0 pixel » : diff de captures avant/après (v2.231 vs v2.233) = 0 pixel sur écran statique.

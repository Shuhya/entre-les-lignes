/* types.ts — Contrat des données narratives (étape 1 de la migration TS+Vite)
   Toute modification de la structure d'un nœud passe ici d'abord.
   Vérification : npx tsc -p tsconfig.json (CI à venir) + scripts/check-ts-mirror.js (pur Node, déjà en CI). */

/** État du joueur (flags du run) : trst/piege/int/mentir/avou/pol/pov/prm/mig/recall... + prénom/genre. */
export type St = Record<string, any>;

/** Source d'image : chemin unique, ou [masculin, féminin]. */
export type Src = string | [string, string];

/** Message d'un nœud : [type, contenu]. Types : h (reçu), n (bulle), m (envoyé par le joueur),
    pm (photo envoyée), p (photo reçue), s (système), a (récit awayOv), x (définir nom). */
export type Msg = [string, string | Src];

/** Choix : [texte affiché (marqueur *pensée* possible), nœud cible, flags, mode].
    mode : "!" = action (bulle narration italique), "-" = action pure (rien envoyé),
    absent = message envoyé au destinataire. */
export type Choice = [string, string] | [string, string, Record<string, any>] | [string, string, Record<string, any> | undefined, string | undefined];

/** Écran de verrouillage avec notification (prévisu). */
export interface Lk { t?: string; nm?: string; txt?: string; ic?: string; d?: string }

/** Écran applicatif spécial (helios / files). */
export interface Scr { k: string; ts?: string; st?: string; ic?: string; map?: Record<string, string> }

/** Ligne d'appel : type 0 = didascalie (narrateur), 1 = réplique, 2 = menu d'options. */
export type CallLine = [0 | 1, string] | [2, Array<[string, Array<[0 | 1, string]>, Record<string, any>?]>];

/** Nœud narratif. Les routeurs (j) choisissent le nœud suivant selon St. */
export interface Node {
  w?: string;             /* décor : appart | quai9 | vaubris... */
  app?: string;           /* SMS | WhatsApp | HÉLIOS | Fichiers | Notes... */
  nm?: string;            /* nom du fil (C., Yasmine, Cora, Numéro inconnu...) */
  mem?: string[];         /* membres d'un fil de groupe */
  pro?: string[];         /* cartes prologue/fin (titres + paragraphes) */
  out?: string[];         /* récits plein écran avant le fil */
  scr?: Scr;              /* écran applicatif */
  lk?: Lk;                /* écran verrouillé avec notification */
  noS?: 1;                /* changement d'app silencieux */
  m?: Array<Msg>;         /* messages du fil */
  c?: Array<Choice>;      /* choix du joueur */
  j?: (st: St) => string; /* routeur : nœud suivant selon l'état */
  x?: string;             /* suite sans choix (après rdOk) */
  ef?: Record<string, number>; /* effets automatiques à l'entrée du nœud (sweep pages action) */
  h?: string;             /* nœud si le joueur raccroche */
  dec?: string;           /* nœud si le joueur refuse l'appel entrant */
  inc?: 1;                /* appel entrant */
  inclk?: 1;              /* appel entrant sur l'écran de verrouillage */
  lkc?: { t?: string; d?: string }; /* heure + date de l'appel entrant lock screen */
  call?: [string, string, Array<CallLine>]; /* [nom affiché, sous-titre, lignes] */
  endc?: (st: St) => string | string; /* écran de fin de chapitre */
  fx?: Array<[string, string, string, number | string]>; /* explorateur Fichiers : [icône, nom, meta, action (index de choix | "gpg"|"png")] */
  fxF?: number;           /* index du choix « footer » de l'explorateur Fichiers */
  vw?: [string, string, Array<[string, string]>]; /* viewer plein écran : [kind txt|wav, nom du fichier, lignes [style, texte]] */
  vwBack?: string;        /* nœud de retour du viewer (‹ Revenir à l'archive) */
  scrf?: 1;               /* flag écran Fichiers déjà parcouru (h9f2) */

  e?: string[];           /* fin d'histoire [clé, texte] */
  k?: string;             /* titre de fin enregistré */
  f?: string;             /* variante de fin */
}

/** Sommaire : une histoire jouable. */
export interface StoryMeta { id: string; n: string; num: string; t: string; d: string; ch: Array<[string, string] | [string, string, Array<[string, string]>]> }

export type Story = Record<string, Node>;

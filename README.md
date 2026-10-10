# Hypertransfert

Hypertransfert est une petite application web qui permet d'envoyer un fichier depuis un ordinateur vers un smartphone sur le même réseau local, sans créer de compte ni télécharger d'application côté mobile.

Le flux est simple :

1. Vous déposez un fichier sur l'application.
2. Le serveur génère un QR code avec un lien de téléchargement.
3. Vous scannez ce QR code depuis votre téléphone.
4. Le fichier est téléchargé directement depuis le réseau local.

Cette solution est particulièrement utile pour transférer rapidement des fichiers depuis un Mac ou un PC vers un téléphone sans passer par des services cloud.

## Fonctionnalités

- Upload de fichiers via glisser-déposer ou sélection manuelle
- Génération automatique d'un QR code de téléchargement
- Téléchargement direct depuis le même réseau local
- Interface web légère et rapide
- Support des fichiers volumineux avec streaming de lecture
- Stockage local dans le dossier `.data`
- Compatible avec les appareils du même réseau Wi‑Fi

## Comment ça marche

L'application expose une API locale pour :

- recevoir le fichier uploadé
- enregistrer le fichier sur le disque local
- générer une URL de téléchargement dédiée
- afficher un QR code afin d'accéder à ce téléchargement depuis un autre appareil

Le fichier est ensuite servi via une page dédiée `/d/[id]` accessible sur le même réseau.

## Prérequis

- Node.js 20+
- npm, pnpm ou bun
- Un navigateur moderne
- Deux appareils sur le même réseau local (ordinateur + téléphone)

## Installation

```bash
git clone https://github.com/karaag2/hypertransfert.git
cd hypertransfert
npm install
```

## Démarrage

### Mode développement

```bash
npm run dev
```

L'application démarre sur :

```bash
http://localhost:3000
```

Si vous êtes sur le même réseau local, votre téléphone peut accéder à l'URL locale affichée par le serveur (par exemple `http://192.168.1.10:3000`).

### Mode production

```bash
npm run build
npm run start
```

## Utilisation

1. Ouvrez l'application dans le navigateur.
2. Glissez un fichier ou cliquez pour le sélectionner.
3. Attendez la génération du QR code.
4. Scannez-le avec votre téléphone.
5. Cliquez sur le bouton de téléchargement pour récupérer le fichier.

## Structure du projet

```bash
.
├── app/
│   ├── d/[id]/page.tsx      # page de téléchargement d'un fichier
│   ├── globals.css          # styles globaux
│   ├── layout.tsx           # layout principal
│   └── page.tsx             # écran de dépôt principal
├── components/
│   ├── Dropzone.tsx         # zone de drag-and-drop
│   └── QRCodeDisplay.tsx    # affichage du QR code
├── lib/
│   ├── network.ts            # utilitaires réseau
│   └── storage.ts           # gestion du stockage local
├── .data/                   # fichiers uploadés
├── server.js                # serveur HTTP personnalisé
├── package.json             # scripts et dépendances
├── next.config.mjs          # configuration Next.js
├── tsconfig.json            # configuration TypeScript
├── README.md                # documentation du projet
└── ...
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Remarques importantes

- L'application sert les fichiers depuis le réseau local, donc elle n'est pas destinée à un usage public sur Internet.
- Les fichiers téléchargés sont stockés localement dans le dossier `.data`.
- Le serveur détermine automatiquement l'IP locale pour générer les liens de téléchargement.

## Exemple d'usage

```bash
npm install
npm run dev
```

Ensuite, depuis votre téléphone connecté au même Wi‑Fi :

- ouvrez l'URL locale fournie par votre ordinateur
- sélectionnez un fichier
- scannez le QR code généré
- téléchargez le fichier

## Licence

Ce projet est actuellement sans licence explicite.

## Développement

Le projet utilise :

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- qrcode.react
- Busboy pour gérer les uploads

Si vous souhaitez l'étendre, les points d'entrée principaux sont :

- `server.js` pour la logique réseau et les uploads
- `app/page.tsx` pour l'interface principale
- `app/d/[id]/page.tsx` pour la page de téléchargement
- `lib/storage.ts` pour la gestion des fichiers

---

Projet créé pour transférer rapidement des fichiers entre un ordinateur et un téléphone sur le même réseau local.

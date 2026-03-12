# Club Connect - Application Web

Club Connect est une solution complète de gestion pour les salles de sport, incluant un accès administrateur pour le tableau de bord, la gestion des membres, le module manager et les paramètres.

## Fonctionnalités Clés
- **Tableau de bord** avec données dynamiques et KPIs
- **Gestion CRM** des membres avec ajout, recherche, et filtrage par plan
- **Module Manager** pour gérer les extensions tierces de la salle
- **Système de Settings** pour configurer l'application
- **Responsive Design** avec Sidebar rétractable sur mobile et Tablette
- **Data Persistence** temporaire (via le LocalStorage) pour les démonstrations

## Scripts de Démarrage

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

### Build pour la Production
```bash
npm run build
```
Les fichiers générés se trouveront dans le dossier `dist`.
Vous pourrez ensuite déployer ce dossier sur Vercel, Netlify, ou un serveur de votre choix.

## Technologies Utilisées
- **React.js (Vite)**
- **CSS Vanilla (Glassmorphism & animations)**
- **Phosphor Icons**

---
*Développé pour l'interface d'administration de Club Connect.*

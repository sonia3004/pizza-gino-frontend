# 🍕 Pizza Ordering System - Frontend

Ce projet est le **frontend** du système de commande de pizzas en temps réel. Développé avec **Vite + React**, il permet aux utilisateurs de passer des commandes, de suivre leur statut en temps réel et d'afficher un dashboard avec les métriques du restaurant.

---

## 🚀 Fonctionnalités

- 🛒 **Passer une commande** et voir la mise à jour en temps réel.
- 📡 **Mise à jour des statuts via WebSockets**.
- 📊 **Dashboard dynamique** avec affichage des recettes, du nombre de commandes et de l’état du stock.
- 🎨 **Interface utilisateur moderne et optimisée avec Vite**.

---

## 🏗️ Technologies utilisées

- **Vite** (Build ultra rapide)
- **React** (UI dynamique)
- **WebSockets** (mise à jour en temps réel)
- **Recharts** (affichage des métriques sous forme de graphiques)
- **Fetch API** (communication avec l’API backend Django)
- **CSS et Tailwind** (stylisation de l'interface)

---

## 📦 Installation & Setup

### 1️⃣ Prérequis
- Node.js et npm
- Un backend Django en fonctionnement ([voir le repo backend](https://github.com/sonia3004/pizza-gino-backend))

### 2️⃣ Installation du projet

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/sonia3004/pizza-gino-frontend.git
   cd dashboard
   ```
2. **Installer les dépendances** :
   ```bash
   npm install
   ```
3. **Configurer les variables d’environnement** (si nécessaire) :
   - Créer un fichier `.env` à la racine et ajouter l’URL de l’API backend :
     ```plaintext
     VITE_API_URL=http://localhost:8000/api
     ```
4. **Lancer le serveur Vite** :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173/`.

---

## 📊 Utilisation

- **Accueil** : liste des pizzas disponibles.
- **Passer commande** : cliquer sur "Commander" pour acheter une pizza.
- **Suivi en temps réel** : voir la mise à jour du statut de la commande.
- **Dashboard** : affichage des statistiques du restaurant.

---

## 🛠️ Développement & Tests

- Modifier les composants React pour personnaliser l’interface.
- Tester les WebSockets en passant des commandes depuis plusieurs fenêtres.
- Utiliser **Postman** ou `curl` pour tester les endpoints de l’API backend.

---

## 📄 Licence

Ce projet est réalisé dans un cadre éducatif.

---

🚀 **Bon développement et bon appétit ! 🍕**


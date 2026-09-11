# 🧩 IT Lab CTF: Interactive Image Unblurring & Heritage Challenge

[![Category](https://img.shields.io/badge/Category-Web_--_OSINT_/_Riddles-red?style=flat)](#)
[![Theme](https://img.shields.io/badge/Theme-History_&_Marine_Heritage-blue?style=flat)](#)
[![Event](https://img.shields.io/badge/Event-IT_LAB_Hackathon-black?style=flat)](#)

Challenge Web développé pour le **Hackathon / CTF du club IT LAB**. 

Ce challenge combine la résolution d'énigmes culturelles/historiques et un mécanisme visuel interactif où la validation de chaque réponse permet de déflouter progressivement les parties d'une image révélant le flag final.

---

## 🛰️ Présentation du Challenge

L'objectif du joueur est de reconstituer le flag complet en débloquant les 4 cellules de l'image centrale.

### 🎯 Mécanique du jeu :
1. **Résolution d'énigmes (Riddles / OSINT) :** Le joueur doit répondre à 4 questions portant sur l'histoire et le patrimoine naturel/historique méditerranéen et nord-africain :
   * *Énigme 1 (Histoire/Figure historique) :* La Dihya / Kahena (Reine des Aurès).
   * *Énigme 2 (Patrimoine antique) :* Le Murex (coquillage de la pourpre carthaginoise).
   * *Énigme 3 (Archéologie sous-marine) :* Le golfe de Tunis / Baie de Carthage / Épave de Mahdia.
   * *Énigme 4 (Écosystème marin) :* La Posidonie (*Posidonia oceanica*).
2. **Défloutage visuel (Unblurring) :** À chaque bonne réponse, la cellule d'image correspondante passe de l'état flou (`img-floue`) à l'état net (`img-net`).
3. **Validation finale :** Une fois l'image entièrement révélée, le joueur extrait les indices visuels ou le flag et le valide sous le format `ITLABCTF{...}`.

---

## 🛠️ Stack Technique

* **HTML5 / CSS3 :** Structure de la grille d'images, animations de transition visuelle et superposition d'images (flou vs net).
* **JavaScript (Vanilla) :** Gestion de la validation des réponses aux énigmes, modification dynamique du DOM (toggle des classes) et vérification du flag final.

---

## 📂 Structure du Dépôt

```bash
.
├── index.html        # Structure de la page, grille d'images et zones d'énigmes
├── styles.css        # Styles CSS (effets de flou, grille responsive, thème)
├── app.js            # Logique de validation des réponses et défloutage
├── assets/           # Images du challenge
│   ├── 1.jpg
│   ├── 2.jpg
│   ├── 3.jpg
│   └── 4.jpg
└── README.md         # Documentation du challenge

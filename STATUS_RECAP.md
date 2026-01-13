# 📋 Récapitulatif des Statuts - SalesOrder, PickingTask, DeliveryNote

## 🎨 Légende des Couleurs

- **Gris** (`bg-gray-100` / `text-gray-700`) : États initiaux/neutres
- **Bleu** (`bg-blue-100` / `text-blue-700`) : Confirmé, prêt
- **Orange** (`bg-orange-100` / `text-orange-700`) : En cours, partiel
- **Vert** (`bg-green-100` / `text-green-700`) : Terminé, facturé
- **Rouge** (`bg-red-100` / `text-red-700`) : Annulé

---

## 📦 SalesOrder (BC - Bon de Commande)

### Statuts disponibles

| Statut              | Label FR            | Couleur   | Description                     |
| ------------------- | ------------------- | --------- | ------------------------------- |
| `DRAFT`             | Non confirmé        | 🔘 Gris   | Brouillon, non confirmé         |
| `CONFIRMED`         | Confirmé            | 🔵 Bleu   | Confirmé, prêt pour préparation |
| `IN_PREPARATION`    | En préparation      | 🟠 Orange | Un BP est en cours              |
| `PARTIALLY_SHIPPED` | Partiellement livré | 🟠 Orange | Livraison partielle (reliquat)  |
| `SHIPPED`           | Livré               | 🟢 Vert   | Tous les BL sont expédiés       |
| `INVOICED`          | Facturé             | 🟢 Vert   | Tous les BL sont facturés       |
| `CANCELLED`         | Annulé              | 🔴 Rouge  | Commande annulée                |

### Transitions possibles

```
DRAFT
  ↓ [confirmSalesOrder()]
CONFIRMED
  ↓ [createPickingTaskFromSalesOrder()]
IN_PREPARATION
  ↓ [completePickingTask() → crée BL]
PARTIALLY_SHIPPED (si livraison partielle)
  ↓ [shipDeliveryNote() sur tous les BL]
SHIPPED
  ↓ [invoiceDeliveryNote() sur tous les BL]
INVOICED (état terminal)

CANCELLED (depuis DRAFT, CONFIRMED, IN_PREPARATION, PARTIALLY_SHIPPED)
```

### Actions disponibles

- **DRAFT** → Bouton "Confirmer la commande" → `confirmSalesOrder()`
- **CONFIRMED** → Bouton "Créer un BP et préparer" → `createPickingTaskFromSalesOrder()` + redirige vers préparation
- **IN_PREPARATION** → Affiche le BP en cours
- **PARTIALLY_SHIPPED** → Bouton "Préparer le reliquat" → Crée un nouveau BP
- **SHIPPED** → Affiche les BL associés
- **INVOICED** / **CANCELLED** → Lecture seule

---

## 📋 PickingTask (BP - Bon de Préparation)

### Statuts disponibles

| Statut        | Label FR   | Couleur   | Description                     |
| ------------- | ---------- | --------- | ------------------------------- |
| `PENDING`     | En attente | 🔘 Gris   | BP créé, pas encore commencé    |
| `IN_PROGRESS` | En prépa   | 🟠 Orange | Préparation en cours (scanning) |
| `COMPLETED`   | Terminé    | 🟢 Vert   | Préparation terminée, BL créé   |
| `CANCELLED`   | Annulé     | 🔴 Rouge  | BP annulé                       |

### Transitions possibles

```
PENDING
  ↓ [startPickingTask()] (automatique au premier scan)
IN_PROGRESS
  ↓ [completePickingTask()] (quand tous les produits sont préparés)
COMPLETED (état terminal)
  → Crée automatiquement un DeliveryNote (BL) en READY_TO_SHIP

CANCELLED (depuis PENDING ou IN_PROGRESS)
```

### Actions disponibles

- **PENDING** → Bouton "Commencer la préparation" → `startPickingTask()` (ou automatique au premier scan)
- **IN_PROGRESS** → Bouton "Scanner" → `scanLot()` → Mise à jour automatique
- **IN_PROGRESS** → Bouton "Valider la préparation" → `completePickingTask()` → Crée BL `READY_TO_SHIP`
- **COMPLETED** → Lecture seule, affiche le BL créé
- **CANCELLED** → Lecture seule

### Notes importantes

- Le premier `scanLot()` déclenche automatiquement `startPickingTask()` (PENDING → IN_PROGRESS)
- `completePickingTask()` crée automatiquement un `DeliveryNote` avec le statut `READY_TO_SHIP`
- Le BC parent passe de `CONFIRMED` → `IN_PREPARATION` quand le BP est créé
- Le BC parent passe de `IN_PREPARATION` → `SHIPPED` quand tous les BL sont expédiés

---

## 🚚 DeliveryNote (BL - Bon de Livraison)

### Statuts disponibles

| Statut          | Label FR    | Couleur | Description                  |
| --------------- | ----------- | ------- | ---------------------------- |
| `READY_TO_SHIP` | Prêt à quai | 🔵 Bleu | BL créé, prêt à être expédié |
| `SHIPPED`       | Expédié     | 🟢 Vert | BL expédié (camion parti)    |
| `SIGNED`        | Signé       | 🟢 Vert | BL signé par le client       |
| `INVOICED`      | Facturé     | 🟢 Vert | BL facturé (état terminal)   |

### Transitions possibles

```
READY_TO_SHIP
  ↓ [shipDeliveryNote()]
SHIPPED
  ↓ [invoiceDeliveryNote()]
INVOICED (état terminal)

SHIPPED
  ↓ [Signature client] (optionnel)
SIGNED
  ↓ [invoiceDeliveryNote()]
INVOICED (état terminal)
```

### Actions disponibles

- **READY_TO_SHIP** → Bouton "Valider le départ camion" → `shipDeliveryNote()` → Passe à `SHIPPED`
- **SHIPPED** → Bouton "Générer la Facture" → `invoiceDeliveryNote()` → Passe à `INVOICED`
- **SIGNED** → Bouton "Générer la Facture" → `invoiceDeliveryNote()` → Passe à `INVOICED`
- **INVOICED** → Lecture seule, bouton "Voir la facture"

### Notes importantes

- Le BL est créé automatiquement par `completePickingTask()` avec le statut `READY_TO_SHIP`
- `READY_TO_SHIP` est affiché en **bleu** pour les BL, car c'est un état "prêt à expédier" (en attente)
- `SHIPPED` et `SIGNED` sont affichés en **vert** car ce sont des actions effectuées
- Quand tous les BL d'un BC sont `INVOICED`, le BC passe à `INVOICED`
- `SIGNED` est optionnel (peut passer directement de `SHIPPED` à `INVOICED`)

---

## 🔄 Workflow Complet : BC → BP → BL

### Exemple de workflow complet

```
1. BC créé en DRAFT (Gris)
   ↓
2. Utilisateur clique "Confirmer la commande"
   → BC passe à CONFIRMED (Bleu)
   ↓
3. Utilisateur clique "Créer un BP et préparer"
   → BP créé en PENDING (Gris)
   → BC passe à IN_PREPARATION (Orange)
   → Redirection vers DeliveryPreparationPage
   ↓
4. Utilisateur scanne le premier lot
   → BP passe automatiquement à IN_PROGRESS (Orange)
   ↓
5. Utilisateur scanne tous les lots nécessaires
   → Progress bar se met à jour
   ↓
6. Utilisateur clique "Valider la préparation"
   → BP passe à COMPLETED (Vert)
   → BL créé automatiquement en READY_TO_SHIP (Bleu)
   → BC reste en IN_PREPARATION (ou passe à PARTIALLY_SHIPPED si reliquat)
   ↓
7. Utilisateur clique "Valider le départ camion" sur le BL
   → BL passe à SHIPPED (Vert)
   → Si tous les BL du BC sont SHIPPED, BC passe à SHIPPED (Vert)
   ↓
8. Utilisateur clique "Générer la Facture" sur le BL
   → BL passe à INVOICED (Vert)
   → Si tous les BL du BC sont INVOICED, BC passe à INVOICED (Vert)
```

---

## 🎯 Points Clés

### Couleurs spéciales

- **READY_TO_SHIP (BL)** : Bleu car c'est un état "prêt à expédier" (en attente)
- **SHIPPED (BL)** : Vert car c'est "expédié" (action effectuée)
- **SIGNED (BL)** : Vert car c'est "signé" (action effectuée)
- **SHIPPED (BC)** : Vert car c'est "tous les BL sont expédiés"

### États terminaux

- **SalesOrder** : `INVOICED`, `CANCELLED`
- **PickingTask** : `COMPLETED`, `CANCELLED`
- **DeliveryNote** : `INVOICED`

### Transitions automatiques

- Création d'un BP → BC passe à `IN_PREPARATION`
- Completion d'un BP → Crée BL en `READY_TO_SHIP`
- Premier scan → BP passe de `PENDING` à `IN_PROGRESS`
- Tous les BL `SHIPPED` → BC passe à `SHIPPED`
- Tous les BL `INVOICED` → BC passe à `INVOICED`

---

## 📝 Fonctions Backend

### SalesOrder (BC)

- `confirmSalesOrder(salesOrderId)` : DRAFT → CONFIRMED
- `createPickingTaskFromSalesOrder(salesOrderId)` : Crée BP PENDING, BC → IN_PREPARATION

### PickingTask (BP)

- `startPickingTask(pickingTaskId)` : PENDING → IN_PROGRESS (automatique au premier scan)
- `scanLot(pickingTaskId, productId, lotNumber, quantity)` : Met à jour les lots scannés
- `completePickingTask(pickingTaskId)` : IN_PROGRESS → COMPLETED, crée BL READY_TO_SHIP

### DeliveryNote (BL)

- `shipDeliveryNote(deliveryNoteId)` : READY_TO_SHIP → SHIPPED
- `invoiceDeliveryNote(deliveryNoteId)` : SHIPPED/SIGNED → INVOICED

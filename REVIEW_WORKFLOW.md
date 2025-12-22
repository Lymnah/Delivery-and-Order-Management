# Revue Complète des Workflows BC → BP → BL

## ✅ Ce qui a été fait

### 1. Structure de données
- ✅ Nouveaux enums : `SalesOrderStatus`, `PickingTaskStatus`, `DeliveryNoteStatus` (valeurs anglaises)
- ✅ Nouvelles interfaces : `SalesOrder`, `PickingTask`, `DeliveryNote` avec relations
- ✅ Relations : BC 1→N BP, BP 1→1 BL
- ✅ Fonction de migration : `migrateOrdersToNewStructure()`

### 2. Fonctions backend
- ✅ `confirmSalesOrder()` : DRAFT → CONFIRMED
- ✅ `createPickingTaskFromSalesOrder()` : Crée BP PENDING, met BC en IN_PREPARATION
- ✅ `startPickingTask()` : PENDING → IN_PROGRESS
- ✅ `scanLot()` : Ajoute lot au BP
- ✅ `completePickingTask()` : IN_PROGRESS → COMPLETED, crée BL DRAFT
- ✅ `shipDeliveryNote()` : DRAFT → SHIPPED
- ✅ `invoiceDeliveryNote()` : SHIPPED → INVOICED
- ✅ `getRemainingQuantities()` : Calcule reliquats
- ✅ `calculateSalesOrderStatus()` : Calcule statut BC selon BP/BL

### 3. Helpers de statuts
- ✅ `statusHelpers.ts` mis à jour avec nouveaux statuts
- ✅ Traductions français : `getStatusLabelFr()`
- ✅ Couleurs de badges : `getStatusBadgeColor()`
- ✅ Transitions : `canTransitionStatus()`
- ✅ Actions disponibles : `getAvailableActions()`

## ❌ Ce qui manque / Problèmes identifiés

### 1. **PROBLÈME MAJEUR : Les composants utilisent encore l'ancienne structure**

#### OrderDetailsPage.tsx
- ❌ Utilise encore `Order` au lieu de `SalesOrder`
- ❌ Utilise encore les anciens statuts français ('À préparer', 'En préparation')
- ❌ Bouton "Préparer la livraison" pour BL au lieu de "Créer un BP et préparer" pour BC
- ❌ Ne gère pas les reliquats (quantités commandées vs livrées)
- ❌ Ne gère pas les différents statuts BC (CONFIRMED, IN_PREPARATION, PARTIALLY_SHIPPED)

**Workflow attendu pour BC :**
- BC CONFIRMED → Bouton "Créer un BP et préparer" → Crée BP et redirige vers préparation
- BC IN_PREPARATION → Bouton "Voir la préparation en cours" → Affiche BP actif
- BC PARTIALLY_SHIPPED → Bouton "Préparer le reliquat" → Crée BP avec quantités restantes
- BC SHIPPED → Bouton "Voir les BL"
- BC INVOICED/CANCELLED → Lecture seule

#### DeliveryPreparationPage.tsx
- ❌ Utilise encore `Order` au lieu de `PickingTask`
- ❌ Utilise encore les anciens statuts français
- ❌ Ne récupère pas les données depuis `PickingTask.scannedLots`
- ❌ Ne met pas à jour `PickingTask` lors du scan
- ❌ Validation ne crée pas le BL via `completePickingTask()`

**Workflow attendu pour BP :**
- BP PENDING → Scanner démarre automatiquement → BP passe en IN_PROGRESS
- BP IN_PROGRESS → Scanner ajoute lots à `PickingTask.scannedLots`
- BP COMPLETED → Validation appelle `completePickingTask()` → Crée BL DRAFT

#### App.tsx
- ❌ `openOrderDetails()` utilise encore `Order` et anciens statuts
- ❌ Navigation ne gère pas SalesOrder → PickingTask → DeliveryNote
- ❌ Ne détecte pas le type de document (SalesOrder vs PickingTask vs DeliveryNote)
- ❌ Ne crée pas de BP depuis BC CONFIRMED

#### Vues de liste (OrdersListView, CalendarView, OrdersListInline)
- ❌ Utilisent encore `getOrdersForAtelier()` qui retourne `Order[]`
- ❌ Ne filtrent pas BC DRAFT correctement
- ❌ Devraient utiliser `getSalesOrdersForAtelier()` qui retourne `SalesOrder[]`

### 2. **Workflows manquants / incohérences**

#### Workflow BC → BP → BL (incomplet)
```
BC CONFIRMED
  ↓ [Créer un BP et préparer]
BP PENDING (créé)
  ↓ [Scanner premier lot]
BP IN_PROGRESS
  ↓ [Scanner tous les lots]
BP COMPLETED
  ↓ [completePickingTask()]
BL DRAFT (créé automatiquement)
  ↓ [shipDeliveryNote()]
BL SHIPPED
  ↓ [invoiceDeliveryNote()]
BL INVOICED
```

**Problèmes :**
- ❌ Pas de bouton "Créer un BP et préparer" dans OrderDetailsPage pour BC CONFIRMED
- ❌ DeliveryPreparationPage ne reçoit pas de `PickingTask`
- ❌ Validation ne crée pas le BL

#### Gestion des livraisons partielles (incomplet)
```
BC CONFIRMED
  ↓ [Créer BP 1]
BP 1 COMPLETED → BL 1 DRAFT
  ↓ [BC passe en PARTIALLY_SHIPPED]
BC PARTIALLY_SHIPPED
  ↓ [Préparer le reliquat]
BP 2 PENDING (avec quantités restantes uniquement)
  ↓ [Scanner]
BP 2 COMPLETED → BL 2 DRAFT
  ↓ [BC passe en SHIPPED si reliquat = 0]
BC SHIPPED
```

**Problèmes :**
- ❌ OrderDetailsPage ne calcule pas les reliquats
- ❌ Pas de bouton "Préparer le reliquat" pour BC PARTIALLY_SHIPPED
- ❌ `createPickingTaskFromSalesOrder()` calcule bien les reliquats mais n'est pas appelé

### 3. **Cohérence des statuts**

#### Mapping ancien → nouveau (à vérifier)
- ✅ 'Brouillon' → 'DRAFT'
- ✅ 'Confirmé' → 'CONFIRMED'
- ✅ 'Partiellement livré' → 'PARTIALLY_SHIPPED'
- ✅ 'Livré' → 'SHIPPED'
- ✅ 'Clos' → 'INVOICED'
- ✅ 'À préparer' → 'DRAFT' (BL)
- ✅ 'En préparation' → 'DRAFT' (BL) ou 'IN_PROGRESS' (BP) ?
- ⚠️ **INCOHÉRENCE** : 'En préparation' pour BL devrait être géré par BP IN_PROGRESS

#### Statuts BP manquants dans l'UI
- ❌ Pas d'affichage du statut BP dans l'interface
- ❌ Pas de badge BP dans OrderCard
- ❌ Pas de page dédiée pour voir les BP d'un BC

### 4. **Navigation et routing**

#### Problèmes de navigation
- ❌ App.tsx ne sait pas si on clique sur un SalesOrder, PickingTask ou DeliveryNote
- ❌ Pas de distinction entre "voir détails BC" et "voir préparation BP"
- ❌ Pas de page pour lister les BP d'un BC
- ❌ Pas de sélecteur si plusieurs BP actifs pour un BC

### 5. **Filtrage liste Atelier**

#### Problèmes
- ❌ `getOrdersForAtelier()` retourne encore `Order[]` avec anciens statuts
- ❌ Devrait utiliser `getSalesOrdersForAtelier()` qui retourne `SalesOrder[]`
- ❌ Filtre BC DRAFT mais utilise encore l'ancienne logique

## 🔧 Corrections nécessaires

### Priorité 1 : Adapter les composants principaux

1. **OrderDetailsPage.tsx → SalesOrderDetailsPage.tsx**
   - Accepter `SalesOrder` au lieu de `Order`
   - Afficher boutons selon statut BC (CONFIRMED, IN_PREPARATION, PARTIALLY_SHIPPED)
   - Calculer et afficher reliquats
   - Bouton "Créer un BP et préparer" pour BC CONFIRMED
   - Bouton "Voir la préparation en cours" pour BC IN_PREPARATION
   - Bouton "Préparer le reliquat" pour BC PARTIALLY_SHIPPED

2. **DeliveryPreparationPage.tsx → PickingTaskPreparationPage.tsx**
   - Accepter `PickingTask` au lieu de `Order`
   - Utiliser `PickingTask.scannedLots` au lieu de `DeliveryPreparation`
   - Scanner met à jour `PickingTask.scannedLots` via `scanLot()`
   - Validation appelle `completePickingTask()` qui crée le BL

3. **App.tsx - Navigation**
   - Détecter type de document (SalesOrder vs PickingTask vs DeliveryNote)
   - Navigation conditionnelle :
     - SalesOrder → SalesOrderDetailsPage
     - PickingTask → PickingTaskPreparationPage
     - DeliveryNote → DeliveryNoteDetailsPage
   - Créer BP depuis BC CONFIRMED via `createPickingTaskFromSalesOrder()`

4. **Vues de liste**
   - Utiliser `getSalesOrdersForAtelier()` au lieu de `getOrdersForAtelier()`
   - Afficher `SalesOrder[]` au lieu de `Order[]`
   - Filtrer BC DRAFT correctement

### Priorité 2 : Workflows complets

1. **Workflow BC → BP → BL**
   - ✅ Backend : OK
   - ❌ UI : À adapter

2. **Livraisons partielles**
   - ✅ Backend : `getRemainingQuantities()` OK
   - ❌ UI : À afficher et gérer

3. **Gestion BP multiples**
   - ❌ Sélecteur si plusieurs BP actifs
   - ❌ Page pour lister les BP d'un BC

### Priorité 3 : Cohérence et polish

1. **Statuts et badges**
   - Afficher badge BP dans OrderCard
   - Afficher statut BP dans les pages
   - Traductions français correctes

2. **Migration progressive**
   - Garder compatibilité avec `Order` pendant transition
   - Migrer progressivement les composants

## 📋 Checklist de validation

### Workflow BC CONFIRMED → BP → BL
- [ ] BC CONFIRMED visible dans liste Atelier
- [ ] Bouton "Créer un BP et préparer" visible et fonctionnel
- [ ] BP créé avec statut PENDING
- [ ] BC passe en IN_PREPARATION
- [ ] Redirection vers PickingTaskPreparationPage
- [ ] Scanner ajoute lots au BP
- [ ] BP passe en IN_PROGRESS au premier scan
- [ ] Validation complète le BP
- [ ] BL DRAFT créé automatiquement
- [ ] BC passe en SHIPPED (si reliquat = 0)

### Workflow livraisons partielles
- [ ] BC PARTIALLY_SHIPPED visible dans liste
- [ ] Reliquats affichés (commandé, livré, restant)
- [ ] Bouton "Préparer le reliquat" visible
- [ ] BP créé avec quantités restantes uniquement
- [ ] BC passe en SHIPPED après dernier BP

### Filtrage liste Atelier
- [ ] BC DRAFT n'apparaît pas
- [ ] BC CONFIRMED, IN_PREPARATION, PARTIALLY_SHIPPED apparaissent
- [ ] Utilise `getSalesOrdersForAtelier()`

### Navigation
- [ ] Clic sur BC → SalesOrderDetailsPage
- [ ] Clic sur BP → PickingTaskPreparationPage
- [ ] Clic sur BL → DeliveryNoteDetailsPage
- [ ] Navigation cohérente selon statut

## 🎯 Plan d'action recommandé

1. **Phase 1 : Adapter OrderDetailsPage pour SalesOrder**
   - Renommer en SalesOrderDetailsPage
   - Accepter SalesOrder
   - Afficher boutons selon statut BC
   - Calculer reliquats

2. **Phase 2 : Adapter DeliveryPreparationPage pour PickingTask**
   - Renommer en PickingTaskPreparationPage
   - Accepter PickingTask
   - Utiliser PickingTask.scannedLots
   - Validation crée BL

3. **Phase 3 : Mettre à jour navigation App.tsx**
   - Détecter type de document
   - Navigation conditionnelle
   - Créer BP depuis BC

4. **Phase 4 : Mettre à jour vues de liste**
   - Utiliser getSalesOrdersForAtelier()
   - Filtrer BC DRAFT

5. **Phase 5 : Tests et validation**
   - Tester tous les workflows
   - Vérifier cohérence
   - Corriger bugs


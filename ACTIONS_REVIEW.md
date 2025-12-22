# Review of Actions Available in Order Detail Pages

## Overview
This document reviews all actions available in each order detail page and identifies missing implementations.

---

## 1. OrderDetailsPage (BC - SalesOrder)

### Current Status Support
- `DRAFT` - Brouillon
- `CONFIRMED` - Confirmé
- `IN_PREPARATION` - En préparation
- `PARTIALLY_SHIPPED` - Partiellement livré
- `SHIPPED` - Livré
- `INVOICED` - Clos
- `CANCELLED` - Annulé

### Actions Currently Implemented ✅

#### For BC CONFIRMED:
- ✅ **"Créer un BP et préparer"** → `onCreatePickingTask`
  - Creates BP and redirects to preparation page
  - Backend: `createPickingTaskFromSalesOrder()`

#### For BC IN_PREPARATION:
- ✅ **"Voir la préparation en cours"** → `onViewPickingTask`
  - Shows active BP(s)
  - Redirects to `DeliveryPreparationPage`

#### For BC PARTIALLY_SHIPPED:
- ✅ **"Préparer le reliquat"** → `onCreatePickingTask`
  - Creates new BP for remaining quantities

#### For BC SHIPPED:
- ✅ **"Voir les BL"** → `onViewDeliveryNotes`
  - Shows delivery notes linked to this BC

#### For BC INVOICED/CANCELLED:
- ✅ Read-only mode (no actions)

#### Manufacturing Actions:
- ✅ **"Créer un ordre de fabrication"** → `onCreateManufacturingOrder`
  - Available for BC with stock issues
  - Requires product selection

### Actions Missing ❌

#### For BC DRAFT:
- ❌ **"Confirmer la commande"** → Should call `confirmSalesOrder()`
  - Backend function exists: `confirmSalesOrder(salesOrderId)`
  - Should transition: `DRAFT` → `CONFIRMED`
  - **NOT IMPLEMENTED**

#### For BC CONFIRMED/IN_PREPARATION:
- ❌ **"Annuler la commande"** → Should transition to `CANCELLED`
  - Backend function: **MISSING** (needs to be created)
  - Should handle cancellation logic

#### For BC SHIPPED:
- ❌ **"Voir les factures"** → View invoices linked to BLs
  - Not implemented (invoice viewing)

---

## 2. DeliveryPreparationPage (BP - PickingTask)

### Current Status Support
- `PENDING` - En attente
- `IN_PROGRESS` - En cours
- `COMPLETED` - Terminé
- `CANCELLED` - Annulé

### Actions Currently Implemented ✅

#### Scanning:
- ✅ **"Scanner"** button → `simulateScan()`
  - Opens camera modal
  - Calls `scanLot()` backend function
  - Auto-starts BP if `PENDING` → `IN_PROGRESS`
  - Max 2 lots per product rule
  - Disabled when delivery is fully ready

#### Lot Management:
- ✅ **Remove lot** → `handleRemoveLot()`
  - Removes scanned lot from preparation
  - Updates progress

#### Validation:
- ✅ **"Valider le bon de livraison"** → `validateDelivery()`
  - Only available when `IN_PROGRESS` and all products prepared
  - Calls `completePickingTask()` → Creates BL `DRAFT`
  - Backend: `completePickingTask()` → `createDeliveryNoteFromPickingTask()`

#### Navigation:
- ✅ **"Voir BC parent"** → `onViewSalesOrder`
  - Links back to parent SalesOrder

### Actions Missing ❌

#### For BP PENDING:
- ❌ **"Démarrer la préparation"** → Manual start button
  - Backend: `startPickingTask()` exists
  - Currently auto-starts on first scan (which is fine)
  - Could add explicit start button for clarity

#### For BP IN_PROGRESS:
- ❌ **"Annuler le BP"** → Cancel picking task
  - Backend function: **MISSING** (needs `cancelPickingTask()`)
  - Should transition: `IN_PROGRESS` → `CANCELLED`

#### For BP COMPLETED:
- ✅ Already handled (read-only, shows completion message)

---

## 3. DeliveryNoteDetailsPage (BL - DeliveryNote)

### Current Status Support (Legacy)
- `DRAFT` / `À préparer` - Brouillon
- `Prêt à expédier` - Ready to ship
- `Expédié` - Shipped
- `Livré` - Delivered
- `Facturé` - Invoiced
- `Annulé` - Cancelled

### New Status Support (Should support)
- `DRAFT` - Brouillon
- `SHIPPED` - Expédié
- `SIGNED` - Signé (optional V1)
- `INVOICED` - Facturé

### Actions Currently Implemented ✅

#### For BL DRAFT / "À préparer":
- ✅ **"Imprimer le BL"** → `window.print()` (TODO: proper implementation)

#### For BL "Prêt à expédier":
- ✅ **"Marquer comme expédié"** → `handleStatusTransition('Expédié')`
  - Transitions to `Expédié`
  - Backend: Should call `shipDeliveryNote()` but uses legacy `updateOrderStatus()`

#### For BL "Expédié":
- ✅ **"Marquer comme livré"** → `handleStatusTransition('Livré')`
  - Transitions to `Livré`
  - Backend: Uses legacy `updateOrderStatus()`

#### For BL "Livré":
- ✅ **"Créer la facture"** → `handleStatusTransition('Facturé')`
  - Transitions to `Facturé`
  - Backend: Should call `invoiceDeliveryNote()` but uses legacy `updateOrderStatus()`

#### For BL "Facturé":
- ✅ **"Voir la facture"** → Button exists (TODO: implement navigation)
- ✅ **"Imprimer le BL"** → `window.print()` (TODO: proper implementation)

### Actions Missing ❌

#### Status Transition Issues:
- ❌ **Using legacy status system** instead of new `DeliveryNoteStatus`
  - Should use: `DRAFT`, `SHIPPED`, `INVOICED`
  - Currently uses: `À préparer`, `Expédié`, `Livré`, `Facturé`
  - **Backend functions exist but not used:**
    - `shipDeliveryNote(deliveryNoteId)` - for `DRAFT` → `SHIPPED`
    - `invoiceDeliveryNote(deliveryNoteId)` - for `SHIPPED` → `INVOICED`

#### Missing Actions:
- ❌ **"Signer le BL"** → For `SIGNED` status (optional V1)
  - Backend function: **MISSING** (needs `signDeliveryNote()`)

- ❌ **"Annuler le BL"** → Cancel delivery note
  - Backend function: **MISSING** (needs `cancelDeliveryNote()`)

#### Implementation Issues:
- ❌ **Print functionality** → Uses `window.print()` (should be proper PDF generation)
- ❌ **Invoice viewing** → Button exists but no navigation implemented
- ❌ **Parent BP/BC links** → Not implemented (should show links to parent documents)

---

## Summary of Missing Backend Functions

### Needed Backend Functions:
1. ❌ `cancelSalesOrder(salesOrderId: string)` - Cancel a BC
2. ❌ `cancelPickingTask(pickingTaskId: string)` - Cancel a BP
3. ❌ `cancelDeliveryNote(deliveryNoteId: string)` - Cancel a BL
4. ❌ `signDeliveryNote(deliveryNoteId: string)` - Sign a BL (optional V1)

### Backend Functions Not Used:
1. ⚠️ `confirmSalesOrder()` - Exists but no UI button in `OrderDetailsPage` for `DRAFT` status
2. ⚠️ `shipDeliveryNote()` - Exists but `DeliveryNoteDetailsPage` uses legacy `updateOrderStatus()`
3. ⚠️ `invoiceDeliveryNote()` - Exists but `DeliveryNoteDetailsPage` uses legacy `updateOrderStatus()`

---

## Recommendations

### High Priority:
1. **Add "Confirmer" button** in `OrderDetailsPage` for BC `DRAFT` status
2. **Migrate `DeliveryNoteDetailsPage`** to use new `DeliveryNoteStatus` and backend functions
3. **Implement proper print functionality** (PDF generation instead of `window.print()`)

### Medium Priority:
4. **Add cancellation actions** for BC, BP, and BL (with confirmation dialogs)
5. **Add parent document links** in `DeliveryNoteDetailsPage` header
6. **Implement invoice viewing** navigation

### Low Priority:
7. **Add "Signer le BL"** action (optional V1 feature)
8. **Add explicit "Démarrer" button** for BP (currently auto-starts on scan)

---

## Action Matrix

| Document Type | Status | Available Actions | Missing Actions |
|--------------|--------|-------------------|-----------------|
| **BC (SalesOrder)** | DRAFT | - | Confirmer ❌ |
| | CONFIRMED | Créer BP ✅ | Annuler ❌ |
| | IN_PREPARATION | Voir BP ✅ | Annuler ❌ |
| | PARTIALLY_SHIPPED | Préparer reliquat ✅ | Annuler ❌ |
| | SHIPPED | Voir BL ✅ | Voir factures ❌ |
| | INVOICED | (Read-only) ✅ | - |
| | CANCELLED | (Read-only) ✅ | - |
| **BP (PickingTask)** | PENDING | Scanner (auto-start) ✅ | Démarrer explicitement ⚠️ |
| | IN_PROGRESS | Scanner, Valider ✅ | Annuler ❌ |
| | COMPLETED | (Read-only) ✅ | - |
| | CANCELLED | (Read-only) ✅ | - |
| **BL (DeliveryNote)** | DRAFT | Imprimer ✅ | Annuler ❌ |
| | SHIPPED | Marquer livré ✅ | Signer (V1) ❌ |
| | SIGNED | - | - |
| | INVOICED | Voir facture ✅ | - |

---

## Notes

- Legacy status system still in use for BL (`DeliveryNoteDetailsPage`)
- Some backend functions exist but are not connected to UI
- Print functionality needs proper implementation
- Cancellation actions need confirmation dialogs
- Parent document navigation needs implementation


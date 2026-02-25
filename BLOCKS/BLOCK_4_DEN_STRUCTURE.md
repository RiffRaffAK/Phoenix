# Block 4 — DEN Structure
**Phoenix Wolf Systems | Version 3.0.0 | Astral Prisms LLC**

---

## Overview

The DEN (Domestic Economic Node) is the fundamental organizational unit of Phoenix Wolf Systems. Every person belongs to a DEN. DENs define economic, social, and governance relationships.

---

## DEN Types

### Single DEN — Individual
- 1 adult, full financial autonomy
- Community voting rights
- Individual UBI receipt
- CAVE creation rights

### Married DEN — Couple
- 2 adults, optional joint finances
- Shared or separate wallets
- Enhanced voting weight (1.5x)
- Automatic divorce DEN conversion option

### Divorced DEN — Separated Family
- Split custody enforcement
- Cross-DEN child access
- Independent finances enforced
- Court-order compliance automation

### Family DEN — Full Unit
- 1-4 adults + children
- Head of Household role (elected)
- Parental control system
- Family voting system

---

## DEN Hierarchy

```
Family DEN
    │
    ├── Head of Household (elected adult)
    ├── Co-Head (optional second adult)
    ├── Adult Members (equal rights)
    ├── Young Adults 18-25 (partial autonomy)
    ├── Minors 13-17 (supervised)
    └── Children under 13 (maximum protection)
```

---

## DEN Permissions

| Action | Single | Married | Family Head | Minor | Child |
|--------|--------|---------|------------|-------|-------|
| Full financial access | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create CAVE | ✅ | ✅ | ✅ | ❌ | ❌ |
| Global vote | ✅ | ✅ | ✅ | ❌ | ❌ |
| Family vote | N/A | ✅ | ✅ | Limited | ❌ |
| UBI receipt | ✅ | ✅ | ✅ | Via parent | Via parent |
| Child management | N/A | Own | ✅ | ❌ | ❌ |

---

## DEN Economic Integration

```javascript
function getDENEconomics(denId) {
  const den = getDEN(denId);
  return {
    ubiTotal: den.members.reduce((sum, m) => sum + getUBIAmount(m.id), 0),
    wages: den.members.reduce((sum, m) => sum + getMonthlyWages(m.id), 0),
    jointBalance: den.wallets.joint?.balance || 0,
    expenses: getMonthlyExpenses(denId),
    netPosition: calculateNetPosition(den)
  };
}
```

---

## Community DEN Network

```
Individual DEN → Neighborhood (10-100 DENs) → Region → Nation → Global
```

Each level has voting rights and governance mechanisms.

---

*Block 4 — Phoenix Wolf Systems v3.0.0 | Astral Prisms LLC*

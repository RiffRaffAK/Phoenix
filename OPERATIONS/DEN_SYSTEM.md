# Phoenix Wolf Systems — DEN System
**Document Version:** 3.0.0  
**Authority:** Keli Voigt, Founder & Owner, Astral Prisms LLC  
**Status:** PRODUCTION READY  

---

## Overview

The **DEN System** is the foundational organizational unit of Phoenix Wolf Systems. A DEN represents a household or family unit with a shared economic and social identity. All users belong to at least one DEN.

---

## DEN Types

### 1. Single DEN (Individual)
For unmarried, unattached adults living independently.

```javascript
const SINGLE_DEN = {
  type: 'SINGLE',
  members: 1, // Primary adult only
  headCount: 1,
  votingWeight: 1.0,
  ubiMultiplier: 1.0,
  permissions: {
    financialAutonomy: 'FULL',
    businessCreation: true,
    votingRights: true,
    conferenceRoomAccess: true
  }
};
```

### 2. Married DEN (Couple)
For married or legally partnered couples.

```javascript
const MARRIED_DEN = {
  type: 'MARRIED',
  members: { min: 2, max: 2 }, // Two adults
  headCount: 2,
  votingWeight: 1.5, // Slightly higher as stable unit
  ubiMultiplier: 1.0, // Per person
  permissions: {
    jointFinances: 'OPTIONAL',
    sharedWallet: true,
    businessCreation: true,
    votingRights: true,
    childAddition: true
  },
  governance: {
    decisions: 'CONSENSUS_DEFAULT',
    disputes: 'MEDIATION_AVAILABLE',
    separation: 'DIVORCE_DEN_CONVERSION'
  }
};
```

### 3. Divorced DEN (Separated Family)
For families where parents are separated but share children.

```javascript
const DIVORCED_DEN = {
  type: 'DIVORCED',
  structure: {
    parent1DEN: 'SINGLE or REMARRIED',
    parent2DEN: 'SINGLE or REMARRIED',
    childrenShared: true,
    custodyArrangement: 'COURT_ORDER_ENFORCED'
  },
  custody: {
    primary: null, // Set by legal order
    secondary: null,
    shared: true,
    schedule: 'CUSTOM'
  },
  childAccess: {
    bothParentsRetainAccess: true,
    parentalControlsIndependent: true,
    childUBIHandling: 'SPLIT_BY_CUSTODY_PERCENTAGE'
  },
  permissions: {
    crossDENAccess: 'CHILDREN_ONLY',
    financialSeparation: 'ENFORCED',
    communicationChannel: 'MODERATED_OPTIONAL'
  }
};
```

### 4. Family DEN (Full Family Unit)
For families with children living together.

```javascript
const FAMILY_DEN = {
  type: 'FAMILY',
  structure: {
    adults: { min: 1, max: 4 }, // 1-4 adults
    children: { min: 0, max: 20 },
    extended: { grandparents: true, other: true }
  },
  hierarchy: {
    headOfHousehold: 'ELECTED_BY_ADULTS',
    coHeads: 'OPTIONAL',
    adultMembers: 'EQUAL_RIGHTS',
    youngAdults: 'PARTIAL_AUTONOMY',
    minors: 'SUPERVISED',
    children: 'PROTECTED'
  },
  governance: {
    majorDecisions: 'ADULT_MAJORITY_VOTE',
    minorDecisions: 'HEAD_OF_HOUSEHOLD',
    disputes: 'FAMILY_MEDIATION',
    emergency: 'HEAD_OF_HOUSEHOLD_OVERRIDE'
  }
};
```

---

## DEN Hierarchy and Permissions

### Permission Matrix

| Permission | Single | Married (each) | Divorced | Family Head | Family Adult |
|-----------|--------|---------------|---------|-------------|-------------|
| Create CAVE | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vote (Family) | N/A | ✅ | ✅ | ✅ | ✅ |
| Vote (Community) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vote (Global) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Children | N/A | ✅ | ✅ | ✅ | Limited |
| Joint Wallet | N/A | ✅ | ❌ | ✅ | Optional |
| Conference Room | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add Members | N/A | Mutual | Court order | ✅ | ❌ |

---

## Voting Within DEN

```javascript
class DENVotingSystem {
  initiateVote(denId, proposal, proposer) {
    const den = getDEN(denId);
    const eligibleVoters = den.getEligibleVoters(proposal.type);
    
    const vote = {
      id: generateUUID(),
      denId,
      proposal,
      proposer: proposer.id,
      eligibleVoters: eligibleVoters.map(v => v.id),
      votes: {},
      status: 'OPEN',
      openedAt: Date.now(),
      closesAt: Date.now() + (proposal.urgency === 'URGENT' ? 3600000 : 86400000),
      requiredMajority: proposal.type === 'MAJOR' ? 0.67 : 0.51
    };
    
    notifyEligibleVoters(eligibleVoters, vote);
    return vote;
  }

  castVote(voteId, voterId, choice) {
    const vote = getVote(voteId);
    if (!vote.eligibleVoters.includes(voterId)) throw new Error('NOT_ELIGIBLE');
    if (vote.votes[voterId]) throw new Error('ALREADY_VOTED');
    
    vote.votes[voterId] = { choice, timestamp: Date.now() };
    
    const result = this.checkForEarlyResolution(vote);
    if (result.resolved) this.resolveVote(vote, result.outcome);
    
    return { voted: true, currentTally: this.getTally(vote) };
  }
}
```

---

## DEN Dashboard

The DEN Dashboard provides real-time visibility into the family unit:

```
┌─────────────────────────────────────────────────────┐
│               FAMILY DEN DASHBOARD                   │
│                                                       │
│  DEN Name: [User Defined]                             │
│  DEN Type: Family | Members: 4 (2 adults, 2 children) │
│                                                       │
│  FINANCIAL SUMMARY                                    │
│  ─────────────────────────────────────────────────   │
│  Joint Wallet Balance:         $2,847.32              │
│  UBI This Month:               $1,200.00              │
│  Wages This Month:             $8,400.00              │
│  Expenses This Month:          $6,230.00              │
│                                                       │
│  MEMBERS                                              │
│  ─────────────────────────────────────────────────   │
│  Adult 1:  Head of Household   ✅ Verified             │
│  Adult 2:  Co-Head             ✅ Verified             │
│  Child 1:  Age 10 (Child tier) 🔒 Supervised          │
│  Child 2:  Age 15 (Minor tier) 🔒 Supervised          │
│                                                       │
│  ACTIVE VOTES    PENDING ACTIONS    ALERTS            │
│  1 pending       2 pending          0 alerts          │
└─────────────────────────────────────────────────────┘
```

---

## DEN Creation and Verification

```javascript
async function createDEN(creatorId, denType, initialMembers) {
  const creator = await getUser(creatorId);
  const verificationResults = await Promise.all(
    initialMembers.map(m => verifyIdentity(m.userId))
  );
  
  if (verificationResults.some(v => !v.verified)) {
    return { created: false, reason: 'MEMBER_VERIFICATION_FAILED' };
  }
  
  const den = {
    id: generateUUID(),
    type: denType,
    createdBy: creatorId,
    createdAt: Date.now(),
    members: initialMembers,
    wallets: { joint: null, individual: initialMembers.map(m => m.walletId) },
    governance: getDENGovernanceRules(denType),
    permissions: getDENPermissions(denType),
    status: 'ACTIVE'
  };
  
  await saveDEN(den);
  await notifyMembers(den.members, 'DEN_CREATED', den);
  
  return { created: true, denId: den.id };
}
```

---

## DEN Network

DENs are organized into communities, regions, and global networks for governance purposes:

```
Individual DEN
    │
    └── Neighborhood Community (10-100 DENs)
            │
            └── Regional Community (100-10,000 DENs)
                    │
                    └── National Network (All DENs in country)
                                │
                                └── Global Network (All DENs)
```

Each level has its own voting system and governance mechanisms, with decisions flowing appropriately between levels.

---

*Document maintained by Phoenix Wolf Systems Operations Authority*  
*Last Updated: 2025 | Version 3.0.0 | Astral Prisms LLC*

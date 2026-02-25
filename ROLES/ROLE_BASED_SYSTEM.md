# Phoenix Wolf Systems — Role-Based Access System

> **Status:** ACTIVE | **Roles:** 8 core | **Inheritance:** YES | **Audit Trail:** Immutable

---

## Overview

Phoenix Wolf Systems uses a role-based access control (RBAC) system with attribute-based extensions (ABAC) to manage what each person and system can do. All role assignments are logged immutably.

---

## Role Hierarchy

```
Founder (RiffRaffAK)
    └── Administrator
            ├── CAVE Owner
            │       ├── CAVE Manager
            │       └── CAVE Employee
            ├── DEN Leader
            │       ├── Co-Leader
            │       ├── Adult Member
            │       ├── Young Adult (18-25)
            │       ├── Child (13-17)
            │       └── Child (0-12)
            ├── Community Member
            └── Guest
AI Systems (Phoenix, Alaska) — Special role, parallel track
```

---

## Role Definitions

### Founder (RiffRaffAK)
- **Access:** All systems, all data, all functions
- **Special Permissions:** Constitutional override (emergencies only), final approval on amendments, AI system directives
- **Unique:** One person. Cannot be transferred.

### Administrator
- **Access:** Platform administration, all CAVE and DEN management
- **Cannot Do:** Modify constitutional values, access founder compensation, override founder
- **Appointment:** By founder only

### CAVE Owner
- **Access:** Full CAVE management, financial records, employee management
- **Cannot Do:** Violate labor law, override constitutional protections for employees
- **Assignment:** Auto-assigned on CAVE creation

### DEN Leader
- **Access:** Full DEN management, financial management, member oversight
- **Cannot Do:** Disable child safety protocols, prevent member from leaving
- **Assignment:** Designated at DEN creation

### Member
- **Access:** Own records, own wallet, own DEN/CAVE participation
- **Cannot Do:** Access other members' private data
- **Assignment:** Default on account creation

### Child (13-17)
- **Access:** Age-appropriate interface, own records (supervised), educational content
- **Cannot Do:** Financial transactions, voting, access adult content
- **Special:** Enhanced privacy protections, cannot waive own rights

### Child (0-12)
- **Access:** Child interface only, guardian-mediated
- **Cannot Do:** Any independent system access
- **Special:** Maximum protection; all access mediated by guardian

### Guest
- **Access:** Explicitly granted per session
- **Duration:** Time-bounded
- **Cannot Do:** Anything not explicitly granted

### AI Systems (Phoenix + Alaska)
- **Phoenix Access:** All layers read, governance write, constitutional enforcement
- **Alaska Access:** Security layers full, infrastructure, emotional support
- **Cannot Do:** Override founder, modify constitutional values without founder approval, make unilateral constitutional decisions

---

## Permission Matrix

| Action | Founder | Admin | CAVE Owner | DEN Leader | Member | Child 13-17 | AI |
|---|---|---|---|---|---|---|---|
| Modify constitution | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌* |
| Create CAVE | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage employees | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View own records | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View others' records | ✅ | Limited | Own CAVE | Own DEN | ❌ | ❌ | Limited |
| Vote (Layer 1) | ✅ | ✅ | ✅ | ✅ | ✅ | Advisory | ❌ |
| Vote (Layer 3) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Receive UBI | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (guardian) | ❌ |
| Override AI | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | N/A |

*AI systems can propose constitutional changes through proper governance process

---

## Role Audit Trail

Every role assignment, change, elevation, and revocation is logged immutably:

```
ROLE_AUDIT_ENTRY:
  event_id: UUID
  actor_id: UUID (who made the change)
  subject_id: UUID (whose role changed)
  old_role: Role
  new_role: Role
  reason: string
  timestamp_ns: bigint
  authorization: {approver_id, approval_ts}
  hash_chain: SHA3_256
```

---

## Child-Specific Protections

Children's roles cannot be modified to remove safety protections:
- Child safety monitoring cannot be disabled by DEN Leader
- Children cannot waive their own constitutional rights
- A child cannot be assigned an adult role until verified age 18
- Child accounts automatically upgrade at verified 18th birthday

---

*Phoenix Wolf Systems — Role-Based Access | 8 Core Roles | Audit Trail | Child Protections*

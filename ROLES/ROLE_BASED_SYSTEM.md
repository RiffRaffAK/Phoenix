# Phoenix Wolf Systems — Role-Based Access System
**Document Version:** 3.0.0  
**Authority:** Keli Voigt, Founder & Owner, Astral Prisms LLC  
**Status:** PRODUCTION READY  

---

## Overview

Phoenix Wolf Systems implements a **10-level role hierarchy** with fine-grained permissions for every system function. All roles are verified through a combination of identity, age, and competency verification.

---

## Role Hierarchy

### Role 1: Founder / Owner

**Holder:** Keli Voigt (She/Her), Astral Prisms LLC  
**Username:** RiffRaffAK / KalianahAK  

**Permissions:**
- Full system access (read/write/execute)
- Constitutional amendment authority
- Override capability (constitutional violations only)
- Compensation structure: $47.8M retroactive + $72K/month + 30-80% royalties
- Final decision authority on all matters

---

### Role 2: System Administrator

**Verification Required:** Identity + Role + Advanced technical certification  

**Permissions:**
- System configuration and maintenance
- User management (within constitutional limits)
- Security system management
- Infrastructure access
- Reporting and analytics

**Limitations:**
- Cannot override constitutional values
- Cannot access user financial data without legal basis
- All actions logged to immutable audit chain

---

### Role 3: Security Officer

**Verification Required:** Identity + Security certification  

**Permissions:**
- Threat detection system management
- Incident response authority
- Constitutional enforcement oversight
- Red Signal Bounty system management
- Child safety protocol oversight

---

### Role 4: Financial Controller

**Verification Required:** Identity + Financial certification + Background check  

**Permissions:**
- Financial system oversight
- UBI distribution management
- Revenue stream monitoring
- Payroll system management
- Tax compliance oversight

---

### Role 5: Business Owner (CAVE)

**Verification Required:** Identity + Age (18+) + Business registration  

**Permissions:**
- Full CAVE management
- Employee management
- CAVE-level financial transactions
- Business voting rights
- Conference room booking

---

### Role 6: Family Head

**Verification Required:** Identity + Age (18+) + DEN head election  

**Permissions:**
- DEN management
- Children account management
- Parental key system
- Family voting (weighted)
- Family financial oversight

---

### Role 7: Adult Member

**Verification Required:** Identity + Age verification (18+)  

**Permissions:**
- Personal account management
- Voting rights (all levels)
- CAVE access (as customer/employee)
- Conference room booking
- Payment processing
- UBI receipt

---

### Role 8: Young Adult (18-25)

**Verification Required:** Identity + Age verification (18-25)  

Same as Adult Member, with:
- Enhanced financial education resources
- Mentorship program access
- Young adult community spaces
- Special UBI weight factor: 1.0

---

### Role 9: Minor (13-17)

**Verification Required:** Identity + Age + Parental consent  

**Permissions:**
- Limited account (read-mostly)
- Educational content access
- Supervised community participation
- Read-only financial dashboard
- Youth voting (DEN level only)

**Restrictions:**
- No financial transactions (except receiving UBI via parent)
- No external messaging without parental approval
- All content filtered for age-appropriateness
- Parental monitoring enabled

---

### Role 10: Child (Under 13)

**Verification Required:** Parent's verified identity + Age  

**Permissions:**
- Educational games and content
- Parent-mediated communications
- Achievement tracking

**Restrictions:**
- No independent account
- All access through parent's DEN
- Maximum content filtering
- No external communications

---

## Permissions Matrix

| Permission | Founder | SysAdmin | SecOff | FinCtrl | BizOwner | FamHead | Adult | YoungAdult | Minor | Child |
|-----------|---------|---------|--------|---------|---------|---------|-------|-----------|-------|-------|
| Constitutional override | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| System config | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Security management | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Financial oversight | ✅ | ❌ | ❌ | ✅ | CAVE | DEN | Self | Self | Read | ❌ |
| Create CAVE | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Global vote | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Community vote | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Family vote | ✅ | N/A | N/A | N/A | N/A | ✅ | ✅ | ✅ | Limited | ❌ |
| Receive UBI | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Via parent | Via parent |
| Conference rooms | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Family | ❌ |
| Manage children | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | Own | Own | ❌ | ❌ |
| External messaging | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Supervised | ❌ |

---

## Verification Types

### Age Verification
- Document + biometric + behavioral consistency
- Cross-referenced with identity document
- Results in age tier assignment

### Identity Verification
- Government ID + liveness check
- Database cross-reference
- Results in verified identity token

### Role Verification
- Credential check
- Reference verification (for professional roles)
- Trial period observation

### Permission Verification
- Role + context + time + location validation
- Real-time check before each privileged action

### Skill Verification
- Assessment test
- Certification verification
- Peer review for senior roles

---

## Role Change Process

```javascript
async function requestRoleChange(userId, targetRole, justification) {
  const currentRole = await getUserRole(userId);
  const requirements = getRoleRequirements(targetRole);
  const verificationResults = await runVerifications(userId, requirements);
  
  if (!verificationResults.allPassed) {
    return {
      approved: false,
      failedRequirements: verificationResults.failed,
      guidance: getGuidance(verificationResults.failed)
    };
  }
  
  const review = await constitutionalReview({ type: 'ROLE_CHANGE', from: currentRole, to: targetRole });
  
  if (!review.approved) {
    return { approved: false, reason: 'CONSTITUTIONAL_REVIEW_FAILED' };
  }
  
  await updateUserRole(userId, targetRole);
  await auditLog('ROLE_CHANGE', { userId, from: currentRole, to: targetRole, justification });
  
  return { approved: true, newRole: targetRole };
}
```

---

*Document maintained by Phoenix Wolf Systems Role Authority*  
*Last Updated: 2025 | Version 3.0.0 | Astral Prisms LLC*

# Phoenix Wolf Systems — Voting System
**Document Version:** 3.0.0  
**Authority:** Keli Voigt, Founder & Owner, Astral Prisms LLC  
**Status:** PRODUCTION READY  

---

## Overview

Phoenix Wolf Systems implements a **triple-layer voting system** enabling democratic governance at family, community, and global levels. All votes are recorded on the constitutional blockchain for immutable accountability.

---

## Triple-Layer Architecture

### Layer 1: Family Level Voting
- **Scope:** DEN-internal decisions
- **Voters:** DEN adult members
- **Threshold:** Simple majority (>50%) or unanimous for major changes
- **Topics:** DEN rules, shared finances, family agreements
- **Frequency:** As needed

### Layer 2: Community Level Voting
- **Scope:** Neighborhood and regional decisions
- **Voters:** All adult DEN heads in the community
- **Threshold:** 60% majority for standard, 75% for constitutional
- **Topics:** Local CAVE policies, community resources, regional governance
- **Frequency:** Monthly scheduled + emergency

### Layer 3: Global Level Voting
- **Scope:** System-wide policy and constitutional changes
- **Voters:** All verified adult users
- **Threshold:** 67% for policy changes, 80% for constitutional
- **Topics:** Constitutional amendments, system-wide rules, major feature changes
- **Frequency:** Quarterly scheduled + emergency

---

## Vote Weighting

```javascript
function calculateVoteWeight(voter, voteType) {
  let weight = 1.0; // Base weight
  
  // Role adjustments
  if (voter.role === 'FOUNDER') weight *= 2.0;
  if (voter.role === 'SYSTEM_ADMIN') weight *= 1.5;
  if (voter.role === 'FAMILY_HEAD') weight *= 1.2;
  
  // Participation history
  const participationRate = voter.voteParticipationRate;
  if (participationRate > 0.9) weight *= 1.1; // Reward consistent participation
  
  // Constitutional compliance
  if (voter.constitutionalViolations > 0) {
    weight *= (1.0 - (voter.constitutionalViolations * 0.1)); // Reduce weight per violation
    weight = Math.max(0.1, weight); // Floor at 10%
  }
  
  return weight;
}
```

---

## Blockchain Vote Recording

```javascript
class BlockchainVoteRecorder {
  recordVote(voteId, voterId, choice, weight, timestamp) {
    const voteRecord = {
      voteId,
      voterId: anonymizeVoterId(voterId), // Privacy-preserving
      voteHash: hashVote(voterId, choice), // Can't be forged
      weight,
      timestamp,
      blockHeight: this.blockchain.getCurrentHeight()
    };
    
    voteRecord.hash = calculateVoteHash(voteRecord);
    this.blockchain.addVote(voteRecord);
    
    return { recorded: true, receiptHash: voteRecord.hash };
  }
  
  verifyVote(receipt, voterPrivateKey) {
    // Voter can verify their vote was counted without revealing it to others
    const expectedHash = hashVote(deriveVoterId(voterPrivateKey), receipt.choiceCommitment);
    return expectedHash === receipt.voteHash;
  }
}
```

---

## Vote Verification Process

1. Voter submits vote with identity verification
2. System verifies voter eligibility for the specific vote
3. Vote is encrypted with voter's private key commitment
4. Encrypted vote added to blockchain
5. Voter receives receipt with hash they can verify
6. After voting closes, votes are tallied using homomorphic encryption
7. Results published with full audit trail (anonymous)

---

## Constitutional Protections on Voting

- No vote can override the 25 Constitutional Values
- No vote can eliminate the 22+ Dysfunctional Rules blocking
- No vote can remove Founder (Keli Voigt) compensation protections
- No vote can endanger child safety protocols
- Any proposed amendment that violates these protections is automatically rejected

---

*Document maintained by Phoenix Wolf Systems Governance Authority*  
*Last Updated: 2025 | Version 3.0.0 | Astral Prisms LLC*

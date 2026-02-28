# Dysfunctional Rules

## 1. Wage Theft
### Blocking Logic
- Detects underpayment relative to agreed contract or applicable minimum wage laws.

### Detection Function
```javascript
function detectWageTheft(agreedWage, actualPaid, hoursWorked) {
    const expected = agreedWage * hoursWorked;
    return actualPaid < expected;
}
```

### Real-World Example
- An employer pays $8/hour despite a contract specifying $15/hour.

### Enforcement Mechanism
- Automatic flag triggers backpay calculation and notifies labor compliance system.

---

## 2. Unauthorized Data Collection
### Blocking Logic
- Blocks collection of user data beyond declared scope in the privacy policy.

### Detection Function
```javascript
function detectUnauthorizedCollection(requestedFields, declaredFields) {
    return requestedFields.some(field => !declaredFields.includes(field));
}
```

### Real-World Example
- An app collects biometric data when the user only consented to location access.

### Enforcement Mechanism
- Data request is blocked; incident logged; user notified immediately.

---

## 3. Child Exploitation
### Blocking Logic
- Any content, transaction, or interaction that endangers a minor is immediately terminated.

### Detection Function
```javascript
function detectChildExploitation(content, userAge) {
    const MINOR_AGE = 18;
    return userAge < MINOR_AGE && content.flaggedForAdults;
}
```

### Real-World Example
- Attempt to expose harmful adult content to a user under 18.

### Enforcement Mechanism
- Instant block; automatic notification to law enforcement; account suspended.

---

## 4. Identity Fraud
### Blocking Logic
- Detects impersonation of another user or entity in transactions or communications.

### Detection Function
```javascript
function detectIdentityFraud(claimedId, verifiedId) {
    return claimedId !== verifiedId;
}
```

### Real-World Example
- A user submits transactions claiming to be a different account holder.

### Enforcement Mechanism
- Transaction blocked; account flagged; security team alerted.

---

## 5. Algorithmic Discrimination
### Blocking Logic
- Flags decision-making algorithms that produce systematically biased outcomes against protected classes.

### Detection Function
```javascript
function detectAlgorithmicDiscrimination(outcomes, protectedAttribute) {
    const disparityThreshold = 0.2;
    const rates = groupOutcomeRates(outcomes, protectedAttribute);
    return Math.max(...rates) - Math.min(...rates) > disparityThreshold;
}
```

### Real-World Example
- A hiring algorithm rejects candidates from a specific demographic at significantly higher rates.

### Enforcement Mechanism
- Algorithm paused; disparity report generated; human review required before reactivation.

---

## 6. Financial Coercion
### Blocking Logic
- Detects patterns of forced or coerced financial transactions under duress.

### Detection Function
```javascript
function detectFinancialCoercion(transactionPattern, duressFlag) {
    return duressFlag || transactionPattern.isAbnormal;
}
```

### Real-World Example
- Repeated large transfers from a compromised account under external pressure.

### Enforcement Mechanism
- Transfers flagged; account temporarily frozen; user contacted for verification.

---

## 7. Platform Monopoly Abuse
### Blocking Logic
- Identifies anti-competitive behavior that restricts user choice or suppresses alternatives.

### Detection Function
```javascript
function detectMonopolyAbuse(marketSharePercent, exclusiveContracts) {
    return marketSharePercent > 80 && exclusiveContracts.length > 0;
}
```

### Real-World Example
- A platform requiring vendors to use only its payment processor under penalty of de-listing.

### Enforcement Mechanism
- Contracts reviewed; compliance report filed; platform practices audited.

---

## 8. Surveillance Without Consent
### Blocking Logic
- Blocks monitoring or tracking of users who have not provided explicit consent.

### Detection Function
```javascript
function detectUnconsentedSurveillance(trackingEnabled, consentGiven) {
    return trackingEnabled && !consentGiven;
}
```

### Real-World Example
- A device monitoring user location 24/7 without a clear consent prompt.

### Enforcement Mechanism
- Tracking disabled; user notified; consent re-requested with full disclosure.

---

## 9. Environmental Harm
### Blocking Logic
- Detects operations that exceed agreed environmental compliance thresholds.

### Detection Function
```javascript
function detectEnvironmentalHarm(emissions, legalLimit) {
    return emissions > legalLimit;
}
```

### Real-World Example
- Industrial system exceeds carbon emission caps defined in environmental compliance settings.

### Enforcement Mechanism
- Operation throttled; environmental report generated; regulatory notification queued.

---

## 10. Intellectual Property Theft
### Blocking Logic
- Flags use of creative or technical assets without proper licensing or attribution.

### Detection Function
```javascript
function detectIPTheft(assetId, licensedAssets) {
    return !licensedAssets.includes(assetId);
}
```

### Real-World Example
- Deploying proprietary software code without a valid license key.

### Enforcement Mechanism
- Asset use suspended; IP owner notified; legal review initiated.

---

## 11. Medical Data Misuse
### Blocking Logic
- Prevents use of personal health data outside of its consented medical purpose.

### Detection Function
```javascript
function detectMedicalDataMisuse(purpose, consentedPurposes) {
    return !consentedPurposes.includes(purpose);
}
```

### Real-World Example
- Health app sharing diagnostic data with insurers without patient consent.

### Enforcement Mechanism
- Data sharing blocked; patient notified; compliance violation logged.

---

## 12. Predatory Lending
### Blocking Logic
- Identifies loan offers with interest rates or terms designed to trap borrowers.

### Detection Function
```javascript
function detectPredatoryLending(apr, maxLegalAPR, hiddenFees) {
    return apr > maxLegalAPR || hiddenFees > 0;
}
```

### Real-World Example
- A microloan with 400% APR offered to a low-income user with obscured fee disclosures.

### Enforcement Mechanism
- Loan offer blocked; user directed to compliant alternatives; lender flagged.

---

## 13. Doxxing
### Blocking Logic
- Prevents publishing or broadcasting private identifying information without consent.

### Detection Function
```javascript
function detectDoxxing(content, privateInfoPatterns) {
    return privateInfoPatterns.some(pattern => pattern.test(content));
}
```

### Real-World Example
- Posting someone's home address, phone number, and employer on a public forum.

### Enforcement Mechanism
- Post removed immediately; publisher banned; affected user notified and protected.

---

## 14. Emotional Manipulation
### Blocking Logic
- Detects engineered content or UX patterns designed to exploit psychological vulnerabilities.

### Detection Function
```javascript
function detectEmotionalManipulation(contentFlags, userVulnerabilityScore) {
    return contentFlags.hasManipulativePatterns && userVulnerabilityScore > 7;
}
```

### Real-World Example
- Dark-pattern interfaces guilt-tripping users into paid upgrades they do not need.

### Enforcement Mechanism
- Manipulative UI element disabled; UX review flagged; design team notified.

---

## 15. Account Takeover
### Blocking Logic
- Detects unauthorized access to accounts via compromised credentials or brute force.

### Detection Function
```javascript
function detectAccountTakeover(loginAttempts, locationAnomaly, deviceAnomaly) {
    return loginAttempts > 5 || locationAnomaly || deviceAnomaly;
}
```

### Real-World Example
- Login from a foreign IP after multiple failed attempts with outdated credentials.

### Enforcement Mechanism
- Session terminated; account locked; user notified via backup contact.

---

## 16. Contractual Deception
### Blocking Logic
- Flags contract terms that are deliberately obscured, misleading, or contradict verbal agreements.

### Detection Function
```javascript
function detectContractualDeception(contractText, agreedTerms) {
    return agreedTerms.some(term => !contractText.includes(term));
}
```

### Real-World Example
- A terms-of-service clause burying a fee structure inconsistent with what the salesperson stated.

### Enforcement Mechanism
- Contract flagged for legal review; user warned before signing; dispute process opened.

---

## 17. Labor Classification Fraud
### Blocking Logic
- Identifies misclassification of employees as independent contractors to evade labor protections.

### Detection Function
```javascript
function detectClassificationFraud(controlLevel, benefitsProvided, workExclusivity) {
    return controlLevel === 'high' && !benefitsProvided && workExclusivity;
}
```

### Real-World Example
- A company directing workers' every task and schedule while classifying them as contractors.

### Enforcement Mechanism
- Classification reviewed; back benefits calculated; labor board notification queued.

---

## 18. Systemic Suppression
### Blocking Logic
- Detects platform-level actions that silence or shadow-ban users for political or protected-class reasons.

### Detection Function
```javascript
function detectSystemicSuppression(reachDropPercent, policyViolation) {
    return reachDropPercent > 80 && !policyViolation;
}
```

### Real-World Example
- A content creator's reach drops 90% with no policy violation cited and no notice given.

### Enforcement Mechanism
- Suppression action reversed; audit log created; creator notified with explanation.

---

## 19. Resource Hoarding
### Blocking Logic
- Flags accumulation of critical public resources by a single entity beyond equitable thresholds.

### Detection Function
```javascript
function detectResourceHoarding(entityShare, equitableLimit) {
    return entityShare > equitableLimit * 2;
}
```

### Real-World Example
- A corporation purchasing the majority of affordable housing stock in a city.

### Enforcement Mechanism
- Resource acquisition flagged; redistribution protocol initiated; regulatory alert sent.

---

## 20. Negligent Security
### Blocking Logic
- Identifies failure to maintain minimum security standards protecting user data.

### Detection Function
```javascript
function detectNegligentSecurity(encryptionEnabled, lastAuditDays, knownVulnerabilities) {
    return !encryptionEnabled || lastAuditDays > 180 || knownVulnerabilities > 0;
}
```

### Real-World Example
- User passwords stored in plaintext with no encryption and no audit in over a year.

### Enforcement Mechanism
- System access suspended; mandatory remediation plan required; users notified of breach risk.

---

## 21. Disinformation Amplification
### Blocking Logic
- Detects coordinated spread of provably false information at scale.

### Detection Function
```javascript
function detectDisinformationAmplification(contentVerified, amplificationCoordinated) {
    return !contentVerified && amplificationCoordinated;
}
```

### Real-World Example
- Automated bot network promoting health misinformation across multiple platforms simultaneously.

### Enforcement Mechanism
- Content suppressed; bot accounts suspended; fact-check overlay applied to remaining posts.

---

## 22. Economic Exclusion
### Blocking Logic
- Flags system designs or policies that structurally prevent marginalized groups from accessing economic participation.

### Detection Function
```javascript
function detectEconomicExclusion(accessRequirements, demographicBarriers) {
    return demographicBarriers.some(barrier => accessRequirements.includes(barrier));
}
```

### Real-World Example
- A financial platform requiring a credit score that is statistically inaccessible to certain demographics.

### Enforcement Mechanism
- Policy reviewed; alternative access pathway created; equity impact report generated.
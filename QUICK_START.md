# Phoenix Wolf Systems — Quick Start Guide
**Document Version:** 3.0.0  
**Authority:** Keli Voigt, Founder & Owner, Astral Prisms LLC  
**Status:** PRODUCTION READY  

---

## Overview

This guide covers getting started with Phoenix Wolf Systems, including DroidScript integration, your first DEN setup, and your first CAVE creation.

---

## Prerequisites

Before starting, ensure you have:

- [ ] Android device (Android 10+) or desktop browser
- [ ] DroidScript installed (for Android integration)
- [ ] Government-issued ID for identity verification
- [ ] Email address
- [ ] Phone number (for 2FA)

---

## Installation Steps

### Step 1: Create Your Account

1. Navigate to the Phoenix Wolf Systems registration page
2. Enter your email address and create a strong password
3. Verify your email address (link sent within 2 minutes)
4. Enable two-factor authentication (required for financial features)

### Step 2: Identity Verification

1. Upload a government-issued photo ID
2. Complete the liveness check (camera required)
3. Verify your phone number via SMS
4. Wait for verification (typically < 5 minutes for automated, < 24 hours for manual review)

### Step 3: Basic Configuration

1. Select your jurisdiction (for wage law compliance)
2. Choose your preferred language and currency
3. Set your payment preferences (see ECONOMY/PAYMENT_METHODS.md)
4. Configure your privacy settings

---

## DroidScript Integration Guide

### Installation

```javascript
// 1. Install DroidScript from Google Play Store
// 2. Create new DroidScript project: "PhoenixWolfSystems"
// 3. Add the Phoenix Wolf Systems SDK:

var app = B4A.CreateApp("PhoenixWolfSystems");

// Initialize Phoenix Wolf Systems connection
var phoenix = require("phoenix-wolf-systems-sdk");

phoenix.initialize({
  apiEndpoint: "https://your-pixel-internet-node.local",
  apiKey: "YOUR_API_KEY",
  userId: "YOUR_USER_ID",
  deviceType: "ANDROID_PERSONAL",
  sovereignMode: true // No external cloud
});
```

### Basic DroidScript UI Setup

```javascript
// Create the main layout
function OnStart() {
  var layout = app.CreateLinearLayout("VERTICAL,FILL");
  
  // DEN Dashboard button
  var btnDEN = app.CreateButton("My DEN Dashboard", 0.8, 0.1);
  btnDEN.SetOnTouch(openDENDashboard);
  layout.AddChild(btnDEN);
  
  // CAVE button
  var btnCAVE = app.CreateButton("My CAVE Business", 0.8, 0.1);
  btnCAVE.SetOnTouch(openCAVEDashboard);
  layout.AddChild(btnCAVE);
  
  // UBI Balance
  var txtUBI = app.CreateText("UBI Balance: Loading...", 0.8, 0.05);
  phoenix.getUBIBalance().then(balance => txtUBI.SetText("UBI Balance: $" + balance));
  layout.AddChild(txtUBI);
  
  app.AddLayout(layout);
}
```

---

## First DEN Setup

### Creating a Single DEN (Individual)

```javascript
async function createMyFirstDEN() {
  const denConfig = {
    type: 'SINGLE', // SINGLE | MARRIED | DIVORCED | FAMILY
    name: 'My Personal DEN',
    primaryMember: {
      userId: phoenix.getCurrentUserId(),
      role: 'HEAD'
    }
  };
  
  const result = await phoenix.den.create(denConfig);
  
  if (result.created) {
    console.log(`DEN created! ID: ${result.denId}`);
    openDENDashboard(result.denId);
  } else {
    console.error(`DEN creation failed: ${result.reason}`);
  }
}
```

### Creating a Family DEN

```javascript
async function createFamilyDEN(spouseEmail, childrenAges) {
  const denConfig = {
    type: 'FAMILY',
    name: 'Our Family DEN',
    members: [
      { role: 'HEAD', userId: phoenix.getCurrentUserId() },
      { role: 'CO_HEAD', email: spouseEmail } // Invite by email
    ],
    children: childrenAges.map(age => ({ age, status: 'PENDING_VERIFICATION' }))
  };
  
  const result = await phoenix.den.create(denConfig);
  return result;
}
```

---

## First CAVE Setup

### Creating a Service CAVE

```javascript
async function createMyFirstCAVE() {
  const caveConfig = {
    businessName: 'My Business',
    industryCode: 'TECHNOLOGY_SOFTWARE', // See INDUSTRIES/157_INDUSTRIES_SUPPORTED.md
    tier: 'MICRO', // MICRO | STANDARD | PROFESSIONAL | ENTERPRISE
    description: 'Professional software development services',
    services: [
      { name: 'Web Development', price: 150, unit: 'hour' },
      { name: 'App Development', price: 200, unit: 'hour' }
    ],
    paymentMethods: ['STRIPE', 'PAYPAL', 'BITCOIN'],
    jurisdiction: 'US_ALASKA' // For wage law compliance
  };
  
  const result = await phoenix.cave.create(caveConfig);
  
  if (result.created) {
    console.log(`CAVE created! ID: ${result.caveId}`);
    console.log(`Revenue projection: $${result.metrics.monthlyProjection}/month`);
  }
  
  return result;
}
```

---

## Testing Verification

### Verify Your Setup

```javascript
async function verifySetup() {
  const checks = await Promise.all([
    phoenix.system.checkConnection(),
    phoenix.auth.verifyAuthentication(),
    phoenix.den.getDENStatus(),
    phoenix.ubi.checkEligibility(),
    phoenix.security.runSelfTest()
  ]);
  
  const results = {
    connected: checks[0].connected,
    authenticated: checks[1].authenticated,
    denActive: checks[2].active,
    ubiEligible: checks[3].eligible,
    securityPassed: checks[4].allLayersPassed
  };
  
  const allPassed = Object.values(results).every(v => v === true);
  console.log(`Setup verification: ${allPassed ? 'ALL PASSED ✅' : 'ISSUES FOUND ❌'}`);
  console.log(results);
  
  return results;
}
```

---

## Common Configuration Options

```javascript
const phoenixConfig = {
  // Privacy settings
  privacy: {
    dataMinimization: true,
    analyticsOptOut: true,
    thirdPartySharing: false // Default: never
  },
  
  // Security settings
  security: {
    biometricAuth: true,
    hardwareKey: false, // Enable for max security
    sessionTimeout: 3600 // seconds
  },
  
  // Economic settings
  economic: {
    ubiPaymentMethod: 'CASHAPP', // $KalianahAK style handle
    currencyPreference: 'USD',
    taxJurisdiction: 'US_ALASKA'
  },
  
  // Notification settings
  notifications: {
    ubiDeposits: true,
    securityAlerts: true,
    denVotes: true,
    businessActivity: true
  }
};
```

---

## Support Resources

- **Documentation:** This repository (`/home/runner/work/Phoenix/Phoenix`)
- **System Status:** `PHOENIX_SYSTEM_STATUS.md`
- **Full Specification:** `COMPLETE_SPECIFICATION.md`
- **Constitutional Values:** `CONSTITUTION/CONSTITUTIONAL_VALUES.md`

---

*Document maintained by Phoenix Wolf Systems*  
*Last Updated: 2025 | Version 3.0.0 | Astral Prisms LLC*

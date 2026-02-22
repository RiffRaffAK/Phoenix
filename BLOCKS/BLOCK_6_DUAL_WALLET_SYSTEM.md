# BLOCK 6: Dual Wallet System Specifications

## Overview
The Dual Wallet System consists of two distinct wallets aimed at simplifying the management of different financial inflows and tracking transactions in real-time. This document delineates specifications for both wallets and details the necessary functionalities and features.

## Wallet A: Business Earnings
- **Purpose:** To manage and track business earnings.
- **Features:**
  - Ability to add and withdraw funds.
  - Real-time balance visibility.
  - Transaction history, including details of each transaction (date, amount, type).
  - Monthly reporting of total earnings and transaction summaries.

## Wallet B: Universal Basic Income (UBI)
- **Purpose:** To distribute a monthly UBI of $0.00625.
- **Features:**
  - Automatic monthly deposits into the wallet.
  - Real-time balance updates post each deposit.
  - Transaction history reflecting the monthly UBI deposits.

## Real-time Balance Tracking
- **Implementation:**
  - Each wallet will maintain a continually updated balance feature, reflecting any transactions that occur immediately.
  - Use of webhooks for instant updates on the app interface.

## Encryption Methods
- **Security Standards:**
  - **AES-256:** Utilized for encrypting wallet data, ensuring that sensitive information remains secure from unauthorized access.
  - **RSA-4096:** Employed for securely exchanging keys and establishing a secure connection.

## Transaction History
- **Logging Mechanism:**
  - All transactions will be recorded with timestamps and details.
  - Users can view their transaction history for both Wallet A and Wallet B distinctly.
  - Search functionality to retrieve specific transactions based on date or amount.

## Features
1. User Authentication
    - Secure login process with encryption.
2. User Interface
    - Intuitive layout for easy navigation between Wallet A and Wallet B.
3. Dashboard
    - Summary of total earnings from Wallet A and total UBI from Wallet B.
4. Notifications
    - Alerts for successful transactions and summaries at the end of each month.
5. Reporting Tools
    - Generation of reports for detailed analysis of earnings and UBI distribution.
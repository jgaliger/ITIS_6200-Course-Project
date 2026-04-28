# Secure File Sharing Application
### End-to-End Encryption via the X3DH Protocol & Double Ratchet Algorithm

**ITCS 6200-001: Principles of ISPC — Course Project**  
Justin Galiger | Clip Echendu  
University of North Carolina at Charlotte  

---

## Overview

This project is a secure file-sharing prototype built for ITIS 6200. It combines a web application with a cryptographic prototype to demonstrate how modern security mechanisms can be applied in practice.

The project has two main parts:
1. A **web application prototype** built with Node.js, Express, MongoDB, EJS, sessions, and bcrypt.
2. A **cryptographic prototype** that demonstrates X3DH-style key agreement, a symmetric-key ratchet, AES-256-GCM encryption, and a rollback attack simulation.

---

## Project Structure

```
ITIS_6200-Course-Project/
├── encryption.js          ← X3DH handshake + Symmetric Ratchet + AES-256-GCM
├── attackStimulator.js    ← Interactive ratchet rollback attack demo
├── main.js                ← Express app entry point
├── controllers/
│   ├── documentActions.js ← File upload, display, delete
│   └── userActions.js     ← Auth, login, session, profile
├── middlewares/
│   ├── auth.js            ← isGuest / isLoggedIn middleware
│   └── validator.js       ← ObjectId validation
├── models/
│   ├── document.js        ← MongoDB schema (stores ciphertext as Buffer)
│   └── user.js            ← MongoDB schema (bcrypt password hashing)
├── routes/
│   ├── documentRoutes.js
│   └── userRoutes.js
├── views/                 ← EJS templates
└── public/css/
    └── style.css
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port 27017  
  *(MongoDB Compass recommended for easy local setup)*

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/jgaliger/ITIS_6200-Course-Project.git
cd ITIS_6200-Course-Project
npm install
```

If any packages are missing, install them manually:

```bash
npm install express ejs morgan method-override mongoose express-session connect-mongo connect-flash bcrypt
```

---

## Running the Project

There are three separate entry points depending on what you want to demonstrate.

---

### 1. Crypto Layer in Isolation

Runs the X3DH handshake and Symmetric Ratchet standalone — no server required. Demonstrates that Alice and Bob independently derive the same shared secret, then encrypt and decrypt files using ratchet-derived keys.

```bash
node encryption.js
```

**Expected output:**
```
[Alice]  Shared key: a3d9311b...
[Bob]    Shared key: a3d9311b...   ← must match Alice

=== Test 1: Alice → Bob ===
[Alice]  Sent:      This is a secret file from Alice.
[Bob]    Decrypted: This is a secret file from Alice.
[Match]: SUCCESS
```

---

### 2. Attack Simulation (Ratchet Rollback)

An interactive terminal simulation that demonstrates the failure case: if an attacker obtains and restores an older snapshot of a user's ratchet state, the protocol begins re-deriving key material from that earlier point, breaking forward secrecy.

```bash
node attackStimulator.js
```

**Available commands:**

| Command    | Description |
|------------|-------------|
| `status`   | Print Alice's and Bob's current ratchet values |
| `snapshot` | Save Alice's current ratchet state |
| `step`     | Simulate one file transfer (advances both ratchets) |
| `rollback` | Restore Alice's ratchet to the saved snapshot |
| `exit`     | Quit the simulator |

#### Demonstrating the Attack (step-by-step)

```
> status          ← Note Alice's initial ratchet values
> snapshot        ← Save current state
> step            ← Advance ratchet (note new values — call these "Step 1 values")
> step            ← Advance again
> step            ← Advance again
> rollback        ← Restore Alice's ratchet to the snapshot
> status          ← Alice's values now match the original snapshot ← ATTACK CONFIRMED
> step            ← Advance from rolled-back state
> status          ← Alice's values now match "Step 1 values" — ratchet is replaying
```

**What this shows:** After rollback, Alice's ratchet produces the same key material it generated earlier in the session. An attacker who can restore ratchet state can decrypt messages that should have been protected by forward secrecy.

#### Demonstrating the Success Case

```
> status
> step
> status          ← Ratchet values are completely different — new key for every transfer
> step
> status          ← Different again — forward secrecy confirmed
```

**What this shows:** Under normal operation, every file transfer produces fresh, uncorrelated key material. Past keys are not recoverable from the current state.

---

### 3. Working Web Application

Starts the full Express + MongoDB web app. Requires MongoDB running locally.

```bash
node main.js
```

Then open your browser to: **http://localhost:3000**

**To test the application:**
1. Navigate to `/users/newUser` to create an account
2. Log in at `/users/login`
3. Upload files at `/documents/upload`
4. View your uploaded documents from your profile

> **Note:** If MongoDB fails to connect, open MongoDB Compass and create a connection to `mongodb://localhost:27017`. The app uses a database named `demos`.

---

## Security Properties

| Property | Mechanism | How it works |
|---|---|---|
| Forward Secrecy | Symmetric Ratchet | Each ratchet step discards the old state — past keys are unrecoverable |
| Authenticated Encryption | AES-256-GCM | Auth tag detects any ciphertext tampering before plaintext is released |
| Async Key Agreement | X3DH | Sender establishes shared secret using only recipient's public keys |
| Password Protection | bcrypt (cost=10) | Slow adaptive hashing — database dump doesn't expose credentials |
| Access Control | express-session | Users can only access documents tied to their own account |

---

## Threat Model Summary

This system explicitly treats the **server as an untrusted party**. The three adversaries we defend against:

1. **Malicious server admin** — has full database read access. Files are stored as ciphertext; the server has no decryption keys.
2. **External attacker** — intercepts network traffic. TLS in transit + client-side encryption means captured ciphertext is useless.
3. **Unauthorized user** — has a valid account but attempts to access others' files. Session middleware and author-field checks prevent this.

---

## References

- [1] Aptekar-Cassels, Wesley. "Motivating X3DH." Jan. 2024. https://blog.wesleyac.com/posts/motivating-x3dh
- [2] Signal Messenger. "The Double Ratchet Algorithm." https://signal.org/docs/specifications/doubleratchet/
- [3] Filippakis, Nikos. "Implementing Signal's Double Ratchet Algorithm." Apr. 2020. https://nfil.dev/coding/encryption/python/double-ratchet-example/

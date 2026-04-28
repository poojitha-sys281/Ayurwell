# AyurWell - Phase 1: Auth Setup

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Firebase
1. Go to https://console.firebase.google.com
2. Create a new project (e.g. "ayurwell")
3. Go to Project Settings → Your Apps → Add Web App
4. Copy your config values into `src/firebase/config.js`
5. In Firebase Console → Authentication → Sign-in method → Enable **Email/Password**
6. In Firebase Console → Firestore Database → Create database (start in test mode)

### 3. Run the app
```bash
npm start
```

## File Structure
```
src/
├── firebase/
│   └── config.js          ← Put your Firebase credentials here
├── context/
│   └── AuthContext.js     ← All auth logic (signup, login, logout)
├── pages/
│   ├── Signup.js          ← Signup form + email OTP trigger
│   ├── Login.js           ← Login form
│   └── ProfileSetup.js    ← Optional: age, gender, conditions
├── components/
│   └── ProtectedRoute.js  ← Guards pages from unauthenticated access
├── styles/
│   └── global.css         ← All styling
└── App.js                 ← Routes
```

## Flow
1. User visits `/signup` → fills Name, Email, Password → clicks Sign Up
2. Firebase sends verification email (OTP equivalent)
3. User clicks `/login` → authenticated → goes to `/profile-setup`
4. Optionally fills Age, Gender, Conditions → saved to Firestore
5. Proceeds to `/dosha-quiz` (Phase 2)

## Firestore Data Structure
```
users/
  {uid}/
    name: "Poornima"
    email: "user@email.com"
    mobile: "+91..."
    createdAt: timestamp
    dosha: null           ← filled in Phase 2
    healthProfile: null   ← filled in Phase 3
    optionalProfile:
      age: "21"
      gender: "female"
      conditions: ["Diabetes"]
```

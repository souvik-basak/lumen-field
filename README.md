# 🏟️ Lumen Field - Smart Venue Platform

![Cloud Build Status](https://img.shields.io/badge/Google_Cloud_Run-Deployed-emerald?style=for-the-badge&logo=googlecloud)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

A next-generation, bi-directional web architecture completely reimagining the physical stadium experience. Built at the edge for the **#PromptWarsVirtual** Hackathon hosted by Google for Developers and Hack2Skill.

---

## 📖 The Architecture

The system is engineered as a seamless, dual-interface ecosystem governed by a centralized, fast-forwarding simulation engine (Zustand). Actions on the Fan side propagate instantly to the Staff side, simulating thousands of concurrent live-environment variables.

### 1️⃣ The Fan Experience Dashboard
A hyper-localized portal bridging the gap between fans and stadium infrastructure.
*   **Wait-Time Topography:** Dynamically fetches and sorts simulated congestion for Concessions, Merchandise, Exits, and Restrooms.
*   **Smart Transit Engine:** Simulates real-time Light Rail departure schedules so fans can plot their exit strategy effectively.
*   **Contextual AI Prompts:** Ingests live match-minute data to dispatch context-aware alerts.
*   **SOS Emergency Beacons:** A localized panic button that securely drops a pin containing the user's explicit seating coordinates directly to the command center.
*   **Connected Concessions:** Real-time food ordering with "In-Seat Delivery" status updates synced from the kitchen.

### 2️⃣ The Tactical Command Center (Ops)
A formidable, high-contrast dashboard empowering security directors to marshal crowd density across a massive 70,000-seat venue.
*   **Live Order Dispatch:** Real-time kitchen display system (KDS) showing incoming fan orders and dispatching runners.
*   **Incident Response:** Unified SOS alert banner with "Resolve & Sync" capabilities.
*   **Geospatial Intelligence Map:** A heat-mapping system indicating structural chokepoints in real time.
*   **Security Feeds**: AI-powered CCTV grid with simulated threat detection.

---

## 🔒 Security & Privacy

*   **Role-Based Access Control (RBAC):** Admin-only access to `/staff` routes with automatic redirection for unauthorized fans.
*   **Identity Required (AuthWall):** Premium features like the "VIP Club Pass," "Smart Transit Wallet," and "Private Parking Locator" are protected by a high-fidelity visual blur until the user signs in.
*   **Local Admin Access:** For hackathon evaluation, a local admin account is pre-configured.

### 🔑 Reviewer Credentials
- **Account Type:** Venue Administrator
- **Email:** `admin@stadium.com`
- **Password:** `admin`

---

## 🛠️ The Tech Stack

*   **Core:** React 19 + TypeScript + Vite
*   **Cloud Backend:** Google Firebase (Firestore/Auth)
*   **Real-time Sync:** Firestore + BroadcastChannel (Hybrid local/cloud sync core)
*   **Styling & UI:** TailwindCSS, Framer Motion (Glassmorphism patterns)
*   **Deployment:** Containerized via Docker & Deployed on **Google Cloud Run**

---

## 🚀 Deployment (Cloud Run)

The application is containerized for standard OCI environments.
1. **Build Container:**
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT_ID]/lumen-field
   ```
2. **Deploy Service:**
   ```bash
   gcloud run deploy lumen-field --image gcr.io/[PROJECT_ID]/lumen-field --platform managed --region us-central1 --allow-unauthenticated
   ```

---

## ⚙️ Quick Start (Run Locally)

1. **Clone the repository**
2. **Install core dependencies:**
   ```bash
   npm install
   ```
3. **Set up the Environment:**
   Create a `.env` file at the root:
   ```text
   VITE_GOOGLE_MAPS_API_KEY=your_key
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_PROJECT_ID=lumen-field
   ```
4. **Boot the Engine:**
   ```bash
   npm run dev
   ```

*Designed under extreme prototyping constraints. Powered by Code.*

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
*   **Wait-Time Topography:** Dynamically fetches and sorts simulated congestion for Concessions, Merchandise, Exits, and Restrooms to help fans avoid standing in line.
*   **Smart Transit Engine:** Simulates real-time Light Rail departure schedules so fans can plot their exit strategy effectively.
*   **Contextual AI Prompts:** Ingests live match-minute data to dispatch context-aware alerts (e.g. *"Halftime is 5 mins away! Pre-order drinks now and skip the 20 min queue."*).
*   **SOS Emergency Beacons:** A localized panic button that securely drops a pin containing the user's explicit seating coordinates directly to the command center.

### 2️⃣ The Tactical Command Center (Ops)
A formidable, high-contrast dashboard empowering security directors to marshal crowd density across a massive 70,000-seat venue.
*   **Kanban Dispatch Grid:** Real-time ticketing layout sorting SOS requests directly from the fan dashboard, allowing staff to deploy specific unit rosters (Medics, Tactical, Security).
*   **Geospatial Intelligence Map:** A heat-mapping system directly connected to the simulated crowd API, indicating structural chokepoints in real time.
*   **Interactive CCTV Grid (`SecurityFeeds`)**:
    *   **Simulated PTZ Joysticks:** CSS-Manipulated camera panning to locally examine angles.
    *   **AI Threat Modeling:** Injected `framer-motion` bounding boxes that simulate live computer vision tracking over massive public crowds.
    *   **Aerial Drone Overrides:** Hot-swapping primary feeds to massive 4K drone flyovers during critical alerts.

---

## 🛠️ The Tech Stack

*   **Core:** React 19 + TypeScript + Vite
*   **Styling & UI:** TailwindCSS, Tailwind-Merge, clsx
*   **Animation & Micro-interactions:** Framer Motion (glassmorphism UI patterns)
*   **Icons:** Lucide-React
*   **State Machine:** Zustand (Simulation core & Global State handling)
*   **Deployment & Edge Hosting:** Containerized via Docker & Deployed fully on **Google Cloud Run**

---

## 🚀 Future Roadmap

This MVP establishes the foundational routing and state logic. Moving forward, the platform is targeted to adopt:
- [ ] **WebAR Wayfinding Lens:** Augmented reality camera overlays painting turn-by-turn routing paths on the stadium floor.
- [ ] **Predictive AI Modeling:** Ingesting historical crowd data to predict and reroute jams 15 mins *before* they manifest.
- [ ] **In-Seat Drone Deliveries:** UberEats-style ordering dispatched algorithmically directly to specific stadium rows.
- [ ] **Blockchain NFT Ticketing:** Rotating 10-second cryptographic QR codes to completely eliminate physical ticket scalping.

---

## ⚙️ Quick Start (Run Locally)

1. **Clone the repository**
2. **Install core dependencies:**
   ```bash
   npm install
   ```
3. **Set up the Environment:**
   Create a `.env` file at the root and pass your Google Maps API key (if applicable to active modules):
   ```text
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```
4. **Boot the Vite Engine:**
   ```bash
   npm run dev
   ```

*Designed under extreme prototyping constraints. Powered by Code.*

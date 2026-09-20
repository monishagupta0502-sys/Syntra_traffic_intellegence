# SYNTRA — Urban Traffic Digital Twin
### Urban Traffic Network Intelligence & Digital Twin Platform

> **"Evaluate traffic interventions virtually before deploying them in the physical world."**

SYNTRA is an operational digital twin for urban traffic networks. It models corridor performance, detects systemic bottlenecks, simulates secondary traffic spillovers, and compares "what-if" infrastructure changes using microscopic traffic modeling principles.

---

### 🌐 Live Prototype

**[Launch the SYNTRA Traffic Intelligence Dashboard →](https://syntratrafficai.netlify.app/)**

> Live demonstration of the SYNTRA urban traffic digital twin, including traffic visualization, congestion analysis, scenario simulation, and infrastructure impact analysis.

## Key Capabilities

1. **Digital Twin Interactive Network Map**
   - High-contrast, dark-mode cartographic canvas powered by Leaflet.
   - Live directional flow polylines color-coded by empirical velocity ratios ($V / V_{\text{free-flow}}$).
   - Dynamic simulation overlays: Active Incidents, Critical Bottlenecks, Emergency Corridors, and Infrastructure Projects.
   - Comprehensive Road Inspector detailing speed, flow, density, queue length, and volume-to-capacity indices.

2. **What-If Scenario Simulation Engine**
   - Quantitative before-and-after comparisons of planned or unplanned network events:
     - **Complete Road Closure** (Accidents, Utility Work)
     - **Multi-Lane Collisions** (Flow Throttling)
     - **Infrastructure Expansion** (Adding Travel Lanes)
     - **Signal Retiming & Junction Modifications**
     - **Upstream Dynamic Diversions**
   - Transparent reporting: Never outputs vague scores like "Better"; outputs exact empirical deltas:
     - $\Delta \text{ Mean Velocity}$ ($\text{km/h}$ and $\%$)
     - $\Delta \text{ Average Travel Time}$ ($\text{min}$ and $\%$)
     - $\Delta \text{ Network Delay Penalty}$ ($\text{min}$ and $\%$)
     - $\Delta \text{ Queue Spillback Length}$ ($\text{meters}$)

3. **Secondary Impact & Traffic Ripple Propagation**
   - Explicitly demonstrates that urban traffic is a coupled network problem:
     - **Primary Tier**: The direct closure / incident location.
     - **Secondary Tier**: Immediate parallel arteries absorbing diverted volume (+46% surge).
     - **Tertiary Tier**: Downstream interchange ramps saturating from queue spillback.

4. **Predictive Congestion Forecasting**
   - Temporal horizons: +15m, +30m, +45m, +60m.
   - Visualized with 95% Bayesian confidence intervals and contributing causal factors.

5. **Simulated Emergency Priority Corridors**
   - *Advisory Decision Support Only*: Evaluates green-wave priority signal preemption for trauma transit routes without controlling physical city hardware.

6. **Virtual Traffic Control Room**
   - Operations desk status overview, categorized alert feeds (`INFO`, `WARNING`, `CRITICAL`), and rapid tactical scenario triggers.

---

## System Architecture

```
┌────────────────────────────────────────────────────────┐
│             SYNTRA React Frontend (SPA)                │
│    Leaflet Map · Recharts · Tailwind CSS · Dark Theme  │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (port 8000 or fallback)
┌───────────────────────────▼────────────────────────────┐
│               SYNTRA Python / FastAPI Backend           │
│   Network Topology · Incident Engine · Scenario Logic │
└───────────────────────────┬────────────────────────────┘
                            │ TraCI Protocol (Port 8813)
┌───────────────────────────▼────────────────────────────┐
│         Eclipse SUMO Microscopic Simulator            │
│   Car-Following Models · Network Grid · Trips / Routes │
└────────────────────────────────────────────────────────┘
```

---

## Technical Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Leaflet & React-Leaflet, Recharts, Lucide Icons.
- **Backend**: Python 3.11+, FastAPI, Pydantic, TraCI (`traci`), SUMOlib.
- **Simulation**: Eclipse SUMO (Simulation of Urban MObility) with Krauss car-following models.

---

## Quickstart Guide

### 1. Web Application (AI Studio / Local Node)
The web application runs out of the box with zero external configuration. If a live SUMO/FastAPI backend is detected on `http://localhost:8000`, SYNTRA seamlessly connects; otherwise, it operates using its calibrated microscopic simulation engine.

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev
```

### 2. Optional: Python FastAPI Backend
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r backend/requirements.txt

# Start backend server
python -m backend.main
```

### 3. Optional: Headless Eclipse SUMO Simulation
```bash
# Run the SUMO runner with TraCI
python sumo/runner.py --close-edge --edge E_N2_N3
```

---

## Core Formulation Reference

$$\text{Speed Ratio } R = \frac{V_{\text{current}}}{V_{\text{free-flow}}}$$
- $R > 0.80$: Free-Flow
- $0.60 \le R \le 0.80$: Moderate Flow
- $0.40 \le R < 0.60$: Heavy Congestion
- $R < 0.40$: Severe Breakdown / Gridlock

$$\text{Network Delay Penalty } \Delta t = t_{\text{actual}} - t_{\text{free-flow}}$$

$$\text{Volume-to-Capacity Ratio } = \frac{\text{Hourly Flow}}{\text{Lanes} \times \text{Capacity per Lane}}$$

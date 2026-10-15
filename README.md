<div align="center">

# 🧪 Water Sort Puzzle Engine
### Enterprise-Grade Standalone Game Module & Fluid Physics Core

<p>
  <sub><b>Authorized by:</b> Rayaan Tasnim</sub> &nbsp;&bull;&nbsp;
  <sub><b>Powered by:</b> IDAI Universe</sub> &nbsp;&bull;&nbsp;
  <sub><b>Theme:</b> Soft Alabaster White (`bg-slate-50`) & Neon Dynamic Layering</sub>
</p>

<img src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Fluid geometry and light refraction abstract background" width="720" style="border-radius: 12px; margin-top: 16px; margin-bottom: 16px;" />

</div>

---

## 1. Cinematic Hero Banner & Core Manifesto

Welcome to the enterprise-grade architecture documentation for the standalone **Water Sort Puzzle** module. Engineered from the ground up to push the boundaries of browser-based application performance, this module merges rigorous mathematical state management with fluid, luxury user interfaces. 

### Executive System Manifesto
Authorized under the visionary direction of **Rayaan Tasnim** and architected within the **IDAI Universe** ecosystem, this module abandons bloated framework abstractions in favor of lean, sub-millisecond thread execution. Built upon a pure light-theme philosophy (`bg-slate-50`), the system relies on high-brightness neon interaction layers—including **Electric Cyan**, **Hot Magenta**, and **Vivid Lime**—to deliver an immersive visual hierarchy without compromising rendering performance.

---

## 2. Standalone Module File Directory

The project layout maintains absolute modular segregation, ensuring seamless integration into larger monorepos or independent deployment pipelines:

```text
src/
├── css/
│   ├── tailwind.config.js         # Core styling configurations and light-neon utilities registry
│   └── animations.css             # Custom GSAP and keyframe transition layers
├── js/
│   ├── telemetryEngine.js         # Central telemetry calculations engine layer
│   └── stateMachine.js            # Immutable game state validator
└── games/
    └── water-sort/
        ├── index.jsx              # Rules portal root component
        ├── GameArena.jsx          # Interactive multi-tube physics playing field
        └── ResultsHub.jsx         # Performance telemetry and score distribution hub
```

---

## 3. Advanced Expandable Dropdown Matrices

<details>
<summary><b>💡 Core Logic & Stacking Arrays (Click to Expand)</b></summary>

The underlying calculation core manages fluid layering using a precise two-dimensional matrix notation:

* **Matrix Representation:** `water[a][i]` where `a` denotes the tube index and `i` represents the vertical segment level (ranging from index `0` at the bottom to `3` at the rim).
* **Stacking Validation Rules:** A pour operation is strictly permitted if and only if:
  1. The target tube is not full (`target.length < MAX_CAPACITY`).
  2. The source tube contains at least one active liquid block.
  3. Either the target tube is completely empty, or the top color of the target tube matches the incoming fluid color.
* **GSAP Rotation Physics:** Pour animations execute via a dynamic pivot calculation, rotating tubes between **75 and 90 degrees** with custom easing (`power2.inOut`) to simulate natural fluid momentum and surface tension oscillation.

</details>

<details>
<summary><b>🎙️ 20+ Chess-Style Rapid Commentary Register (Click to Expand)</b></summary>

The engine tracks user interaction velocity, tactical sequences, and move efficiency, dispatching real-time feedback across a robust commentary matrix:

* **Velocity Triggers:** Instantaneous state updates under 12ms register as *Lightning Transfer*, *Kinetic Flow*, and *Sub-Second Cascade*.
* **Sequential Streaks:** Consecutive valid color matches without backtracking trigger high-intensity verbal prompts like *Harmonic Alignment*, *Prismatic Mastery*, and *Symphonic Viscosity*.
* **Display Rules:** Commentary text dynamically updates in the top telemetry banner using high-contrast neon highlights (`text-cyan-600`, `text-fuchsia-600`, `text-lime-600`) mapped directly against the `bg-slate-50` backdrop.

</details>

<details>
<summary><b>📊 6 Architectural Performance Rankings (Click to Expand)</b></summary>

Performance telemetry is evaluated across six rigorous tiers based on move count, execution speed, and puzzle complexity:

1. **QUANTUM EDGE** — Flawless execution with zero redundant moves and optimal rotational latency.
2. **NEON VELOCITY** — High-speed completion with minor path corrections.
3. **PRISMATIC FLOW** — Standard optimal solution achieved within expected procedural thresholds.
4. **HARMONIC DRIFT** — Stable resolution accompanied by standard heuristic recalculations.
5. **VISCOUS LAG** — Extended puzzle duration involving multiple trial-and-error branches.
6. **STATIC DRIFT** — Baseline fallback category for incomplete or highly fragmented state sequences.

*Payload Layout:* Each rank automatically formats a JSON clipboard payload containing timestamp, move ledger, and rendering frame-rate telemetry for easy debugging and leaderboard export.

</details>

---

## 4. Production Deployment & Local Bootstrap Guide

Execute the following commands within your terminal environment to initialize, develop, and build the standalone module for enterprise production environments:

```bash
# 1. Install workspace dependencies
npm install

# 2. Boot the local Vite development server with HMR
npm run dev

# 3. Generate optimized production distribution bundles
npm run build
```

### Static Server Rewrite Router Configuration
When deploying the module to static hosting environments (such as Nginx, Apache, or AWS S3 + CloudFront), configure your rewrite rules to route all incoming requests to `index.html`. This ensures that Pretty URLs and API-style router endpoints resolve cleanly without exposing visible `.html` file extensions:

```nginx
# Nginx Fallback Rewrite Directive Example
location / {
    try_files $uri $uri/ /index.html;
}
```

---

<div align="center">
  <sub>Document ID: WS-DOC-2026-V1 &bull; Architecture Maintained by IDAI Universe Engineering</sub>
</div>
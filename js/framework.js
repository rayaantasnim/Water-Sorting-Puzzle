/**
 * ═══════════════════════════════════════════════════════════════════
 * WATER SORT PUZZLE - CORE FRAMEWORK & TELEMETRY ENGINE
 * Authorized by Rayaan Tasnim | Powered by IDAI Universe
 * © 2026 GAME ZONE. ALL RIGHTS RESERVED.
 * ═══════════════════════════════════════════════════════════════════
 */

// ─── DATA REGISTER 1: 20+ CHESS-STYLE RAPID COMMENTARY MATRIX ─────
const COMMENTARY_MATRIX = {
  SUB_SECOND: [
    "Supersonic Solve!",
    "Hyper-Velocity Response!",
    "Light Speed Reflex!",
    "Quantum Velocity Unlocked!",
    "Blazing Acceleration!"
  ],
  TACTICAL_OPTIMAL: [
    "Brilliant Move!",
    "Grandmaster Precision!",
    "Flawless Trajectory!",
    "Highly Optimal Pathing!",
    "Absolute Genius Inversion!"
  ],
  STREAK_MOMENTUM: [
    "On Fire! 🔥",
    "Unstoppable System Momentum!",
    "Deep Flow State Achieved!",
    "Flawless Combo Sequence!",
    "Dominating the Matrix!"
  ],
  RECOVERY_READJUSTMENT: [
    "Tactical Recovery!",
    "System Balance Restored!",
    "Excellent Readjustment!",
    "Back on the Target Node!",
    "Calculated Risk Mitigation!"
  ]
};

// ─── DATA REGISTER 2: PERFORMANCE METRICS & 6-RANK ENGINE ─────────
const SYSTEM_RANKS = [
  { min: 95, max: 100, rank: "QUANTUM EDGE", tier: "Tier S+", color: "#06b6d4", badgeBg: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  { min: 85, max: 94,  rank: "APEX VECTOR",  tier: "Tier S",  color: "#ec4899", badgeBg: "bg-pink-50 text-pink-600 border-pink-200" },
  { min: 70, max: 84,  rank: "HYPER MATRIX", tier: "Tier A",  color: "#8b5cf6", badgeBg: "bg-purple-50 text-purple-600 border-purple-200" },
  { min: 50, max: 69,  rank: "LOGIC CORE",   tier: "Tier B",  color: "#f59e0b", badgeBg: "bg-amber-50 text-amber-600 border-amber-200" },
  { min: 30, max: 49,  rank: "ALPHA NODE",   tier: "Tier C",  color: "#3b82f6", badgeBg: "bg-blue-50 text-blue-600 border-blue-200" },
  { min: 0,  max: 29,  rank: "STATIC DRIFT", tier: "Tier D",  color: "#64748b", badgeBg: "bg-slate-100 text-slate-600 border-slate-300" }
];

/**
 * Calculates game points, penalties, tier, and procedural suggestion text.
 * @param {number} timeSpentSeconds - Runtime duration in fractional seconds
 * @param {number} totalMoves - Count of total moves made by user
 * @param {number} optimalMoves - Baseline theoretical minimum moves
 * @param {number} parTimeSeconds - Baseline time window (standard: 30s)
 */
function evaluatePerformance(timeSpentSeconds, totalMoves, optimalMoves = 10, parTimeSeconds = 30) {
  // Time Penalty: Deduct 1 point for every 2 seconds spent past the par time window
  const timeOverPar = Math.max(0, timeSpentSeconds - parTimeSeconds);
  const timePenalty = Math.floor(timeOverPar / 2);

  // Inefficiency Penalty: Deduct 2 points for every extra redundant move executed beyond baseline
  const redundantMoves = Math.max(0, totalMoves - optimalMoves);
  const inefficiencyPenalty = redundantMoves * 2;

  // Final Points: Clamped to [0, 100]
  const rawScore = 100 - timePenalty - inefficiencyPenalty;
  const points = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Identify assigned rank
  const matchedRank = SYSTEM_RANKS.find(r => points >= r.min && points <= r.max) || SYSTEM_RANKS[SYSTEM_RANKS.length - 1];

  // Efficiency / Accuracy percentage
  const efficiencyPct = optimalMoves > 0 
    ? Math.min(100, Math.round((optimalMoves / Math.max(optimalMoves, totalMoves)) * 100))
    : 100;

  // Procedural Suggestion Engine: Generate custom dynamic feedback vectors combining live metrics
  const suggestion = generateProceduralSuggestion(timeSpentSeconds, parTimeSeconds, totalMoves, optimalMoves, efficiencyPct, points);

  return {
    points,
    rank: matchedRank.rank,
    tier: matchedRank.tier,
    badgeBg: matchedRank.badgeBg,
    color: matchedRank.color,
    timeSpentSeconds,
    timeFormatted: formatDuration(timeSpentSeconds),
    totalMoves,
    optimalMoves,
    parTimeSeconds,
    timePenalty,
    inefficiencyPenalty,
    efficiencyPct,
    suggestion
  };
}

/**
 * Parses runtime duration into dynamic fractional seconds string:
 * e.g., "0 minutes 56.56 seconds" or "3 minutes 23.98 seconds"
 */
function formatDuration(totalSeconds) {
  const s = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(s / 60);
  const seconds = (s % 60).toFixed(2);
  const paddedSec = seconds < 10 ? '0' + seconds : seconds;
  return `${minutes} minutes ${paddedSec} seconds`;
}

/**
 * Procedural Suggestion Engine combining live time and accuracy percentages at runtime.
 */
function generateProceduralSuggestion(timeSpent, parTime, moves, optimal, accuracyPct, points) {
  const paceVector = timeSpent <= parTime
    ? `Hypersonic pace detected (${(parTime - timeSpent).toFixed(1)}s under par window)`
    : `Execution duration exceeded target envelope by ${(timeSpent - parTime).toFixed(1)}s`;

  const tacticalVector = moves <= optimal
    ? `achieving a pristine 100% pathing efficiency with zero redundant fluid transfers`
    : `incurring ${moves - optimal} redundant fluid transfers with ${accuracyPct}% trajectory accuracy`;

  const strategicAdvice = accuracyPct < 75
    ? `Recommendation: Prioritize isolating empty auxiliary vials early to reduce intermediate layer stacking.`
    : timeSpent > parTime + 20
    ? `Recommendation: Accelerate sequence scanning speed; multi-layer identical color transfers can be executed in rapid bursts.`
    : `Recommendation: Outstanding mental coordinate indexing! Ready to dominate higher complexity permutation matrices.`;

  return `${paceVector}, ${tacticalVector}. ${strategicAdvice}`;
}

/**
 * Picks a random commentary line based on move conditions
 */
function getCommentary(condition) {
  const list = COMMENTARY_MATRIX[condition] || COMMENTARY_MATRIX.TACTICAL_OPTIMAL;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

// ─── SYNTHESIZED WEB AUDIO API SOUND ENGINE ───────────────────────
class SoundFXEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSelect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playPour() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    // Layered liquid pouring bubbling noise
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const baseFreq = 340 + i * 160;
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime + i * 0.06);
      osc.frequency.linearRampToValueAtTime(baseFreq + 80, this.ctx.currentTime + i * 0.06 + 0.14);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.06);
      osc.stop(this.ctx.currentTime + i * 0.06 + 0.2);
    }
  }

  playCompleteTube() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.14, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.26);
    });
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const chords = [
      [523.25, 659.25],
      [587.33, 698.46],
      [659.25, 783.99],
      [783.99, 1046.50],
      [1046.50, 1318.51]
    ];
    chords.forEach((pair, idx) => {
      pair.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.12);
        osc.stop(this.ctx.currentTime + idx * 0.12 + 0.36);
      });
    });
  }

  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(190, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(130, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }
}

const audioFX = new SoundFXEngine();

// ─── UNIVERSAL PERSISTENT NAVBAR & HAMBURGER CONTROLLER ───────────
document.addEventListener('DOMContentLoaded', () => {
  const toggler = document.getElementById('menu-toggle-btn');
  const dropdown = document.getElementById('nav-dropdown');

  if (toggler && dropdown) {
    toggler.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdown.classList.contains('hidden-menu');
      if (isHidden) {
        dropdown.classList.remove('hidden-menu');
        dropdown.classList.add('show-menu');
      } else {
        dropdown.classList.add('hidden-menu');
        dropdown.classList.remove('show-menu');
      }
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !toggler.contains(e.target)) {
        dropdown.classList.add('hidden-menu');
        dropdown.classList.remove('show-menu');
      }
    });
  }
});

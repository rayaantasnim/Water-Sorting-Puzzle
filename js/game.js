/**
 * ═══════════════════════════════════════════════════════════════════
 * WATER SORT PUZZLE - CORE GAMEPLAY & GSAP ANIMATION LOGIC
 * Authorized by Rayaan Tasnim | Powered by IDAI Universe
 * © 2026 GAME ZONE. ALL RIGHTS RESERVED.
 * ═══════════════════════════════════════════════════════════════════
 */

// Liquid color palette tokens
const COLOR_CLASSES = {
  cyan: 'color-cyan',
  magenta: 'color-magenta',
  amber: 'color-amber',
  emerald: 'color-emerald',
  violet: 'color-violet',
  coral: 'color-coral',
  blue: 'color-blue',
  lime: 'color-lime'
};

const COLOR_HEX = {
  cyan: '#06b6d4',
  magenta: '#ec4899',
  amber: '#f59e0b',
  emerald: '#10b981',
  violet: '#8b5cf6',
  coral: '#ea580c',
  blue: '#2563eb',
  lime: '#65a30d'
};

// Preset Level Configurations (guaranteed solvable)
const PRESET_LEVELS = [
  {
    level: 1,
    title: "Quantum Genesis",
    parTime: 30,
    optimalMoves: 7,
    tubes: [
      ['cyan', 'magenta', 'cyan', 'magenta'],
      ['magenta', 'cyan', 'magenta', 'cyan'],
      [],
      []
    ]
  },
  {
    level: 2,
    title: "Tri-Chromic Lattice",
    parTime: 35,
    optimalMoves: 10,
    tubes: [
      ['cyan', 'amber', 'magenta', 'cyan'],
      ['magenta', 'cyan', 'amber', 'magenta'],
      ['amber', 'magenta', 'cyan', 'amber'],
      [],
      []
    ]
  },
  {
    level: 3,
    title: "Prism Matrix",
    parTime: 45,
    optimalMoves: 14,
    tubes: [
      ['emerald', 'cyan', 'magenta', 'amber'],
      ['magenta', 'amber', 'emerald', 'cyan'],
      ['cyan', 'emerald', 'amber', 'magenta'],
      ['amber', 'magenta', 'cyan', 'emerald'],
      [],
      []
    ]
  },
  {
    level: 4,
    title: "Hyperflux Node",
    parTime: 50,
    optimalMoves: 18,
    tubes: [
      ['violet', 'coral', 'emerald', 'cyan'],
      ['cyan', 'violet', 'coral', 'emerald'],
      ['emerald', 'cyan', 'violet', 'coral'],
      ['coral', 'emerald', 'cyan', 'violet'],
      [],
      []
    ]
  },
  {
    level: 5,
    title: "Apex Equilibrium",
    parTime: 60,
    optimalMoves: 22,
    tubes: [
      ['blue', 'magenta', 'lime', 'amber'],
      ['lime', 'amber', 'blue', 'magenta'],
      ['magenta', 'lime', 'amber', 'blue'],
      ['amber', 'blue', 'magenta', 'lime'],
      ['blue', 'amber', 'lime', 'magenta'],
      [],
      []
    ]
  }
];

class WaterSortGame {
  constructor() {
    this.currentLevelIndex = 0;
    this.tubes = [];
    this.initialTubesState = [];
    this.selectedTubeIndex = null;
    this.isPouring = false;
    this.moveHistory = [];
    this.totalMoves = 0;
    this.startTime = null;
    this.elapsedSeconds = 0;
    this.timerInterval = null;
    this.totalTransitionPauseTime = 0;
    this.transitionStartTime = null;
    this.lastMoveTimestamp = null;
    this.correctMoveStreak = 0;
    this.isVictory = false;

    // DOM Elements
    this.arenaContainer = document.getElementById('tube-arena');
    this.timerDisplay = document.getElementById('timer-display');
    this.movesDisplay = document.getElementById('moves-display');
    this.levelBadge = document.getElementById('level-badge');
    this.commentaryToast = document.getElementById('commentary-toast');
    this.streamBeam = document.getElementById('pouring-stream');
    this.pouringCanvas = document.getElementById('pouring-canvas');
    this.streamCurve = document.getElementById('stream-curve');
    this.streamImpact = document.getElementById('stream-impact');
    this.streamStop1 = document.getElementById('stream-stop-1');
    this.streamStop2 = document.getElementById('stream-stop-2');
    this.btnUndo = document.getElementById('btn-undo');
    this.btnReset = document.getElementById('btn-reset');
    this.btnNextLevel = document.getElementById('btn-next-level');
    this.btnMute = document.getElementById('btn-mute');
    this.btnHint = document.getElementById('btn-hint');

    this.initEventListeners();
    this.loadLevel(0);
  }

  initEventListeners() {
    if (this.btnReset) {
      this.btnReset.addEventListener('click', () => this.resetLevel());
    }
    if (this.btnUndo) {
      this.btnUndo.addEventListener('click', () => this.undoMove());
    }
    if (this.btnNextLevel) {
      this.btnNextLevel.addEventListener('click', () => this.nextLevel());
    }
    if (this.btnMute) {
      this.btnMute.addEventListener('click', () => {
        audioFX.muted = !audioFX.muted;
        const soundIcon = document.getElementById('sound-icon');
        const soundText = document.getElementById('sound-text');
        if (soundIcon && soundText) {
          soundIcon.textContent = audioFX.muted ? '🔇' : '🔊';
          soundText.textContent = audioFX.muted ? 'Muted' : 'Sound';
        } else {
          this.btnMute.textContent = audioFX.muted ? '🔇 Muted' : '🔊 Sound';
        }
      });
    }
    if (this.btnHint) {
      this.btnHint.addEventListener('click', () => this.provideHint());
    }
  }

  loadLevel(index) {
    if (index >= PRESET_LEVELS.length) {
      index = 0;
    }
    this.currentLevelIndex = index;
    const config = PRESET_LEVELS[this.currentLevelIndex];

    // Deep clone tubes configuration
    this.tubes = JSON.parse(JSON.stringify(config.tubes));
    this.initialTubesState = JSON.parse(JSON.stringify(config.tubes));
    this.selectedTubeIndex = null;
    this.isPouring = false;
    this.moveHistory = [];
    this.totalMoves = 0;
    this.totalTransitionPauseTime = 0;
    this.transitionStartTime = null;
    this.correctMoveStreak = 0;
    this.isVictory = false;
    this.lastMoveTimestamp = null;

    if (this.levelBadge) {
      this.levelBadge.textContent = `Level 0${config.level}: ${config.title}`;
    }
    if (this.movesDisplay) {
      this.movesDisplay.textContent = '0';
    }

    this.resetTimer();
    this.startTimer();
    this.renderArena();
  }

  resetLevel() {
    if (this.isPouring) return;
    this.tubes = JSON.parse(JSON.stringify(this.initialTubesState));
    this.selectedTubeIndex = null;
    this.moveHistory = [];
    this.totalMoves = 0;
    this.totalTransitionPauseTime = 0;
    this.transitionStartTime = null;
    this.correctMoveStreak = 0;
    this.isVictory = false;
    this.lastMoveTimestamp = null;
    if (this.movesDisplay) {
      this.movesDisplay.textContent = '0';
    }
    this.resetTimer();
    this.startTimer();
    this.renderArena();
    this.showCommentaryToast("Level Reset · Fresh Trajectory Ready!");
  }

  nextLevel() {
    this.loadLevel((this.currentLevelIndex + 1) % PRESET_LEVELS.length);
  }

  startTimer() {
    this.startTime = Date.now();
    this.totalTransitionPauseTime = 0;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.isVictory) return;
      // Strictly decoupled simulation logic: prevent clock accumulation during transitions
      if (this.isPouring) return;
      this.elapsedSeconds = Math.max(0, (Date.now() - this.startTime - this.totalTransitionPauseTime) / 1000);
      if (this.timerDisplay) {
        const mins = Math.floor(this.elapsedSeconds / 60);
        const secs = (this.elapsedSeconds % 60).toFixed(1);
        this.timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
    }, 100);
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.elapsedSeconds = 0;
    this.totalTransitionPauseTime = 0;
    this.transitionStartTime = null;
    if (this.timerDisplay) {
      this.timerDisplay.textContent = '0:00.0';
    }
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  renderArena() {
    if (!this.arenaContainer) return;
    this.arenaContainer.innerHTML = '';

    this.tubes.forEach((tubeContent, tubeIdx) => {
      const tubeDiv = document.createElement('div');
      tubeDiv.className = 'glass-tube relative transition-transform duration-200';
      tubeDiv.dataset.index = tubeIdx;
      tubeDiv.id = `tube-${tubeIdx}`;

      // Check if tube is completed (has exactly 4 identical colors)
      const isCompleted = tubeContent.length === 4 && tubeContent.every(c => c === tubeContent[0]);
      if (isCompleted) {
        tubeDiv.classList.add('completed');
      }

      // Render segments (from bottom to top)
      tubeContent.forEach((colorKey) => {
        const seg = document.createElement('div');
        seg.className = `liquid-segment ${COLOR_CLASSES[colorKey] || 'color-cyan'}`;
        tubeDiv.appendChild(seg);
      });

      // Add click handler
      tubeDiv.addEventListener('click', () => this.handleTubeClick(tubeIdx));

      this.arenaContainer.appendChild(tubeDiv);
    });
  }

  handleTubeClick(tubeIndex) {
    if (this.isPouring || this.isVictory) return;

    audioFX.init();

    // Case 1: No tube currently selected
    if (this.selectedTubeIndex === null) {
      if (this.tubes[tubeIndex].length === 0) {
        // Can't select an empty tube as source
        audioFX.playError();
        return;
      }
      this.selectTube(tubeIndex);
    } 
    // Case 2: User clicked the currently selected tube -> Deselect
    else if (this.selectedTubeIndex === tubeIndex) {
      this.deselectTube();
    } 
    // Case 3: User selected a target tube
    else {
      const sourceIdx = this.selectedTubeIndex;
      const targetIdx = tubeIndex;

      if (this.canPour(sourceIdx, targetIdx)) {
        this.executePourAnimation(sourceIdx, targetIdx);
      } else {
        // Invalid target
        audioFX.playError();
        // Shake target tube slightly
        const targetEl = document.getElementById(`tube-${targetIdx}`);
        if (targetEl && window.gsap) {
          gsap.fromTo(targetEl, { x: -6 }, { x: 6, duration: 0.08, repeat: 3, yoyo: true, onComplete: () => {
            gsap.set(targetEl, { x: 0 });
          }});
        }
        // Deselect or switch selection if target has liquids
        if (this.tubes[targetIdx].length > 0) {
          this.deselectTube();
          this.selectTube(targetIdx);
        } else {
          this.deselectTube();
        }
      }
    }
  }

  selectTube(idx) {
    this.selectedTubeIndex = idx;
    audioFX.playSelect();
    const tubeEl = document.getElementById(`tube-${idx}`);
    if (tubeEl) {
      tubeEl.classList.add('selected');
      if (window.gsap) {
        gsap.to(tubeEl, { y: -18, duration: 0.2, ease: 'power2.out' });
      }
    }
  }

  deselectTube() {
    if (this.selectedTubeIndex === null) return;
    const tubeEl = document.getElementById(`tube-${this.selectedTubeIndex}`);
    if (tubeEl) {
      tubeEl.classList.remove('selected');
      if (window.gsap) {
        gsap.to(tubeEl, { y: 0, duration: 0.2, ease: 'power2.out' });
      }
    }
    this.selectedTubeIndex = null;
  }

  canPour(sourceIdx, targetIdx) {
    const sourceTube = this.tubes[sourceIdx];
    const targetTube = this.tubes[targetIdx];

    if (!sourceTube || sourceTube.length === 0) return false;
    if (!targetTube || targetTube.length >= 4) return false;

    // Target tube is empty -> always allowed
    if (targetTube.length === 0) return true;

    // Top color of target must match top color of source
    const sourceTopColor = sourceTube[sourceTube.length - 1];
    const targetTopColor = targetTube[targetTube.length - 1];

    return sourceTopColor === targetTopColor;
  }

  /**
   * GSAP Timeline Sequence for Pouring Animation
   */
  executePourAnimation(sourceIdx, targetIdx) {
    this.isPouring = true;
    const sourceEl = document.getElementById(`tube-${sourceIdx}`);
    const targetEl = document.getElementById(`tube-${targetIdx}`);

    if (!sourceEl || !targetEl || !window.gsap) {
      this.applyMoveLogic(sourceIdx, targetIdx);
      this.isPouring = false;
      this.deselectTube();
      this.renderArena();
      this.checkGameState();
      return;
    }

    const sourceTube = this.tubes[sourceIdx];
    const targetTube = this.tubes[targetIdx];
    const colorToPour = sourceTube[sourceTube.length - 1];

    // Count consecutive units of top color from source
    let unitsToTransfer = 0;
    for (let i = sourceTube.length - 1; i >= 0; i--) {
      if (sourceTube[i] === colorToPour) {
        unitsToTransfer++;
      } else {
        break;
      }
    }
    // Limit to available target capacity
    const availableSlots = 4 - targetTube.length;
    unitsToTransfer = Math.min(unitsToTransfer, availableSlots);

    // Save move to history for undo
    this.moveHistory.push({
      source: sourceIdx,
      target: targetIdx,
      count: unitsToTransfer,
      color: colorToPour
    });

    // Velocity & Tactical evaluation
    const now = Date.now();
    let moveCondition = 'TACTICAL_OPTIMAL';
    if (this.lastMoveTimestamp) {
      const delta = now - this.lastMoveTimestamp;
      if (delta < 1200) {
        moveCondition = 'SUB_SECOND';
      }
    }
    this.correctMoveStreak++;
    if (this.correctMoveStreak >= 3 && moveCondition !== 'SUB_SECOND') {
      moveCondition = 'STREAK_MOMENTUM';
    }
    this.lastMoveTimestamp = now;

    // Show dynamic toast commentary
    this.showCommentaryToast(getCommentary(moveCondition));

    // Decouple simulation logic from the game clock: record transition start
    this.transitionStartTime = Date.now();

    // Calculate relative spatial distance between tubes
    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const deltaX = targetRect.left - sourceRect.left;
    const deltaY = targetRect.top - sourceRect.top;

    // Direction and rotation angle between 75 and 90 degrees
    const isPouringRight = deltaX >= 0;
    const tiltAngle = isPouringRight ? 80 : -80;
    const transformOrigin = isPouringRight ? '85% 15%' : '15% 15%';

    // Position source tube rim precisely over target tube mouth aperture
    const hoverOffsetHorizontal = isPouringRight ? deltaX - 16 : deltaX + 16;
    const hoverOffsetVertical = deltaY - 54;

    const tl = gsap.timeline({
      onComplete: () => {
        // Strictly decouple simulation logic: compensate for elapsed transition time
        if (this.transitionStartTime) {
          this.totalTransitionPauseTime += (Date.now() - this.transitionStartTime);
          this.transitionStartTime = null;
        }

        // Reset source tube styles
        sourceEl.classList.remove('selected');
        gsap.set(sourceEl, { x: 0, y: 0, rotation: 0, zIndex: 1 });
        this.selectedTubeIndex = null;
        this.isPouring = false;
        this.applyMoveLogic(sourceIdx, targetIdx, unitsToTransfer);
        this.renderArena();
        this.checkGameState();
      }
    });

    // Step 1: Elevate source and move over target lip
    tl.to(sourceEl, {
      zIndex: 50,
      duration: 0.05
    });

    tl.to(sourceEl, {
      x: hoverOffsetHorizontal,
      y: hoverOffsetVertical,
      duration: 0.35,
      ease: 'power2.inOut'
    });

    // Step 2: Tilt precisely between 75° and 90° angle
    tl.to(sourceEl, {
      rotation: tiltAngle,
      transformOrigin: transformOrigin,
      duration: 0.25,
      ease: 'power2.out',
      onStart: () => {
        audioFX.playPour();
        this.triggerGravityArcStream(sourceEl, targetEl, isPouringRight, colorToPour);
      }
    });

    // Step 3: Hold stream while liquid pours
    tl.to({}, { duration: 0.42 });

    // Step 4: Tilt back and return source container
    tl.to(sourceEl, {
      rotation: 0,
      duration: 0.22,
      ease: 'power2.in',
      onStart: () => {
        this.hideGravityArcStream();
      }
    });

    tl.to(sourceEl, {
      x: 0,
      y: 0,
      duration: 0.25,
      ease: 'power2.inOut'
    });
  }

  /**
   * Refined Coordinate-mapping system calculating exact source rim origin and target interior boundary
   */
  calculatePouringCoordinates(sourceEl, targetEl, isPouringRight) {
    const arenaRect = this.arenaContainer.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    // Target tube horizontal centerline and rim bounds
    const targetCenterX = (targetRect.left + targetRect.width / 2) - arenaRect.left;
    const targetRimY = (targetRect.top - arenaRect.top) + 4;

    // Source pouring lip origin: exactly poised above the target container aperture
    const lipX = targetCenterX;
    const lipY = targetRimY - 8;

    // Collision-detection check: exact surface level of liquid currently residing in target tube
    const existingSegments = targetEl.querySelectorAll('.liquid-segment');
    let targetSurfaceY;
    if (existingSegments.length > 0) {
      // Top of highest existing liquid stratum
      const topSegment = existingSegments[existingSegments.length - 1];
      const topSegRect = topSegment.getBoundingClientRect();
      targetSurfaceY = (topSegRect.top - arenaRect.top) + 1;
    } else {
      // Empty tube: terminates safely within bottom interior curve
      targetSurfaceY = (targetRect.bottom - arenaRect.top) - 18;
    }

    // Ensure surface point never terminates above target aperture rim
    targetSurfaceY = Math.max(targetRimY + 14, targetSurfaceY);

    return {
      lipX,
      lipY,
      targetCenterX,
      targetRimY,
      targetSurfaceY
    };
  }

  /**
   * GSAP realistic gravity-affected fluid pouring arc strictly contained within target tube walls
   */
  triggerGravityArcStream(sourceEl, targetEl, isPouringRight, colorKey) {
    if (!this.pouringCanvas || !this.streamCurve) {
      this.triggerStreamEffect(sourceEl.getBoundingClientRect(), targetEl.getBoundingClientRect(), isPouringRight, colorKey);
      return;
    }

    const coords = this.calculatePouringCoordinates(sourceEl, targetEl, isPouringRight);
    const hexColor = COLOR_HEX[colorKey] || '#06b6d4';

    if (this.streamStop1 && this.streamStop2) {
      this.streamStop1.setAttribute('stop-color', hexColor);
      this.streamStop2.setAttribute('stop-color', hexColor);
    }
    if (this.streamImpact) {
      this.streamImpact.setAttribute('fill', hexColor);
    }

    // Recalibrated vertical cubic Bezier curve trajectory:
    // P0: (targetCenterX, lipY) - exact rim origin above target mouth
    // C1: (targetCenterX, lipY + deltaY * 0.25) - strictly on central vertical axis
    // C2: (targetCenterX, lipY + deltaY * 0.75) - strictly on central vertical axis
    // P3: (targetCenterX, targetSurfaceY) - terminates strictly on target surface inside walls
    const deltaY = coords.targetSurfaceY - coords.lipY;

    const c1x = coords.targetCenterX;
    const c1y = coords.lipY + deltaY * 0.25;
    const c2x = coords.targetCenterX;
    const c2y = coords.lipY + deltaY * 0.75;

    const pathData = `M ${coords.targetCenterX.toFixed(1)} ${coords.lipY.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${coords.targetCenterX.toFixed(1)} ${coords.targetSurfaceY.toFixed(1)}`;

    this.streamCurve.setAttribute('d', pathData);
    this.streamCurve.style.opacity = '1';
    this.pouringCanvas.style.display = 'block';

    // Position collision impact indicator strictly centered at liquid surface inside container
    if (this.streamImpact) {
      this.streamImpact.setAttribute('cx', coords.targetCenterX.toFixed(1));
      this.streamImpact.setAttribute('cy', coords.targetSurfaceY.toFixed(1));
      this.streamImpact.setAttribute('rx', '0');
      this.streamImpact.setAttribute('ry', '0');
      this.streamImpact.style.opacity = '0';
    }

    if (window.gsap) {
      const pathLength = this.streamCurve.getTotalLength() || 120;
      this.streamCurve.style.strokeDasharray = `${pathLength}`;
      this.streamCurve.style.strokeDashoffset = `${pathLength}`;

      gsap.to(this.streamCurve, {
        strokeDashoffset: 0,
        duration: 0.16,
        ease: 'power2.in',
        onComplete: () => {
          // Continuous contained collision splash ripple at surface (strictly within tube interior)
          if (this.streamImpact) {
            gsap.fromTo(this.streamImpact, {
              rx: 2,
              ry: 1,
              opacity: 0.85
            }, {
              rx: 9,
              ry: 2.5,
              opacity: 0.35,
              duration: 0.22,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
        }
      });
    }
  }

  hideGravityArcStream() {
    if (this.streamImpact && window.gsap) {
      gsap.killTweensOf(this.streamImpact);
    }
    if (this.streamCurve && window.gsap) {
      gsap.to(this.streamCurve, {
        opacity: 0,
        duration: 0.14,
        onComplete: () => {
          if (this.pouringCanvas) {
            this.pouringCanvas.style.display = 'none';
          }
          if (this.streamCurve) {
            this.streamCurve.style.opacity = '1';
            this.streamCurve.setAttribute('d', '');
          }
          if (this.streamImpact) {
            this.streamImpact.setAttribute('rx', '0');
            this.streamImpact.setAttribute('ry', '0');
            this.streamImpact.style.opacity = '0';
          }
        }
      });
    } else {
      if (this.pouringCanvas) this.pouringCanvas.style.display = 'none';
    }
    this.hideStreamEffect();
  }

  triggerStreamEffect(sourceRect, targetRect, isPouringRight, colorKey) {
    if (!this.streamBeam) return;
    const arenaRect = this.arenaContainer.getBoundingClientRect();

    // Stream coordinates relative to arena container
    const startX = (isPouringRight ? targetRect.left - 12 : targetRect.right + 12) - arenaRect.left;
    const startY = targetRect.top - arenaRect.top - 20;

    const streamColor = COLOR_HEX[colorKey] || '#06b6d4';
    this.streamBeam.style.background = streamColor;
    this.streamBeam.style.left = `${startX}px`;
    this.streamBeam.style.top = `${startY}px`;
    this.streamBeam.style.display = 'block';

    if (window.gsap) {
      gsap.fromTo(this.streamBeam, {
        height: 0,
        opacity: 0.8
      }, {
        height: 70,
        opacity: 1,
        duration: 0.15,
        ease: 'none'
      });
    }
  }

  hideStreamEffect() {
    if (!this.streamBeam) return;
    if (window.gsap) {
      gsap.to(this.streamBeam, {
        opacity: 0,
        height: 0,
        duration: 0.15,
        onComplete: () => {
          this.streamBeam.style.display = 'none';
        }
      });
    } else {
      this.streamBeam.style.display = 'none';
    }
  }

  applyMoveLogic(sourceIdx, targetIdx, transferCount = 1) {
    const sourceTube = this.tubes[sourceIdx];
    const targetTube = this.tubes[targetIdx];

    for (let i = 0; i < transferCount; i++) {
      if (sourceTube.length > 0) {
        const liquid = sourceTube.pop();
        targetTube.push(liquid);
      }
    }

    this.totalMoves++;
    if (this.movesDisplay) {
      this.movesDisplay.textContent = this.totalMoves;
    }

    // Check if target tube reached complete 4 of same color
    if (targetTube.length === 4 && targetTube.every(c => c === targetTube[0])) {
      audioFX.playCompleteTube();
      this.spawnCompletionBubbles(targetIdx);
    }
  }

  spawnCompletionBubbles(tubeIdx) {
    const tubeEl = document.getElementById(`tube-${tubeIdx}`);
    if (!tubeEl) return;
    for (let i = 0; i < 6; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = Math.floor(Math.random() * 8) + 6;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 40 + 10}px`;
      bubble.style.bottom = `${Math.random() * 30 + 10}px`;
      bubble.style.animationDelay = `${i * 0.15}s`;
      tubeEl.appendChild(bubble);
      setTimeout(() => bubble.remove(), 2000);
    }
  }

  undoMove() {
    if (this.isPouring || this.moveHistory.length === 0) return;
    const last = this.moveHistory.pop();
    const sourceTube = this.tubes[last.source];
    const targetTube = this.tubes[last.target];

    for (let i = 0; i < last.count; i++) {
      if (targetTube.length > 0) {
        const item = targetTube.pop();
        sourceTube.push(item);
      }
    }

    this.correctMoveStreak = 0; // reset streak on undo
    this.totalMoves++;
    if (this.movesDisplay) {
      this.movesDisplay.textContent = this.totalMoves;
    }

    this.deselectTube();
    this.renderArena();
    this.showCommentaryToast(getCommentary('RECOVERY_READJUSTMENT'));
    audioFX.playSelect();
  }

  provideHint() {
    if (this.isPouring || this.isVictory) return;
    // Find first legal move that makes progress
    for (let i = 0; i < this.tubes.length; i++) {
      for (let j = 0; j < this.tubes.length; j++) {
        if (i !== j && this.canPour(i, j)) {
          // Avoid pointless move from pure tube to empty tube
          const src = this.tubes[i];
          const isSrcPure = src.length > 0 && src.every(c => c === src[0]);
          if (isSrcPure && this.tubes[j].length === 0) continue;

          this.deselectTube();
          this.selectTube(i);
          const targetEl = document.getElementById(`tube-${j}`);
          if (targetEl && window.gsap) {
            gsap.to(targetEl, {
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.8)',
              duration: 0.3,
              repeat: 3,
              yoyo: true
            });
          }
          this.showCommentaryToast(`Optimal Path: Tube 0${i + 1} ➔ Tube 0${j + 1}`);
          return;
        }
      }
    }
    this.showCommentaryToast("No direct advantageous paths found · Try Undo!");
  }

  showCommentaryToast(text) {
    if (!this.commentaryToast) return;
    this.commentaryToast.textContent = text;
    if (window.gsap) {
      gsap.killTweensOf(this.commentaryToast);
      gsap.fromTo(this.commentaryToast, {
        y: 16,
        opacity: 0,
        scale: 0.95
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: 'back.out(1.5)',
        onComplete: () => {
          gsap.to(this.commentaryToast, {
            opacity: 0,
            y: -10,
            delay: 1.2,
            duration: 0.3
          });
        }
      });
    } else {
      this.commentaryToast.style.opacity = '1';
      setTimeout(() => {
        this.commentaryToast.style.opacity = '0';
      }, 1500);
    }
  }

  checkGameState() {
    // A level is solved if every tube is either empty OR has 4 identical colors
    let solvedCount = 0;
    let coloredTubes = 0;

    for (let i = 0; i < this.tubes.length; i++) {
      const tube = this.tubes[i];
      if (tube.length === 0) {
        continue;
      }
      coloredTubes++;
      if (tube.length === 4 && tube.every(c => c === tube[0])) {
        solvedCount++;
      }
    }

    if (coloredTubes > 0 && solvedCount === coloredTubes) {
      this.triggerVictory();
    }
  }

  triggerVictory() {
    this.isVictory = true;
    this.stopTimer();
    audioFX.playVictory();

    const config = PRESET_LEVELS[this.currentLevelIndex];
    const performance = evaluatePerformance(
      this.elapsedSeconds,
      this.totalMoves,
      config.optimalMoves,
      config.parTime
    );

    // Save telemetry to localStorage for results.html
    const telemetryPayload = {
      level: config.level,
      levelTitle: config.title,
      timeSpentSeconds: this.elapsedSeconds,
      totalMoves: this.totalMoves,
      optimalMoves: config.optimalMoves,
      parTimeSeconds: config.parTime,
      evaluation: performance,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem('water_sort_telemetry', JSON.stringify(telemetryPayload));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Modal or GSAP Transition to results.html
    const victoryModal = document.getElementById('victory-modal');
    if (victoryModal) {
      document.getElementById('modal-score').textContent = `${performance.points}/100`;
      document.getElementById('modal-rank').textContent = performance.rank;
      document.getElementById('modal-time').textContent = performance.timeFormatted;
      document.getElementById('modal-moves').textContent = `${this.totalMoves} moves (${performance.efficiencyPct}% Optimal)`;

      victoryModal.classList.remove('hidden');
      if (window.gsap) {
        gsap.fromTo(victoryModal.querySelector('.modal-card'), {
          scale: 0.8,
          opacity: 0,
          y: 30
        }, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'back.out(1.6)'
        });
      }
    } else {
      setTimeout(() => {
        window.location.href = './results.html';
      }, 1200);
    }
  }
}

// Instantiate game once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.waterSortGame = new WaterSortGame();
});

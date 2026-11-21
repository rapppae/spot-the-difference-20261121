// game.js — the state machine of Twin Tides: menu, playing, level clear,
// level failed, and the final tally. It owns the timer, the score, the
// combo, the hearts and the hints, and it paints both panels every frame.

import { SCENES } from './scenes.js';
import { renderPanel, drawPopup, vignette, PANEL_W, PANEL_H } from './render.js';
import { SoundEngine } from './audio.js';

const $ = (id) => document.getElementById(id);

export class Game {
  constructor() {
    this.sound = new SoundEngine();
    this.left = $('left');
    this.right = $('right');
    this.lctx = this.left.getContext('2d');
    this.rctx = this.right.getContext('2d');
    this.state = 'menu'; // menu | playing | levelDone | levelFailed | gameDone
    this.levelIndex = 0;
    this.score = 0;
    this.stars = [];
    this.found = new Set();
    this.hintsLeft = 3;
    this.hearts = 3;
    this.combo = 0;
    this.lastFindAt = -10000; // so the first find of a level starts no combo
    this.hintId = null;
    this.hintUntil = 0;
    this.wrongs = [];
    this.popups = [];
    this.timeLeft = 0;
    this.lastTickSecond = -1;
    this.raf = 0;
    this.endedAt = 0;
    this.bindInput();
    this.buildMenu();
    this.showMenu();
  }

  get scene() {
    return SCENES[this.levelIndex];
  }

  // ---- screens ----------------------------------------------------------

  showMenu() {
    this.state = 'menu';
    $('screen-menu').hidden = false;
    $('screen-play').hidden = true;
    $('screen-end').hidden = true;
    this.paintMenuScene();
  }

  // The menu shows the first scene as a quiet backdrop, both panels alike.
  paintMenuScene() {
    const t = performance.now() / 1000;
    renderPanel(this.lctx, SCENES[0], 0, new Set(), null, t, []);
    renderPanel(this.rctx, SCENES[0], 1, new Set(), null, t, []);
    vignette(this.lctx);
    vignette(this.rctx);
  }

  startLevel(index, preFound) {
    this.levelIndex = index;
    this.found = new Set(preFound || []);
    this.hintsLeft = 3;
    this.hearts = 3;
    this.combo = 0;
    this.hintId = null;
    this.wrongs = [];
    this.popups = [];
    this.timeLeft = this.scene.timeLimit;
    this.lastTickSecond = -1;
    this.state = 'playing';
    $('screen-menu').hidden = true;
    $('screen-end').hidden = true;
    $('screen-play').hidden = false;
    $('level-name').textContent = `Level ${index + 1} — ${this.scene.name}`;
    $('level-sub').textContent = this.scene.subtitle;
    this.updateHud();
    this.loop();
  }

  endLevel(won) {
    this.state = won ? 'levelDone' : 'levelFailed';
    cancelAnimationFrame(this.raf);
    this.endedAt = performance.now();
    const bonus = won ? Math.ceil(this.timeLeft) * 10 : 0;
    if (won) {
      this.score += bonus;
      const stars = this.hearts === 3 && this.timeLeft > this.scene.timeLimit * 0.25 ? 3 : this.hearts >= 2 ? 2 : 1;
      this.stars[this.levelIndex] = stars;
      this.sound.playWin();
    }
    $('screen-play').hidden = true;
    $('screen-end').hidden = false;
    $('end-title').textContent = won ? 'Level Clear!' : this.hearts <= 0 ? 'Out of Hearts' : "Time's Up!";
    $('end-sub').textContent = won
      ? `${this.scene.name} — all ${this.scene.differences.length} differences found. Time bonus +${bonus}.`
      : `${this.scene.differences.length - this.found.size} difference${this.scene.differences.length - this.found.size === 1 ? '' : 's'} still hiding in ${this.scene.name}.`;
    $('end-stars').textContent = won ? '★'.repeat(this.stars[this.levelIndex]) + '☆'.repeat(3 - this.stars[this.levelIndex]) : '—';
    $('end-score').textContent = `Score: ${this.score}`;
    $('btn-next').hidden = !won || this.levelIndex >= SCENES.length - 1;
    $('btn-again').hidden = won && this.levelIndex < SCENES.length - 1;
    $('btn-again').textContent = won ? 'Play Again' : 'Replay Level';
    $('btn-next').textContent = this.levelIndex >= SCENES.length - 1 ? 'See Final Score' : 'Next Level →';
    this.updateHud();
  }

  finishGame() {
    this.state = 'gameDone';
    const totalStars = this.stars.reduce((a, b) => a + (b || 0), 0);
    $('screen-play').hidden = true;
    $('screen-end').hidden = false;
    $('end-title').textContent = 'You Found Them All!';
    $('end-sub').textContent = `All four scenes of Twin Tides, every difference found.`;
    $('end-stars').textContent = '★'.repeat(totalStars) + '☆'.repeat(12 - totalStars);
    $('end-score').textContent = `Final score: ${this.score}`;
    $('btn-next').hidden = true;
    $('btn-again').hidden = false;
    $('btn-again').textContent = 'Play Again';
  }

  // ---- input ------------------------------------------------------------

  bindInput() {
    for (const canvas of [this.left, this.right]) {
      canvas.addEventListener('click', (e) => this.onPanelClick(canvas, e));
    }
    $('btn-hint').addEventListener('click', () => this.useHint());
    $('btn-restart').addEventListener('click', () => { this.sound.playClick(); this.startLevel(this.levelIndex); });
    $('btn-menu').addEventListener('click', () => { this.sound.playClick(); this.showMenu(); });
    $('btn-sound').addEventListener('click', () => {
      const muted = this.sound.toggleMute();
      $('btn-sound').textContent = muted ? 'Sound: Off (M)' : 'Sound: On (M)';
    });
    $('btn-next').addEventListener('click', () => {
      this.sound.playClick();
      if (this.levelIndex >= SCENES.length - 1) this.finishGame();
      else this.startLevel(this.levelIndex + 1);
    });
    $('btn-retry').addEventListener('click', () => { this.sound.playClick(); this.startLevel(this.levelIndex); });
    $('btn-again').addEventListener('click', () => {
      this.sound.playClick();
      this.score = 0;
      this.stars = [];
      this.startLevel(0);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'h' || e.key === 'H') this.useHint();
      else if (e.key === 'r' || e.key === 'R') { if (this.state === 'playing') this.startLevel(this.levelIndex); }
      else if (e.key === 'm' || e.key === 'M') $('btn-sound').click();
      else if (e.key === 'Escape') { if (this.state !== 'menu') this.showMenu(); }
      else if (e.key === 'Enter') {
        if (this.state === 'menu') this.startLevel(0);
        else if (this.state === 'levelDone' && !$('btn-next').hidden) $('btn-next').click();
        else if (this.state === 'levelFailed') $('btn-retry').click();
      } else if (this.state === 'menu' && ['1', '2', '3', '4'].includes(e.key)) {
        this.startLevel(Number(e.key) - 1);
      }
    });
  }

  buildMenu() {
    const wrap = $('menu-levels');
    wrap.innerHTML = '';
    SCENES.forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'level-pick';
      b.innerHTML = `<b>${i + 1}. ${s.name}</b><span>${s.differences.length} differences · ${s.timeLimit}s</span>`;
      b.addEventListener('click', () => { this.sound.ensure(); this.sound.playClick(); this.startLevel(i); });
      wrap.appendChild(b);
    });
    $('menu-start').addEventListener('click', () => { this.sound.ensure(); this.sound.playClick(); this.startLevel(0); });
  }

  onPanelClick(canvas, e) {
    if (this.state !== 'playing') return;
    this.sound.ensure();
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * PANEL_W;
    const y = ((e.clientY - rect.top) / rect.height) * PANEL_H;
    const hit = this.scene.differences.find((d) => !this.found.has(d.id) && Math.hypot(d.x - x, d.y - y) <= d.r + 6);
    if (hit) {
      this.found.add(hit.id);
      const now = performance.now();
      this.combo = now - this.lastFindAt < 6000 ? this.combo + 1 : 0;
      this.lastFindAt = now;
      const gained = 100 + this.combo * 25;
      this.score += gained;
      this.sound.playFind(this.combo);
      this.popups.push({ x, y, at: now, text: `+${gained}`, color: '#ffd94d' });
      this.showToast(hit.blurb);
      this.updateHud();
      if (this.found.size === this.scene.differences.length) this.endLevel(true);
    } else {
      this.hearts -= 1;
      this.combo = 0;
      this.sound.playWrong();
      this.wrongs.push({ x, y, at: performance.now() });
      this.showToast('Nothing there — one heart lost.');
      this.updateHud();
      if (this.hearts <= 0) this.endLevel(false);
    }
  }

  useHint() {
    if (this.state !== 'playing' || this.hintsLeft <= 0) return;
    const rest = this.scene.differences.filter((d) => !this.found.has(d.id));
    if (!rest.length) return;
    this.hintsLeft -= 1;
    this.hintId = rest[Math.floor(Math.random() * rest.length)].id;
    this.hintUntil = performance.now() + 2200;
    this.sound.playHint();
    this.showToast('Hint: look inside the blue ring…');
    this.updateHud();
  }

  // ---- HUD + loop ---------------------------------------------------------

  showToast(text) {
    const el = $('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  updateHud() {
    const left = this.scene.differences.length - this.found.size;
    $('hud-level').textContent = `Level ${this.levelIndex + 1}/4 · ${this.scene.name}`;
    $('hud-left').textContent = `${left} left`;
    $('hud-score').textContent = `Score ${this.score}`;
    $('hud-hearts').textContent = '♥'.repeat(Math.max(this.hearts, 0)) + '♡'.repeat(Math.max(3 - this.hearts, 0));
    $('hud-hints').textContent = `Hints ${this.hintsLeft}`;
    $('btn-hint').disabled = this.hintsLeft <= 0 || this.state !== 'playing';
  }

  loop() {
    cancelAnimationFrame(this.raf);
    let last = performance.now();
    const step = (now) => {
      if (this.state !== 'playing') return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      this.timeLeft -= dt;
      const sec = Math.ceil(this.timeLeft);
      if (sec <= 10 && sec !== this.lastTickSecond && sec > 0) {
        this.lastTickSecond = sec;
        this.sound.playTick();
      }
      const t = now / 1000;
      if (this.hintId && now > this.hintUntil) this.hintId = null;
      const fill = $('timer-fill');
      const pct = Math.max(0, (this.timeLeft / this.scene.timeLimit) * 100);
      fill.style.width = `${pct}%`;
      fill.classList.toggle('low', this.timeLeft <= 10);
      $('timer-text').textContent = `${Math.max(0, sec)}s`;
      renderPanel(this.lctx, this.scene, 0, this.found, this.hintId, t, this.wrongs);
      renderPanel(this.rctx, this.scene, 1, this.found, this.hintId, t, this.wrongs);
      this.popups = this.popups.filter((p) => {
        const a = drawPopup(this.lctx, p, t);
        const b = drawPopup(this.rctx, p, t);
        return a || b;
      });
      this.wrongs = this.wrongs.filter((w) => now - w.at < 700);
      if (this.timeLeft <= 0) {
        this.endLevel(false);
        return;
      }
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }
}

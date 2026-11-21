// audio.js — every sound in Twin Tides is synthesized with WebAudio.
// No audio files are loaded, so the game stays fully offline.

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return true;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, at, dur, type, vol, slideTo) {
    if (this.muted || !this.ensure()) return;
    const t0 = this.ctx.currentTime + at;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // A bright two-note pop when a difference is found.
  playFind(combo) {
    const base = 660 + Math.min(combo, 5) * 40;
    this.tone(base, 0, 0.12, 'sine', 0.14);
    this.tone(base * 1.5, 0.07, 0.18, 'sine', 0.14);
  }

  // A low buzz for a wrong click.
  playWrong() {
    this.tone(160, 0, 0.22, 'sawtooth', 0.08, 110);
  }

  // A soft shimmer for a hint.
  playHint() {
    this.tone(880, 0, 0.3, 'sine', 0.07);
    this.tone(1174, 0.1, 0.3, 'sine', 0.06);
  }

  // A rising arpeggio when a level is cleared.
  playWin() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, i * 0.09, 0.22, 'triangle', 0.12));
  }

  // A short tick when the timer drops under ten seconds.
  playTick() {
    this.tone(1200, 0, 0.05, 'square', 0.04);
  }

  // A gentle click for buttons and the menu.
  playClick() {
    this.tone(440, 0, 0.06, 'sine', 0.08);
  }
}

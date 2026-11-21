// render.js — paints one panel of a scene: the picture, the markers on the
// differences already found, the pulsing hint ring, and wrong-click crosses.
// Panels are re-painted every animation frame so the pulses stay alive.

import { circle } from './draw-helpers.js';

export const PANEL_W = 560;
export const PANEL_H = 420;

// Draw one panel. found is a Set of difference ids already found on this
// scene; hintId is the id currently hinted (or null); t is seconds.
export function renderPanel(ctx, scene, variant, found, hintId, t, wrongs) {
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  scene.draw(ctx, variant);

  // Markers on the differences found: a warm ring on both panels.
  for (const d of scene.differences) {
    if (!found.has(d.id)) continue;
    const pulse = 1 + 0.05 * Math.sin(t * 3 + d.x);
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r * pulse + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,217,77,0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();
    // small check tick at the ring's edge
    ctx.beginPath();
    ctx.moveTo(d.x + d.r * 0.55, d.y - d.r * 0.95);
    ctx.lineTo(d.x + d.r * 0.8, d.y - d.r * 0.7);
    ctx.lineTo(d.x + d.r * 1.15, d.y - d.r * 1.15);
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // Hint: a soft pulsing ring around one difference not found yet.
  if (hintId) {
    const d = scene.differences.find((x) => x.id === hintId);
    if (d && !found.has(d.id)) {
      const a = 0.45 + 0.35 * Math.sin(t * 6);
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r + 8 + 4 * Math.sin(t * 6), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(127,179,232,${a})`;
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Wrong clicks: a fading red cross where the player just missed.
  for (const w of wrongs) {
    const age = (performance.now() - w.at) / 700;
    if (age >= 1) continue;
    const alpha = 1 - age;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#ff5d5d';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    const r = 12;
    ctx.beginPath();
    ctx.moveTo(w.x - r, w.y - r);
    ctx.lineTo(w.x + r, w.y + r);
    ctx.moveTo(w.x + r, w.y - r);
    ctx.lineTo(w.x - r, w.y + r);
    ctx.stroke();
    ctx.restore();
  }
}

// A floating "+100" style popup; the game loop keeps a list of these.
export function drawPopup(ctx, p, t) {
  const age = (performance.now() - p.at) / 900;
  if (age >= 1) return false;
  ctx.save();
  ctx.globalAlpha = 1 - age;
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = p.color || '#ffd94d';
  ctx.strokeStyle = 'rgba(34,36,46,0.8)';
  ctx.lineWidth = 4;
  const y = p.y - age * 34;
  ctx.strokeText(p.text, p.x, y);
  ctx.fillText(p.text, p.x, y);
  ctx.restore();
  return true;
}

export function vignette(ctx) {
  const g = ctx.createRadialGradient(280, 210, 180, 280, 210, 380);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(20,16,40,0.18)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}

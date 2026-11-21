// draw-helpers.js — small canvas helpers shared by every scene.
// All art in Twin Tides is drawn with these primitives; no image files.

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

export function circle(ctx, x, y, r, fill) {
  ellipse(ctx, x, y, r, r, fill);
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function star(ctx, cx, cy, spikes, outer, inner, fill) {
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function cloud(ctx, x, y, s, fill) {
  circle(ctx, x, y, 16 * s, fill);
  circle(ctx, x + 18 * s, y - 6 * s, 20 * s, fill);
  circle(ctx, x + 40 * s, y, 17 * s, fill);
  roundRect(ctx, x - 12 * s, y - 2 * s, 66 * s, 18 * s, 9 * s, fill);
}

export function bird(ctx, x, y, s, color) {
  ctx.beginPath();
  ctx.arc(x - 6 * s, y, 6 * s, Math.PI * 1.15, Math.PI * 1.95);
  ctx.arc(x + 6 * s, y, 6 * s, Math.PI * 1.05, Math.PI * 1.85);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.4 * s;
  ctx.lineCap = 'round';
  ctx.stroke();
}

// A simple five-petal flower.
export function flower(ctx, x, y, s, petal, center) {
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 6 * s, y + Math.sin(a) * 6 * s, 5.5 * s, petal);
  }
  circle(ctx, x, y, 4.5 * s, center);
}

// A sitting cat, drawn facing left. tailUp flips the tail pose.
export function cat(ctx, x, y, s, coat, tailUp) {
  // tail
  ctx.beginPath();
  ctx.moveTo(x + 16 * s, y - 6 * s);
  if (tailUp) ctx.quadraticCurveTo(x + 30 * s, y - 10 * s, x + 28 * s, y - 26 * s);
  else ctx.quadraticCurveTo(x + 30 * s, y - 2 * s, x + 22 * s, y + 8 * s);
  ctx.strokeStyle = coat;
  ctx.lineWidth = 5 * s;
  ctx.lineCap = 'round';
  ctx.stroke();
  // body
  ellipse(ctx, x, y, 17 * s, 14 * s, coat);
  // head
  circle(ctx, x - 14 * s, y - 16 * s, 11 * s, coat);
  // ears
  poly(ctx, [[x - 22 * s, y - 22 * s], [x - 20 * s, y - 32 * s], [x - 13 * s, y - 25 * s]], coat);
  poly(ctx, [[x - 10 * s, y - 25 * s], [x - 7 * s, y - 33 * s], [x - 3 * s, y - 23 * s]], coat);
  // eye
  circle(ctx, x - 17 * s, y - 17 * s, 1.8 * s, '#22242e');
  // whiskers
  line(ctx, x - 22 * s, y - 13 * s, x - 32 * s, y - 15 * s, '#fff8', 1.2 * s);
  line(ctx, x - 22 * s, y - 11 * s, x - 32 * s, y - 9 * s, '#fff8', 1.2 * s);
}

// scenes.js — the four scenes of Twin Tides.
// Each scene draws itself twice: variant 0 is the left picture, variant 1 is
// the right picture with that scene's differences applied. A difference is
// { id, x, y, r, blurb }: its centre and click radius in the 560x420 panel,
// plus one line saying what changed, shown when it is found.

import { ellipse, circle, rect, roundRect, poly, line, star, cloud, bird, flower, cat } from './draw-helpers.js';

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 420);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 560, 420);
}

function sun(ctx, x, y, r, rays, face) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#ffb347';
  ctx.lineWidth = 4;
  for (let i = 0; i < rays; i++) {
    const a = (Math.PI * 2 * i) / rays;
    line(ctx, Math.cos(a) * (r + 4), Math.sin(a) * (r + 4), Math.cos(a) * (r + 16), Math.sin(a) * (r + 16), '#ffb347', 4);
  }
  circle(ctx, 0, 0, r, '#ffd94d');
  if (face === 'shades') {
    roundRect(ctx, -20, -8, 40, 13, 6, '#22242e');
    line(ctx, -20, -2, -26, 2, '#22242e', 3);
    line(ctx, 20, -2, 26, 2, '#22242e', 3);
  } else {
    circle(ctx, -9, -4, 2.5, '#7a4a12');
    circle(ctx, 9, -4, 2.5, '#7a4a12');
    ctx.beginPath();
    ctx.arc(0, 4, 9, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.strokeStyle = '#7a4a12';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
  ctx.restore();
}

function sailboat(ctx, x, y, s, hull, sail, flag) {
  poly(ctx, [[x - 34 * s, y], [x + 34 * s, y], [x + 24 * s, y + 16 * s], [x - 24 * s, y + 16 * s]], hull);
  line(ctx, x, y, x, y - 52 * s, '#6b4a2f', 3 * s);
  poly(ctx, [[x + 2 * s, y - 50 * s], [x + 2 * s, y - 6 * s], [x + 30 * s, y - 6 * s]], sail);
  if (flag) poly(ctx, [[x, y - 52 * s], [x + 18 * s, y - 47 * s], [x, y - 42 * s]], '#e4572e');
}

function lighthouse(ctx, x, y, s, lampOn) {
  rect(ctx, x - 16 * s, y - 96 * s, 32 * s, 96 * s, '#f4ede1');
  rect(ctx, x - 16 * s, y - 74 * s, 32 * s, 12 * s, '#e4572e');
  rect(ctx, x - 16 * s, y - 44 * s, 32 * s, 12 * s, '#e4572e');
  rect(ctx, x - 16 * s, y - 14 * s, 32 * s, 14 * s, '#e4572e');
  rect(ctx, x - 20 * s, y - 112 * s, 40 * s, 18 * s, '#3a3f4d');
  circle(ctx, x, y - 103 * s, 8 * s, lampOn ? '#ffd94d' : '#8b93a5');
  if (lampOn) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    poly(ctx, [[x + 6 * s, y - 103 * s], [x + 120 * s, y - 130 * s], [x + 120 * s, y - 76 * s]], '#ffd94d');
    ctx.restore();
  }
  poly(ctx, [[x - 22 * s, y - 112 * s], [x, y - 128 * s], [x + 22 * s, y - 112 * s]], '#e4572e');
}

function drawHarbor(ctx, v) {
  sky(ctx, '#ffe3b3', '#ff9e7d');
  sun(ctx, 92, 74, 30, 8, v === 1 ? 'shades' : 'smile');
  cloud(ctx, 300, 60, 1, '#fff6e8');
  cloud(ctx, 430, 110, 0.7, '#ffeedd');
  bird(ctx, 250, 84, 1, '#5b4a68');
  bird(ctx, 300, 64, 1, '#5b4a68');
  if (v === 0) bird(ctx, 350, 92, 1, '#5b4a68');
  // distant hills
  poly(ctx, [[0, 210], [120, 150], [260, 210]], '#b98a6e');
  poly(ctx, [[180, 210], [330, 138], [470, 210]], '#a97a5e');
  // sea
  rect(ctx, 0, 210, 560, 210, '#4d8fb5');
  ctx.fillStyle = '#6fb2d4';
  for (let i = 0; i < 5; i++) {
    ellipse(ctx, 60 + i * 110, 240 + (i % 2) * 44, 42, 5, '#6fb2d4');
    ellipse(ctx, 110 + i * 100, 300 + (i % 2) * 38, 36, 5, '#6fb2d4');
  }
  // boats
  sailboat(ctx, 150, 300, 1, '#8a5a3b', '#fff6e8', v === 0);
  sailboat(ctx, 400, 330, 0.7, '#5d6e8c', '#ffd94d', true);
  // buoy
  circle(ctx, 480, 260, 9, '#e4572e');
  rect(ctx, 476, 244, 8, 12, '#e4572e');
  // dock
  rect(ctx, 0, 360, 560, 60, '#7a5a3b');
  for (let x = 0; x < 560; x += 46) line(ctx, x, 362, x, 418, '#5d4028', 2);
  // crates
  roundRect(ctx, 60, 322, 36, 36, 4, '#c98f4e');
  roundRect(ctx, 100, 330, 28, 28, 4, '#b57a3e');
  if (v === 1) roundRect(ctx, 132, 334, 24, 24, 4, '#c98f4e');
  // lighthouse on the dock
  lighthouse(ctx, 500, 360, 0.85, v === 0);
  // rope coil
  circle(ctx, 250, 388, 16, '#d9c9a8');
  circle(ctx, 250, 388, 8, '#7a5a3b');
}

function drawCafe(ctx, v) {
  sky(ctx, '#f7e8d0', '#eecfa8');
  // wall + floor
  rect(ctx, 0, 0, 560, 300, '#f2d7ae');
  rect(ctx, 0, 300, 560, 120, '#b98a5e');
  // window with street
  roundRect(ctx, 40, 40, 200, 170, 10, '#8ecae6');
  roundRect(ctx, 48, 48, 184, 154, 6, '#bde0f5');
  circle(ctx, 190, 84, 22, '#ffd94d');
  poly(ctx, [[60, 202], [120, 150], [180, 202]], '#7a9e7e');
  rect(ctx, 60, 170, 30, 32, '#c96f4a');
  rect(ctx, 150, 160, 44, 42, '#8a6bb5');
  line(ctx, 140, 48, 140, 202, '#8a6b45', 6);
  line(ctx, 48, 125, 232, 125, '#8a6b45', 6);
  // picture frame: fish on the left, bird on the right
  roundRect(ctx, 300, 50, 90, 70, 6, '#fff6e8');
  rect(ctx, 308, 58, 74, 54, '#cfe8d8');
  if (v === 0) {
    ellipse(ctx, 345, 85, 20, 10, '#e4572e');
    poly(ctx, [[365, 85], [378, 76], [378, 94]], '#e4572e');
    circle(ctx, 330, 82, 2.5, '#22242e');
  } else {
    bird(ctx, 345, 88, 1.4, '#3a6ea5');
  }
  // clock
  circle(ctx, 460, 85, 34, '#fff6e8');
  circle(ctx, 460, 85, 34, null);
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 3;
  ctx.stroke();
  if (v === 0) {
    line(ctx, 460, 85, 460, 60, '#22242e', 3);
    line(ctx, 460, 85, 478, 85, '#22242e', 3);
  } else {
    line(ctx, 460, 85, 478, 68, '#22242e', 3);
    line(ctx, 460, 85, 448, 100, '#22242e', 3);
  }
  circle(ctx, 460, 85, 3, '#e4572e');
  // counter
  rect(ctx, 0, 300, 560, 22, '#8a5a3b');
  rect(ctx, 0, 322, 560, 98, '#6b4a2f');
  // cat on the counter, tail up on the left, curled on the right
  cat(ctx, 120, 296, 1, '#e8a54b', v === 0);
  // cups
  roundRect(ctx, 250, 268, 44, 32, 6, '#e4572e');
  roundRect(ctx, 330, 268, 44, 32, 6, '#4d8fb5');
  if (v === 0) {
    line(ctx, 264, 258, 260, 240, '#fff8', 3);
    line(ctx, 276, 258, 280, 238, '#fff8', 3);
  }
  line(ctx, 344, 258, 340, 240, '#fff8', 3);
  line(ctx, 356, 258, 360, 238, '#fff8', 3);
  // plant
  poly(ctx, [[430, 300], [442, 300], [446, 268], [426, 268]], '#c96f4a');
  line(ctx, 436, 268, 436, 232, '#4e7d4a', 4);
  flower(ctx, 436, 222, 1.1, v === 0 ? '#ff8fab' : '#7fb3e8', '#ffd94d');
  // plate of cookies
  ellipse(ctx, 500, 302, 34, 9, '#fff6e8');
  circle(ctx, 488, 296, 9, '#c98f4e');
  circle(ctx, 508, 296, 9, '#c98f4e');
  if (v === 1) circle(ctx, 498, 288, 9, '#c98f4e');
  // hanging lamp
  line(ctx, 280, 0, 280, 40, '#6b4a2f', 3);
  poly(ctx, [[258, 40], [302, 40], [290, 66], [270, 66]], '#ffd94d');
  circle(ctx, 280, 74, 7, '#fff3c4');
}

export const SCENES = [
  {
    id: 'harbor',
    name: 'Harbor Dawn',
    subtitle: 'The fishing boats are leaving as the sun comes up.',
    timeLimit: 90,
    draw: drawHarbor,
    differences: [
      { id: 'bird', x: 350, y: 92, r: 26, blurb: 'A gull vanished from the sky.' },
      { id: 'lamp', x: 500, y: 257, r: 26, blurb: 'The lighthouse lamp went dark.' },
      { id: 'flag', x: 150, y: 252, r: 26, blurb: 'The red flag is gone from the sailboat.' },
      { id: 'crate', x: 144, y: 346, r: 24, blurb: 'An extra crate appeared on the dock.' },
      { id: 'shades', x: 92, y: 74, r: 34, blurb: 'The sun is wearing sunglasses now.' },
    ],
  },
  {
    id: 'cafe',
    name: 'Cat Café',
    subtitle: 'Two cats, two coffees, one quiet morning.',
    timeLimit: 80,
    draw: drawCafe,
    differences: [
      { id: 'tail', x: 148, y: 272, r: 26, blurb: 'The cat curled its tail down.' },
      { id: 'steam', x: 270, y: 248, r: 24, blurb: 'The steam is gone from the red cup.' },
      { id: 'clock', x: 460, y: 85, r: 34, blurb: 'The clock shows a different time.' },
      { id: 'flower', x: 436, y: 222, r: 24, blurb: 'The flower changed colour.' },
      { id: 'picture', x: 345, y: 85, r: 30, blurb: 'The picture swapped a fish for a bird.' },
      { id: 'cookie', x: 498, y: 288, r: 22, blurb: 'A third cookie appeared on the plate.' },
    ],
  },
];

function drawMarket(ctx, v) {
  sky(ctx, '#2b2350', '#4a2d6e');
  // stars
  star(ctx, 60, 50, 4, 5, 2, '#fff3c4');
  star(ctx, 180, 36, 4, 4, 2, '#fff3c4');
  star(ctx, 330, 60, 4, 5, 2, '#fff3c4');
  star(ctx, 500, 44, 4, 4, 2, '#fff3c4');
  // moon
  circle(ctx, 480, 70, 26, '#f4ead2');
  circle(ctx, 472, 64, 5, '#d9c9a8');
  circle(ctx, 488, 78, 4, '#d9c9a8');
  // string lights
  ctx.beginPath();
  ctx.moveTo(0, 90);
  ctx.quadraticCurveTo(280, 150, 560, 90);
  ctx.strokeStyle = '#3a2f55';
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x = 560 * t;
    const y = 90 + Math.sin(t * Math.PI) * 42;
    const lit = !(v === 1 && i === 4);
    circle(ctx, x, y + 8, 7, lit ? '#ffd94d' : '#4a3f66');
    if (lit) circle(ctx, x, y + 8, 11, '#ffd94d33');
  }
  // buildings
  rect(ctx, 0, 150, 130, 270, '#3a2f55');
  rect(ctx, 430, 140, 130, 280, '#332a4d');
  // lanterns
  ellipse(ctx, 60, 200, 16, 22, v === 0 ? '#ff5d5d' : '#5db8ff');
  ellipse(ctx, 60, 200, 16, 22, null);
  ellipse(ctx, 505, 190, 16, 22, '#ffb347');
  line(ctx, 60, 176, 60, 170, '#222', 2);
  line(ctx, 505, 166, 505, 160, '#222', 2);
  // stalls
  // left stall
  poly(ctx, [[40, 250], [230, 250], [210, 290], [60, 290]], v === 0 ? '#e4572e' : '#e4572e');
  if (v === 1) {
    // one awning stripe goes missing: only two light stripes are drawn
    poly(ctx, [[120, 250], [150, 250], [142, 290], [128, 290]], '#f4ead2');
    poly(ctx, [[170, 250], [190, 250], [186, 290], [176, 290]], '#f4ead2');
  } else {
    poly(ctx, [[120, 250], [150, 250], [142, 290], [128, 290]], '#f4ead2');
    poly(ctx, [[80, 250], [100, 250], [96, 290], [84, 290]], '#f4ead2');
    poly(ctx, [[170, 250], [190, 250], [186, 290], [176, 290]], '#f4ead2');
  }
  rect(ctx, 60, 290, 150, 10, '#6b4a2f');
  rect(ctx, 60, 300, 150, 80, '#8a5a3b');
  // fruit on the left stall
  circle(ctx, 100, 282, 10, '#e4572e');
  circle(ctx, 122, 282, 10, '#e4572e');
  circle(ctx, 111, 268, 10, v === 0 ? '#e4572e' : '#ff8c42');
  circle(ctx, 160, 282, 10, '#ffd94d');
  circle(ctx, 182, 282, 10, '#ffd94d');
  // right stall
  poly(ctx, [[330, 250], [520, 250], [500, 290], [350, 290]], '#4d8fb5');
  poly(ctx, [[380, 250], [410, 250], [402, 290], [388, 290]], '#f4ead2');
  poly(ctx, [[450, 250], [480, 250], [474, 290], [460, 290]], '#f4ead2');
  rect(ctx, 350, 290, 150, 10, '#6b4a2f');
  rect(ctx, 350, 300, 150, 80, '#5d6e8c');
  // jars on the right stall
  roundRect(ctx, 380, 262, 26, 28, 5, '#ffd94d');
  roundRect(ctx, 414, 262, 26, 28, 5, '#ff8fab');
  roundRect(ctx, 448, 262, 26, 28, 5, '#7fb3e8');
  // cat on the right roof
  if (v === 0) cat(ctx, 480, 240, 0.8, '#3a3f4d', true);
  // sign
  roundRect(ctx, 250, 180, 80, 44, 8, '#f4ead2');
  ctx.fillStyle = '#2b2350';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(v === 0 ? 'TEA' : 'TEA!', 290, 203);
  // cobblestones (drawn before the shopping bag, so the bag sits on top)
  rect(ctx, 0, 380, 560, 40, '#4a3f66');
  for (let x = 10; x < 560; x += 44) ellipse(ctx, x, 400, 18, 5, '#5d4f7d');
  // shopping bag on the ground
  if (v === 1) {
    poly(ctx, [[250, 380], [286, 380], [280, 414], [256, 414]], '#ff8fab');
    ctx.beginPath();
    ctx.arc(268, 380, 9, Math.PI, 0);
    ctx.strokeStyle = '#c96f4a';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function drawGarden(ctx, v) {
  sky(ctx, '#1d2b4d', '#3d5a80');
  // stars
  for (const [x, y, r] of [[50, 50, 4], [140, 90, 3], [230, 40, 5], [330, 80, 3], [420, 44, 4], [510, 100, 3], [90, 130, 3], [290, 120, 3]]) {
    star(ctx, x, y, 4, r + 2, r * 0.5, '#fff3c4');
  }
  // moon: full on the left, crescent on the right
  circle(ctx, 470, 70, 30, '#f4ead2');
  if (v === 0) {
    circle(ctx, 462, 64, 5, '#d9c9a8');
    circle(ctx, 478, 78, 4, '#d9c9a8');
  } else {
    circle(ctx, 482, 66, 26, '#3d5a80');
  }
  // fireflies: 5 on the left, 3 on the right
  const flies = [[90, 180], [160, 150], [240, 200], [330, 160], [410, 190]];
  flies.forEach(([x, y], i) => {
    if (v === 1 && i >= 3) return;
    circle(ctx, x, y, 3.5, '#d8f79a');
    circle(ctx, x, y, 8, '#d8f79a44');
  });
  // hills
  ellipse(ctx, 280, 470, 340, 110, '#2d4a2f');
  ellipse(ctx, 80, 480, 200, 90, '#274026');
  // pond
  ellipse(ctx, 280, 330, 190, 62, '#5d8fb5');
  ellipse(ctx, 280, 330, 190, 62, null);
  if (v === 0) {
    ellipse(ctx, 220, 330, 40, 6, '#8ecae6');
    ellipse(ctx, 330, 345, 34, 5, '#8ecae6');
  }
  // lily pads + frog
  ellipse(ctx, 200, 330, 34, 12, '#4e7d4a');
  ellipse(ctx, 350, 320, 30, 11, '#4e7d4a');
  if (v === 0) {
    circle(ctx, 350, 306, 14, '#7bc47f');
    circle(ctx, 342, 294, 5, '#7bc47f');
    circle(ctx, 358, 294, 5, '#7bc47f');
    circle(ctx, 342, 294, 2, '#22242e');
    circle(ctx, 358, 294, 2, '#22242e');
  }
  // flowers
  flower(ctx, 80, 380, 1.1, v === 0 ? '#ff8fab' : '#7fb3e8', '#ffd94d');
  flower(ctx, 140, 395, 1, '#ffd94d', '#e4572e');
  flower(ctx, 470, 385, 1.1, '#ff8fab', '#ffd94d');
  flower(ctx, 520, 400, 0.9, '#c9a7eb', '#ffd94d');
  line(ctx, 80, 388, 80, 408, '#4e7d4a', 3);
  line(ctx, 140, 402, 140, 416, '#4e7d4a', 3);
  line(ctx, 470, 393, 470, 410, '#4e7d4a', 3);
  // mushrooms
  ellipse(ctx, 420, 400, 4, 10, '#f4ead2');
  poly(ctx, [[400, 402], [440, 402], [420, 378]], '#e4572e');
  circle(ctx, 412, 390, 3, '#fff6e8');
  circle(ctx, 426, 394, 3, '#fff6e8');
  if (v === 0) circle(ctx, 420, 386, 3, '#fff6e8');
  // butterfly: present on the left only
  if (v === 0) {
    ellipse(ctx, 300, 240, 10, 7, '#ff8fab');
    ellipse(ctx, 316, 240, 10, 7, '#ff8fab');
    line(ctx, 308, 234, 308, 248, '#22242e', 2);
  }
  // fence: one post missing on the right
  for (let x = 30; x <= 530; x += 50) {
    if (v === 1 && x === 280) continue;
    rect(ctx, x - 3, 396, 6, 24, '#8a6b45');
  }
  line(ctx, 20, 402, 540, 402, '#8a6b45', 4);
  line(ctx, 20, 414, 540, 414, '#8a6b45', 4);
}

SCENES.push(
  {
    id: 'market',
    name: 'Night Market',
    subtitle: 'Lanterns, tea and one very sleepy cat.',
    timeLimit: 70,
    draw: drawMarket,
    differences: [
      { id: 'lantern', x: 60, y: 200, r: 26, blurb: 'The lantern changed colour.' },
      { id: 'bulb', x: 280, y: 140, r: 22, blurb: 'A string-light bulb went out.' },
      { id: 'awning', x: 90, y: 270, r: 26, blurb: 'A stripe vanished from the awning.' },
      { id: 'fruit', x: 111, y: 268, r: 22, blurb: 'An apple turned into an orange.' },
      { id: 'cat', x: 480, y: 228, r: 26, blurb: 'The cat left the roof.' },
      { id: 'sign', x: 290, y: 202, r: 30, blurb: 'The tea sign gained an exclamation mark.' },
      { id: 'bag', x: 268, y: 397, r: 26, blurb: 'A shopping bag appeared on the ground.' },
    ],
  },
  {
    id: 'garden',
    name: 'Starlight Garden',
    subtitle: 'Fireflies, frogs and one shy butterfly.',
    timeLimit: 60,
    draw: drawGarden,
    differences: [
      { id: 'moon', x: 470, y: 70, r: 32, blurb: 'The moon turned into a crescent.' },
      { id: 'firefly', x: 330, y: 160, r: 22, blurb: 'Two fireflies flew away.' },
      { id: 'frog', x: 350, y: 302, r: 26, blurb: 'The frog hopped off its lily pad.' },
      { id: 'flower', x: 80, y: 380, r: 24, blurb: 'The pink flower turned blue.' },
      { id: 'ripple', x: 220, y: 330, r: 30, blurb: 'The pond ripples disappeared.' },
      { id: 'mushroom', x: 420, y: 388, r: 24, blurb: 'A spot vanished from the mushroom.' },
      { id: 'butterfly', x: 308, y: 240, r: 26, blurb: 'The butterfly fluttered away.' },
      { id: 'fence', x: 280, y: 408, r: 22, blurb: 'A fence post went missing.' },
    ],
  },
);

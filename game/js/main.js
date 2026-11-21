// main.js — boots Twin Tides and stages screenshot scenes.
// ?shot=menu paints the title screen.
// ?shot=play&level=N&found=id1,id2 opens level N with those differences
// already found, so a screenshot shows markers on found differences, several
// still unfound, and the counter of how many remain.
// ?shot=hint&level=N opens level N with a hint ring active.
// ?shot=win&level=N shows that level's clear screen.
// Every staged scene is a real state of the game, painted by its own code;
// when the paint is done, window.__shotReady is set for the screenshot.

import { Game } from './game.js';
import { SCENES } from './scenes.js';
import { renderPanel } from './render.js';

const game = new Game();
window.__game = game; // play-testing hook: the CDP driver reads state through it.
const params = new URLSearchParams(location.search);
const shot = params.get('shot');

function paintStaged(level) {
  const t = performance.now() / 1000;
  const scene = SCENES[level];
  renderPanel(game.lctx, scene, 0, game.found, game.hintId, t, []);
  renderPanel(game.rctx, scene, 1, game.found, game.hintId, t, []);
  window.__shotReady = true;
}

if (shot) {
  const level = Math.min(Math.max(Number(params.get('level') || 1) - 1, 0), SCENES.length - 1);
  const found = (params.get('found') || '').split(',').filter(Boolean);
  if (shot === 'menu') {
    game.showMenu();
    setTimeout(() => { window.__shotReady = true; }, 300);
  } else if (shot === 'play' || shot === 'hint') {
    game.startLevel(level, found);
    if (shot === 'hint') {
      const rest = SCENES[level].differences.filter((d) => !found.includes(d.id));
      if (rest.length) {
        game.hintId = rest[0].id;
        game.hintUntil = performance.now() + 60000;
      }
    }
    // Freeze the timer for the screenshot: a staged shot keeps its time.
    game.timeLeft = Math.round(SCENES[level].timeLimit * 0.62);
    document.getElementById('timer-text').textContent = `${game.timeLeft}s`;
    document.getElementById('timer-fill').style.width = '62%';
    setTimeout(() => {
      cancelAnimationFrame(game.raf);
      game.state = 'staged';
      paintStaged(level);
    }, 400);
  } else if (shot === 'win') {
    game.score = 1240;
    game.startLevel(level, SCENES[level].differences.map((d) => d.id));
    setTimeout(() => {
      game.endLevel(true);
      window.__shotReady = true;
    }, 400);
  }
}

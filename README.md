# Twin Tides — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rapppae/spot-the-difference-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rapppae/spot-the-difference-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game for the [make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451). Two pictures sit side by side — they look the same, but a few small things changed. Find them all before the timer runs out.

## How to play

Open `game/index.html` in a desktop browser (or serve `game/` with `node serve.ts` and open http://localhost:8080). No network request, no build step.

- **Click** a difference on either picture to circle it. Wrong clicks cost a heart — three hearts and the level ends.
- **Finds in a row** build a combo worth extra points; clearing a level banks a time bonus.
- **Hint (H)** rings one difference you missed — 3 per level.
- **R** restarts the level, **M** toggles sound, **Esc** goes back to the menu, **1–4** pick a level, **Enter** continues.

## The four scenes

1. **Harbor Dawn** — 5 differences, 90s: gulls, a lighthouse, a sailboat flag, a dock crate, and the sun itself.
2. **Cat Café** — 6 differences, 80s: a cat's tail, coffee steam, a clock, a flower, a wall picture, and a cookie.
3. **Night Market** — 7 differences, 70s: a lantern, a string light, an awning stripe, a piece of fruit, a roof cat, a tea sign, and a shopping bag.
4. **Starlight Garden** — 8 differences, 60s: the moon, fireflies, a frog, a flower, pond ripples, a mushroom, a butterfly, and a fence post.

Every picture is drawn procedurally on canvas — no image files — and every sound is synthesized with WebAudio, so the whole game is a handful of static files.

## Layout

- `game/index.html` — the page: two panels, HUD, menu and end screens.
- `game/css/style.css` — warm storybook styling for the frame.
- `game/js/scenes.js` — the four scenes: each draws itself twice, left original and right with its differences.
- `game/js/render.js` — paints one panel: picture, found markers, hint ring, wrong-click crosses.
- `game/js/game.js` — the state machine: timer, score, combo, hearts, hints, input.
- `game/js/audio.js` — synthesized sounds (find, wrong, hint, win, tick, click).
- `game/js/draw-helpers.js` — small canvas primitives shared by every scene.
- `game/js/main.js` — boots the game and stages the `?shot=` scenes for screenshots.
- `main.ts` — the hand-in program: copies `game/` and `screenshots/` to `/output` and writes `dossier.json`.
- `screenshots/` — four real renders of the game's own code.

## License

MIT — see [LICENSE](LICENSE).

# Straight Down Spell

*Hold your words, or play it safe.*

A daily falling-letter word game from smAisle, in The Daily 15's newspaper style. Everyone gets the same 100 letters in the same order each day on a board 7 wide and 8 high. A word-game cousin of Straight Down.

Play: https://smaisle.github.io/sdspell/ (once GitHub Pages is on). Home-screen name: SD Spell.

## Rules
- Letters fall one at a time: 12 seconds to fall the whole board at the start, easing to 6 seconds by letter 88 (the speed gauge under the arrows shows it). Tap a column to move the letter there, tap it again to drop it (like Straight Down). ◀ ▶ ▼ and arrow keys work too.
- 3+ letters across, down or up that spell a word light up. Diagonal words score double.
- **Hold or clear:** each new word pauses the game. Clear it for its points now, or hold it to build a longer word. A held word can be cleared later with a double tap, or press and hold it to bring the choice back. The pop-up opens under the board when there's room (over the arrows), otherwise over the emptier half of the board, and shows the next letter; the word in question floats up with a red line through it (one word at a time when there are several); 👁 Hold to see board makes the pop-up see-through.
- **Clear both:** when lit words share a letter, the pop-up offers to clear them together, and each word scores in full.
- **Points:** A, B, C, Deal letter values; +5 for each letter past 4.
- **2× vowels:** one A, E, I, O and U each day doubles any word it's in (they stack).
- **⛓ Chains:** a word made by letters dropping after a clear scores double.
- **⚠️ Final 10:** the last 10 letters are a mystery (Next shows ?, the pause screen doesn't count them), have a gold edge and ★, and any word using one scores double.
- **Game over** when the stack reaches the top, or as soon as the last letter lands. Every letter left on the board takes its points off (like Scrabble), and held words don't score.
- **Stars:** 90 / 180 / 300 points.
- **Result card:** best word, every word cleared (tap one for its meaning, from dictionaryapi.dev), and a share grid (🟨 straight, 🟦 diagonal, 🟩 chain, 🟪 ×4 or more).
- Words: ABC Deal's full list (rude words removed), about 80,000 words. Across words read left to right only.

## Screens
Cover (date, Game No., streak, stats row, Archive · Stats · How to play, smAisle link), Try it with a coach demo for first-timers (Try the demo on the cover, in the menu and in How to Play replays it), 4 quick cards from How to Play on the cover, menu with letters left, Stats, Archive (last 7 days, played late), result card with Share.

## Files
- `index.html`: the whole game (built). `source/src.html` is the template; `python3 source/build.py` fills in `source/words.txt` and writes `index.html`.
- `owner.html`: usage page (Jeff's Google sign-in), reads `ss_devices`.
- `icon-*.png`, `manifest.json`: home-screen icon.
- `tests/robot.js` (plays all 100 letters), `tests/demo.js` (walks the demo, checks the game ends on the last letter). Run with Node + Playwright.

## Version
Shown in the menu and How to Play. Bump `VERSION`/`VDATE` in `source/src.html` on every change, and keep the Claude artifact copy on the same version.

## Usage tracking
Website only (github.io / smaisle.app): an anonymous check-in to Firebase project `aislerun-88e79`, collection `ss_devices`, once a day on open and when the daily game ends. Fields: `first`, `last`, `days`, `v`, `daily`, `demo`, `desk`, `t`, `h` (day → score, -1 = opened only, last 60 days). Archive (late) games don't check in.

## Clock check
On open, the game reads the website's `Date` header; if the phone's clock is more than 10 minutes off, today's game and streaks use the real date and the cover shows a note. Offline, it uses the phone clock.

## Testing
The Testing buttons (restart today, try the ending with 15 letters left) are hidden on the website. Add `#test` to the address to show them.

## Invite gate
On smaisle.github.io the page loads `https://smaisle.github.io/gate.js` (data-game="sdspell"), which asks for an invite code made on the smAisle stats page (this game's code, or an every-game code) and remembers it per browser. smaisle.app passes the code along as `?code=`, so it opens straight away. A soft lock only.

## History
Started as Gramble (v1.0 to v2.5, Oct 30 to 31, 2026). The Gramble name went to the slot machine word game, so this game was renamed at v3.0. The new name also changes each day's letters.

## v3.12 (Nov 2)
- Cleaner menu (change list #21): Sound and Dark mode moved to a new Settings screen.

## v3.15 (Nov 4)
- One demo for every game (change list #30): Try it with a coach, using the shared demo frame (inlined in source/src.html). Three real moves on a small practice board. The old 6-step demo and its end card are gone, and the real game no longer has any demo code in it. Nothing is saved, including the old "demo" key, so the check-in's demo field only stays true for people who finished the old demo.
- First Play shows the new demo. The 4 quick cards stay as How to Play from the cover.
- Source catch-up: v3.13 and v3.14 had only been added to index.html, so they are now in source/src.html too and a rebuild keeps them.

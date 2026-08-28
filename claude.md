# flashcards-de

## What it does
A multiple-choice game for practising German noun articles (der/die/das),
pre-loaded with a wide deck covering gender rules by noun ending, semantic
rules (people, days, rivers, etc.), and the common exceptions to each — with
no English translations. In **Practice**, a noun is shown and the user picks
der/die/das; the card then flips to reveal whether they were right, the
correct article, and the rule behind it. A word is auto-marked **Known** once
it's been answered correctly two times in a row; any wrong answer resets that
streak back to Still learning. **Reference** lists every word grouped under
its rule category (e.g. "Feminine (die) — reliable endings", "Exceptions"),
with an "Add a word" section — visually set apart with a tinted background —
at the top for adding, editing, or deleting words; changes there apply to
the practice deck immediately.

## Tech Stack
- Plain HTML, CSS, JavaScript (no framework)
- Data stored in `localStorage` under the single key `flashcardsDE.v3`
  (bumped from v2 when correct-streak tracking and rule categories were added)
- No build step — open `index.html` directly in a browser

## Running the app
Open `index.html` in a browser, or serve the folder with any static server.

## Project Structure
- `index.html` — markup for the two views (Practice, Reference)
- `style.css` — all styling
- `app.js` — word state, persistence, and both views' rendering/logic

## Conventions
- One file per concern: `index.html`, `style.css`, `app.js`
- Add a comment above each function explaining what it does
- Always confirm with me before adding a new feature or page that wasn't in the original request
- If anything is unclear, ask me a question before making assumptions

## Do not
- Add any npm dependencies
- Commit any secrets — no API keys, passwords, or tokens in the files

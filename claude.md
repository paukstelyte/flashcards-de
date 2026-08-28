# flashcards-de

## What it does
A flashcard study tool, pre-loaded with a deck for practising German noun
articles (der/die/das): gender rules by noun ending, semantic rules (people,
days, rivers, etc.), and the common exceptions to each — with the reasoning
included right in the answer. Users can also add, edit, and delete their own
cards. Review mode shows the question, flips to the answer on click or
Space, and each card is marked Known or Still learning.

## Tech Stack
- Plain HTML, CSS, JavaScript (no framework)
- Data stored in `localStorage` under the single key `flashcardsDE.v1`
- No build step — open `index.html` directly in a browser

## Running the app
Open `index.html` in a browser, or serve the folder with any static server.

## Project Structure
- `index.html` — markup for the two views (My Deck, Review)
- `style.css` — all styling
- `app.js` — deck state, persistence, and both views' rendering/logic

## Conventions
- One file per concern: `index.html`, `style.css`, `app.js`
- Add a comment above each function explaining what it does
- Always confirm with me before adding a new feature or page that wasn't in the original request
- If anything is unclear, ask me a question before making assumptions

## Do not
- Add any npm dependencies
- Commit any secrets — no API keys, passwords, or tokens in the files

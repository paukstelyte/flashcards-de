/* Flashcards — German Articles. A question/answer deck for practising der/die/das.
   Cards live in localStorage under a single key; the deck starts pre-loaded with
   article rules and their exceptions, sourced from standard German grammar guides. */

var STORAGE_KEY = 'flashcardsDE.v1';

/* Starter deck: gender rules by noun ending, semantic rules, and the well-known
   exceptions to each, so the "why" is included right in the answer. */
var SEED_CARDS = [
  // Feminine (die) — reliable noun endings
  { q: 'Zeitung (newspaper)', a: 'die Zeitung — nouns ending in -ung are (almost) always feminine.' },
  { q: 'Übung (exercise)', a: 'die Übung — the -ung ending is a reliable feminine marker.' },
  { q: 'Freiheit (freedom)', a: 'die Freiheit — nouns ending in -heit are feminine.' },
  { q: 'Gesundheit (health)', a: 'die Gesundheit — the -heit ending marks a feminine noun.' },
  { q: 'Möglichkeit (possibility)', a: 'die Möglichkeit — nouns ending in -keit are feminine.' },
  { q: 'Süßigkeit (sweet / candy)', a: 'die Süßigkeit — the -keit ending marks a feminine noun.' },
  { q: 'Freundschaft (friendship)', a: 'die Freundschaft — nouns ending in -schaft are feminine.' },
  { q: 'Landschaft (landscape)', a: 'die Landschaft — the -schaft ending marks a feminine noun.' },
  { q: 'Nation (nation)', a: 'die Nation — nouns ending in -tion are feminine.' },
  { q: 'Information (information)', a: 'die Information — the -tion ending marks a feminine noun.' },
  { q: 'Familie (family)', a: 'die Familie — nouns ending in -ie are typically feminine.' },
  { q: 'Energie (energy)', a: 'die Energie — the -ie ending marks a feminine noun.' },
  { q: 'Lehrerin (female teacher)', a: 'die Lehrerin — the -in suffix marks a female person or animal and is always feminine.' },
  { q: 'Freundin (female friend)', a: 'die Freundin — the -in suffix marks a female person and is always feminine.' },

  // Masculine (der) — reliable noun endings
  { q: 'Tourismus (tourism)', a: 'der Tourismus — nouns ending in -ismus are masculine, with no known exceptions.' },
  { q: 'Journalismus (journalism)', a: 'der Journalismus — the -ismus ending marks a masculine noun.' },
  { q: 'Schmetterling (butterfly)', a: 'der Schmetterling — nouns ending in -ling are masculine, with no known exceptions.' },
  { q: 'Frühling (spring)', a: 'der Frühling — the -ling ending marks a masculine noun.' },
  { q: 'Honig (honey)', a: 'der Honig — nouns ending in -ig are typically masculine.' },
  { q: 'König (king)', a: 'der König — the -ig ending marks a masculine noun.' },
  { q: 'Motor (motor)', a: 'der Motor — nouns ending in -or are typically masculine.' },
  { q: 'Doktor (doctor)', a: 'der Doktor — the -or ending marks a masculine noun.' },
  { q: 'Lehrer (male teacher)', a: 'der Lehrer — agent nouns ending in -er (the person who does something) are masculine.' },
  { q: 'Bäcker (baker)', a: 'der Bäcker — the agent-noun -er ending marks a masculine noun.' },

  // Neuter (das) — reliable noun endings
  { q: 'Häuschen (little house)', a: 'das Häuschen — nouns ending in -chen are always neuter, since -chen is a diminutive suffix.' },
  { q: 'Fräulein (young lady, archaic)', a: 'das Fräulein — nouns ending in -lein are always neuter, since -lein is a diminutive suffix.' },
  { q: 'Museum (museum)', a: 'das Museum — nouns ending in -um are typically neuter.' },
  { q: 'Zentrum (centre)', a: 'das Zentrum — the -um ending marks a neuter noun.' },
  { q: 'Dokument (document)', a: 'das Dokument — nouns ending in -ment are typically neuter.' },
  { q: 'Instrument (instrument)', a: 'das Instrument — the -ment ending marks a neuter noun.' },
  { q: 'Essen (food / eating)', a: 'das Essen — an infinitive used as a noun (a "nominalised verb") is always neuter.' },
  { q: 'Leben (life)', a: 'das Leben — nominalised infinitives (a verb used as a noun) are always neuter.' },
  { q: 'Schwimmen (swimming)', a: 'das Schwimmen — nominalised infinitives are always neuter.' },

  // Semantic and category rules
  { q: 'Mann (man)', a: 'der Mann — nouns naming a male person are masculine.' },
  { q: 'Frau (woman)', a: 'die Frau — nouns naming a female person are feminine.' },
  { q: 'Vater (father)', a: 'der Vater — nouns naming a male person are masculine.' },
  { q: 'Mutter (mother)', a: 'die Mutter — nouns naming a female person are feminine.' },
  { q: 'Montag (Monday)', a: 'der Montag — all days of the week are masculine.' },
  { q: 'Januar (January)', a: 'der Januar — all months of the year are masculine.' },
  { q: 'Sommer (summer)', a: 'der Sommer — all four seasons are masculine.' },
  { q: 'Elbe (the Elbe)', a: 'die Elbe — most German river names are feminine.' },
  { q: 'Donau (the Danube)', a: 'die Donau — most river names are feminine.' },
  { q: 'Wein (wine)', a: 'der Wein — most alcoholic drinks are masculine.' },
  { q: 'Gold (gold)', a: 'das Gold — metals and chemical elements are typically neuter.' },
  { q: 'Eisen (iron)', a: 'das Eisen — metals and chemical elements are typically neuter.' },
  { q: 'Regen (rain)', a: 'der Regen — most weather phenomena are masculine.' },
  { q: 'Schnee (snow)', a: 'der Schnee — most weather phenomena are masculine.' },
  { q: 'Million (million)', a: 'die Million — cardinal numbers used as nouns are feminine.' },

  // Exceptions — worth learning by name, since the rules above don't predict them
  { q: 'Mädchen (girl)', a: 'das Mädchen — exception to "female = feminine": it ends in -chen (a diminutive of "die Magd"), and -chen nouns are always neuter, even when they name a female person.' },
  { q: 'Junge (boy)', a: 'der Junge — exception to "-e ending is often feminine": it names a male person, so natural gender overrides the ending.' },
  { q: 'Käse (cheese)', a: 'der Käse — exception to "-e ending is often feminine"; it is simply masculine by convention.' },
  { q: 'Name (name)', a: 'der Name — exception to "-e ending is often feminine"; it is masculine (and a "weak noun").' },
  { q: 'Person (person)', a: 'die Person — stays feminine even when describing a man; grammatical gender does not switch with the person\'s sex here.' },
  { q: 'Rhein (the Rhine)', a: 'der Rhein — exception to "river names are usually feminine"; along with der Main and der Neckar, it is masculine.' },
  { q: 'Main (the Main)', a: 'der Main — another masculine exception among mostly-feminine German river names.' },
  { q: 'Bier (beer)', a: 'das Bier — exception to "alcoholic drinks are usually masculine"; beer is neuter.' },
  { q: 'Stahl (steel)', a: 'der Stahl — exception to "metals are usually neuter"; steel is masculine.' },
  { q: 'Gewitter (thunderstorm)', a: 'das Gewitter — exception to "weather phenomena are usually masculine"; thunderstorm is neuter.' },
  { q: 'Auto (car)', a: 'das Auto — a loanword that does not follow a native gender pattern; neuter by convention, like most nouns ending in -o.' }
];

var cards = loadCards();
var reviewOrder = [];
var reviewIndex = 0;
var reviewFlipped = false;
var editingId = null;

/* Reads the saved deck from localStorage; on first run (nothing saved yet),
   seeds it with the starter German-article cards. Corrupt data falls back to the seed too. */
function loadCards() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    /* fall through to seeding */
  }
  return SEED_CARDS.map(function (seed) {
    return { id: makeId(), question: seed.q, answer: seed.a, status: null };
  });
}

/* Writes the current deck back to localStorage. */
function saveCards() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (err) {
    /* Storage may be full or blocked (e.g. private browsing); the app still works for this session. */
  }
}

/* Generates a short unique id for a new card. */
function makeId() {
  return 'c' + Date.now() + Math.floor(Math.random() * 1000);
}

/* Finds a card by its id. */
function findCard(id) {
  return cards.filter(function (card) { return card.id === id; })[0];
}

/* Adds a new card from the given question/answer text, ignoring empty input. */
function addCard(question, answer) {
  var q = question.trim();
  var a = answer.trim();
  if (!q || !a) {
    return;
  }
  cards.push({ id: makeId(), question: q, answer: a, status: null });
  saveCards();
  renderDeck();
}

/* Removes a card from the deck entirely. */
function deleteCard(id) {
  cards = cards.filter(function (card) { return card.id !== id; });
  saveCards();
  renderDeck();
}

/* Applies edited question/answer text to an existing card. */
function updateCard(id, question, answer) {
  var card = findCard(id);
  var q = question.trim();
  var a = answer.trim();
  if (!card || !q || !a) {
    return;
  }
  card.question = q;
  card.answer = a;
  saveCards();
  editingId = null;
  renderDeck();
}

/* ---------- Deck view ---------- */

/* Draws the card counter, the empty state, and the full list of cards. */
function renderDeck() {
  document.getElementById('deckCounter').textContent =
    cards.length + (cards.length === 1 ? ' card' : ' cards') + ' in your deck.';
  document.getElementById('deckEmpty').classList.toggle('hidden', cards.length > 0);

  var list = document.getElementById('cardList');
  list.innerHTML = '';
  cards.forEach(function (card) {
    list.appendChild(card.id === editingId ? buildEditRow(card) : buildCardRow(card));
  });
}

/* Builds the read-only row for one card: question, answer, status badge, edit/delete buttons. */
function buildCardRow(card) {
  var row = document.createElement('li');
  row.className = 'card-row';

  var main = document.createElement('div');
  main.className = 'card-row-main';

  var text = document.createElement('div');
  text.className = 'card-text';

  var question = document.createElement('p');
  question.className = 'card-question';
  question.textContent = card.question;

  var answer = document.createElement('p');
  answer.className = 'card-answer';
  answer.textContent = card.answer;

  text.appendChild(question);
  text.appendChild(answer);

  var buttons = document.createElement('div');
  buttons.className = 'card-row-buttons';

  var editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'icon-btn edit-btn';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', function () {
    editingId = card.id;
    renderDeck();
  });

  var deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'icon-btn delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', function () {
    deleteCard(card.id);
  });

  buttons.appendChild(editBtn);
  buttons.appendChild(deleteBtn);

  main.appendChild(text);
  main.appendChild(buttons);
  row.appendChild(main);
  row.appendChild(buildStatusBadge(card.status));

  return row;
}

/* Builds a small badge showing whether a card is unreviewed, known, or still learning. */
function buildStatusBadge(status) {
  var badge = document.createElement('span');
  badge.className = 'status-badge' + (status ? ' ' + status : '');
  badge.textContent = status === 'known' ? 'Known' :
    status === 'learning' ? 'Still learning' : 'Not reviewed yet';
  return badge;
}

/* Builds the inline edit form shown in place of a card row while it is being edited. */
function buildEditRow(card) {
  var row = document.createElement('li');
  row.className = 'card-row';

  var form = document.createElement('form');
  form.className = 'edit-form';

  var questionInput = document.createElement('input');
  questionInput.type = 'text';
  questionInput.value = card.question;
  questionInput.maxLength = 120;
  questionInput.required = true;
  questionInput.setAttribute('aria-label', 'Question');

  var answerInput = document.createElement('textarea');
  answerInput.value = card.answer;
  answerInput.maxLength = 300;
  answerInput.rows = 2;
  answerInput.required = true;
  answerInput.setAttribute('aria-label', 'Answer');

  var buttons = document.createElement('div');
  buttons.className = 'edit-form-buttons';

  var saveBtn = document.createElement('button');
  saveBtn.type = 'submit';
  saveBtn.className = 'save-btn';
  saveBtn.textContent = 'Save';

  var cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'icon-btn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', function () {
    editingId = null;
    renderDeck();
  });

  buttons.appendChild(saveBtn);
  buttons.appendChild(cancelBtn);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    updateCard(card.id, questionInput.value, answerInput.value);
  });

  form.appendChild(questionInput);
  form.appendChild(answerInput);
  form.appendChild(buttons);
  row.appendChild(form);

  return row;
}

/* ---------- Review view ---------- */

/* Shuffles the deck into a fresh review order and shows the first card. */
function startReview() {
  reviewOrder = shuffle(cards.map(function (card) { return card.id; }));
  reviewIndex = 0;
  reviewFlipped = false;
  renderReview();
}

/* Returns a shuffled copy of the given array (Fisher-Yates). */
function shuffle(list) {
  var result = list.slice();
  for (var i = result.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/* Flips the current review card between question and answer. */
function flipReviewCard() {
  if (reviewIndex >= reviewOrder.length) {
    return;
  }
  reviewFlipped = !reviewFlipped;
  document.getElementById('reviewCardInner').classList.toggle('flipped', reviewFlipped);
  document.getElementById('reviewActions').classList.toggle('visible', reviewFlipped);
}

/* Records Known/Still learning for the current card, then advances to the next one. */
function markReviewCard(status) {
  if (reviewIndex >= reviewOrder.length) {
    return;
  }
  var card = findCard(reviewOrder[reviewIndex]);
  if (card) {
    card.status = status;
    saveCards();
  }
  reviewIndex++;
  reviewFlipped = false;
  renderReview();
}

/* Draws the current state of the review view: progress, the card face-up, or the completion screen. */
function renderReview() {
  var empty = document.getElementById('reviewEmpty');
  var card_ = document.getElementById('reviewCard');
  var hint = document.getElementById('reviewHint');
  var progress = document.getElementById('reviewProgress');
  var actions = document.getElementById('reviewActions');
  var done = document.getElementById('reviewDone');

  if (!cards.length) {
    empty.classList.remove('hidden');
    card_.style.display = 'none';
    hint.style.display = 'none';
    progress.textContent = '';
    actions.classList.remove('visible');
    done.classList.remove('visible');
    return;
  }
  empty.classList.add('hidden');

  if (reviewIndex >= reviewOrder.length) {
    card_.style.display = 'none';
    hint.style.display = 'none';
    actions.classList.remove('visible');
    progress.textContent = '';
    done.classList.add('visible');

    var known = cards.filter(function (c) { return c.status === 'known'; }).length;
    var learning = cards.filter(function (c) { return c.status === 'learning'; }).length;
    document.getElementById('reviewDoneSummary').textContent =
      'Deck complete — ' + known + ' known, ' + learning + ' still learning.';
    return;
  }

  card_.style.display = '';
  hint.style.display = '';
  done.classList.remove('visible');
  progress.textContent = 'Card ' + (reviewIndex + 1) + ' of ' + reviewOrder.length;

  var card = findCard(reviewOrder[reviewIndex]);
  document.getElementById('reviewFront').textContent = card.question;
  document.getElementById('reviewBack').textContent = card.answer;
  document.getElementById('reviewCardInner').classList.toggle('flipped', reviewFlipped);
  actions.classList.toggle('visible', reviewFlipped);
}

/* ---------- Tabs ---------- */

/* Switches between the "My Deck" and "Review" views, (re)starting review each time it's opened. */
function showView(view) {
  document.getElementById('deckTab').classList.toggle('active', view === 'deck');
  document.getElementById('reviewTab').classList.toggle('active', view === 'review');
  document.getElementById('deckView').classList.toggle('active', view === 'deck');
  document.getElementById('reviewView').classList.toggle('active', view === 'review');

  if (view === 'review') {
    startReview();
  } else {
    renderDeck();
  }
}

/* Wires up the add form, tabs, card list clicks, and review card interactions, then draws the deck. */
function init() {
  document.getElementById('addForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var questionInput = document.getElementById('questionInput');
    var answerInput = document.getElementById('answerInput');
    addCard(questionInput.value, answerInput.value);
    questionInput.value = '';
    answerInput.value = '';
    questionInput.focus();
  });

  document.getElementById('tabs').addEventListener('click', function (event) {
    if (event.target.classList.contains('tab')) {
      showView(event.target.dataset.view);
    }
  });

  var reviewCard = document.getElementById('reviewCard');
  reviewCard.addEventListener('click', flipReviewCard);
  reviewCard.addEventListener('keydown', function (event) {
    if (event.code === 'Space' || event.key === ' ') {
      event.preventDefault();
      flipReviewCard();
    }
  });

  document.getElementById('stillLearningBtn').addEventListener('click', function () {
    markReviewCard('learning');
  });
  document.getElementById('knownBtn').addEventListener('click', function () {
    markReviewCard('known');
  });
  document.getElementById('restartReviewBtn').addEventListener('click', startReview);

  renderDeck();
}

init();

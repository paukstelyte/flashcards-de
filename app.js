/* Flashcards — German Articles. A multiple-choice game for practising der/die/das,
   plus a reference list of every word, grouped by the rule that explains its
   article. Words live in localStorage under a single key; the deck starts
   pre-loaded with article rules and their exceptions, sourced from standard
   German grammar guides. A word is auto-marked Known once it's been answered
   correctly two times in a row; a wrong answer resets that streak. Once a
   card is flipped, clicking anywhere on the page moves on to the next word.
   A toggle in the header switches between the plain theme and a colourful
   one, remembered in localStorage. */

var STORAGE_KEY = 'flashcardsDE.v3';
var THEME_KEY = 'flashcardsDE.theme';
var ARTICLES = ['der', 'die', 'das'];
var KNOWN_STREAK = 2;

/* The fixed set of rule categories words are grouped under, in display order.
   "Manually added" is not a rule category — it's where words added through
   the form land automatically, since the user doesn't pick one. */
var CATEGORIES = [
  'Feminine (die) — reliable endings',
  'Masculine (der) — reliable endings',
  'Neuter (das) — reliable endings',
  'Semantic & category rules',
  'Exceptions',
  'Manually added'
];
var MANUAL_CATEGORY = 'Manually added';

/* Starter deck: gender rules by noun ending, semantic rules, and the well-known
   exceptions to each, so the "why" is included right in the rule text. */
var SEED_WORDS = [
  // Feminine (die) — reliable noun endings
  { noun: 'Zeitung', article: 'die', category: CATEGORIES[0], rule: 'Nouns ending in -ung are (almost) always feminine.' },
  { noun: 'Übung', article: 'die', category: CATEGORIES[0], rule: 'Nouns ending in -ung are (almost) always feminine.' },
  { noun: 'Freiheit', article: 'die', category: CATEGORIES[0], rule: 'Nouns ending in -heit or -keit are feminine.' },
  { noun: 'Gesundheit', article: 'die', category: CATEGORIES[0], rule: 'Nouns ending in -heit or -keit are feminine.' },
  { noun: 'Möglichkeit', article: 'die', category: CATEGORIES[0], rule: 'Nouns ending in -heit or -keit are feminine.' },
  { noun: 'Süßigkeit', article: 'die', category: CATEGORIES[0], rule: 'Nouns ending in -heit or -keit are feminine.' },
  { noun: 'Freundschaft', article: 'die', category: CATEGORIES[0], rule: 'Nouns ending in -schaft are feminine.' },
  { noun: 'Landschaft', article: 'die', category: CATEGORIES[0], rule: 'Nouns ending in -schaft are feminine.' },
  { noun: 'Nation', article: 'die', category: CATEGORIES[0], rule: 'Nouns ending in -tion are feminine.' },
  { noun: 'Information', article: 'die', category: CATEGORIES[0], rule: 'Nouns ending in -tion are feminine.' },
  { noun: 'Familie', article: 'die', category: CATEGORIES[0], rule: 'Nouns ending in -ie are typically feminine.' },
  { noun: 'Energie', article: 'die', category: CATEGORIES[0], rule: 'Nouns ending in -ie are typically feminine.' },
  { noun: 'Lehrerin', article: 'die', category: CATEGORIES[0], rule: 'The -in suffix marks a female person or animal and is always feminine.' },
  { noun: 'Freundin', article: 'die', category: CATEGORIES[0], rule: 'The -in suffix marks a female person or animal and is always feminine.' },

  // Masculine (der) — reliable noun endings
  { noun: 'Tourismus', article: 'der', category: CATEGORIES[1], rule: 'Nouns ending in -ismus are masculine, with no known exceptions.' },
  { noun: 'Journalismus', article: 'der', category: CATEGORIES[1], rule: 'Nouns ending in -ismus are masculine, with no known exceptions.' },
  { noun: 'Schmetterling', article: 'der', category: CATEGORIES[1], rule: 'Nouns ending in -ling are masculine, with no known exceptions.' },
  { noun: 'Frühling', article: 'der', category: CATEGORIES[1], rule: 'Nouns ending in -ling are masculine, with no known exceptions.' },
  { noun: 'Honig', article: 'der', category: CATEGORIES[1], rule: 'Nouns ending in -ig are typically masculine.' },
  { noun: 'König', article: 'der', category: CATEGORIES[1], rule: 'Nouns ending in -ig are typically masculine.' },
  { noun: 'Motor', article: 'der', category: CATEGORIES[1], rule: 'Nouns ending in -or are typically masculine.' },
  { noun: 'Doktor', article: 'der', category: CATEGORIES[1], rule: 'Nouns ending in -or are typically masculine.' },
  { noun: 'Lehrer', article: 'der', category: CATEGORIES[1], rule: 'Agent nouns ending in -er (the person who does something) are masculine.' },
  { noun: 'Bäcker', article: 'der', category: CATEGORIES[1], rule: 'Agent nouns ending in -er (the person who does something) are masculine.' },

  // Neuter (das) — reliable noun endings
  { noun: 'Häuschen', article: 'das', category: CATEGORIES[2], rule: 'Nouns ending in -chen or -lein are always neuter, since these are diminutive suffixes.' },
  { noun: 'Fräulein', article: 'das', category: CATEGORIES[2], rule: 'Nouns ending in -chen or -lein are always neuter, since these are diminutive suffixes.' },
  { noun: 'Museum', article: 'das', category: CATEGORIES[2], rule: 'Nouns ending in -um are typically neuter.' },
  { noun: 'Zentrum', article: 'das', category: CATEGORIES[2], rule: 'Nouns ending in -um are typically neuter.' },
  { noun: 'Dokument', article: 'das', category: CATEGORIES[2], rule: 'Nouns ending in -ment are typically neuter.' },
  { noun: 'Instrument', article: 'das', category: CATEGORIES[2], rule: 'Nouns ending in -ment are typically neuter.' },
  { noun: 'Essen', article: 'das', category: CATEGORIES[2], rule: 'An infinitive used as a noun (a "nominalised verb") is always neuter.' },
  { noun: 'Leben', article: 'das', category: CATEGORIES[2], rule: 'An infinitive used as a noun (a "nominalised verb") is always neuter.' },
  { noun: 'Schwimmen', article: 'das', category: CATEGORIES[2], rule: 'An infinitive used as a noun (a "nominalised verb") is always neuter.' },

  // Semantic and category rules
  { noun: 'Mann', article: 'der', category: CATEGORIES[3], rule: 'Nouns naming a male person are masculine.' },
  { noun: 'Frau', article: 'die', category: CATEGORIES[3], rule: 'Nouns naming a female person are feminine.' },
  { noun: 'Vater', article: 'der', category: CATEGORIES[3], rule: 'Nouns naming a male person are masculine.' },
  { noun: 'Mutter', article: 'die', category: CATEGORIES[3], rule: 'Nouns naming a female person are feminine.' },
  { noun: 'Montag', article: 'der', category: CATEGORIES[3], rule: 'All days of the week are masculine.' },
  { noun: 'Januar', article: 'der', category: CATEGORIES[3], rule: 'All months of the year are masculine.' },
  { noun: 'Sommer', article: 'der', category: CATEGORIES[3], rule: 'All four seasons are masculine.' },
  { noun: 'Elbe', article: 'die', category: CATEGORIES[3], rule: 'Most German river names are feminine.' },
  { noun: 'Donau', article: 'die', category: CATEGORIES[3], rule: 'Most German river names are feminine.' },
  { noun: 'Wein', article: 'der', category: CATEGORIES[3], rule: 'Most alcoholic drinks are masculine.' },
  { noun: 'Gold', article: 'das', category: CATEGORIES[3], rule: 'Metals and chemical elements are typically neuter.' },
  { noun: 'Eisen', article: 'das', category: CATEGORIES[3], rule: 'Metals and chemical elements are typically neuter.' },
  { noun: 'Regen', article: 'der', category: CATEGORIES[3], rule: 'Most weather phenomena are masculine.' },
  { noun: 'Schnee', article: 'der', category: CATEGORIES[3], rule: 'Most weather phenomena are masculine.' },
  { noun: 'Million', article: 'die', category: CATEGORIES[3], rule: 'Cardinal numbers used as nouns are feminine.' },

  // Exceptions — worth learning by name, since the rules above don't predict them
  { noun: 'Mädchen', article: 'das', category: CATEGORIES[4], rule: 'Exception to the rule that female people take die: das Mädchen ends in -chen (a diminutive of "die Magd"), and -chen nouns are always das, even when they name a female person.' },
  { noun: 'Junge', article: 'der', category: CATEGORIES[4], rule: 'Exception to the rule that -e-ending nouns are usually die: der Junge names a male person, so natural gender overrides the ending.' },
  { noun: 'Käse', article: 'der', category: CATEGORIES[4], rule: 'Exception to the rule that -e-ending nouns are usually die: der Käse is simply der by convention.' },
  { noun: 'Name', article: 'der', category: CATEGORIES[4], rule: 'Exception to the rule that -e-ending nouns are usually die: der Name is der by convention (and a "weak noun").' },
  { noun: 'Person', article: 'die', category: CATEGORIES[4], rule: 'Exception to the rule that male people take der: die Person stays die even when describing a man — grammatical gender doesn\'t switch with the person\'s sex here.' },
  { noun: 'Rhein', article: 'der', category: CATEGORIES[4], rule: 'Exception to the rule that river names are usually die: der Rhein is masculine, along with der Main and der Neckar.' },
  { noun: 'Main', article: 'der', category: CATEGORIES[4], rule: 'Exception to the rule that river names are usually die: der Main is another masculine river name, along with der Rhein and der Neckar.' },
  { noun: 'Bier', article: 'das', category: CATEGORIES[4], rule: 'Exception to the rule that alcoholic drinks are usually der: das Bier is neuter.' },
  { noun: 'Stahl', article: 'der', category: CATEGORIES[4], rule: 'Exception to the rule that metals are usually das: der Stahl is masculine.' },
  { noun: 'Gewitter', article: 'das', category: CATEGORIES[4], rule: 'Exception to the rule that weather phenomena are usually der: das Gewitter is neuter.' },
  { noun: 'Auto', article: 'das', category: CATEGORIES[4], rule: 'Exception to the reliable-ending rules: as a loanword ending in -o, das Auto has no predictable pattern to follow — it is das by convention.' }
];

var words = loadWords();
var practiceOrder = [];
var practiceIndex = 0;
var chosenArticle = null;

/* Reads the saved deck from localStorage; on first run (nothing saved yet),
   seeds it with the starter German-article words. Corrupt data falls back to the seed too. */
function loadWords() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    /* fall through to seeding */
  }
  return SEED_WORDS.map(function (seed) {
    return {
      id: makeId(), noun: seed.noun, article: seed.article,
      category: seed.category, rule: seed.rule,
      correctStreak: 0, practised: false
    };
  });
}

/* Writes the current deck back to localStorage. */
function saveWords() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch (err) {
    /* Storage may be full or blocked (e.g. private browsing); the app still works for this session. */
  }
}

/* Generates a short unique id for a new word. */
function makeId() {
  return 'w' + Date.now() + Math.floor(Math.random() * 1000);
}

/* Finds a word by its id. */
function findWord(id) {
  return words.filter(function (word) { return word.id === id; })[0];
}

/* Derives a word's Known / Still learning / not-yet-practised status from its
   correct-answer streak, rather than storing it separately. */
function wordStatus(word) {
  if (!word.practised) {
    return null;
  }
  return word.correctStreak >= KNOWN_STREAK ? 'known' : 'learning';
}

/* Adds a new word from the given noun/article/rule, ignoring incomplete input.
   It's always filed under the "Manually added" category — the user doesn't pick one. */
function addWord(noun, article, rule) {
  var n = noun.trim();
  var r = rule.trim();
  if (!n || !r || ARTICLES.indexOf(article) === -1) {
    return;
  }
  words.push({ id: makeId(), noun: n, article: article, category: MANUAL_CATEGORY, rule: r, correctStreak: 0, practised: false });
  saveWords();
  renderReference();
}

/* Removes a word from the deck entirely. */
function deleteWord(id) {
  words = words.filter(function (word) { return word.id !== id; });
  saveWords();
  renderReference();
}

/* ---------- Reference view ---------- */

/* Draws the word counter, the empty state, and the reference table grouped by category. */
function renderReference() {
  document.getElementById('referenceCounter').textContent =
    words.length + (words.length === 1 ? ' word' : ' words') + ' in your deck.';
  document.getElementById('referenceEmpty').classList.toggle('hidden', words.length > 0);

  var groups = document.getElementById('referenceGroups');
  groups.innerHTML = '';

  CATEGORIES.forEach(function (category) {
    var wordsInCategory = words.filter(function (word) { return word.category === category; });
    if (!wordsInCategory.length) {
      return;
    }

    var section = document.createElement('div');
    section.className = 'category-group';

    var heading = document.createElement('h3');
    heading.className = 'category-heading';
    heading.textContent = category + ' (' + wordsInCategory.length + ')';
    section.appendChild(heading);

    section.appendChild(buildWordTable(wordsInCategory));
    groups.appendChild(section);
  });
}

/* Builds a table of words: one row per word, columns for noun, article,
   a short explanation, and a button to delete it. */
function buildWordTable(wordsInCategory) {
  var table = document.createElement('table');
  table.className = 'word-table';

  var thead = document.createElement('thead');
  thead.innerHTML =
    '<tr><th>Noun</th><th>Article</th><th>Explanation</th><th></th></tr>';
  table.appendChild(thead);

  var tbody = document.createElement('tbody');
  wordsInCategory.forEach(function (word) {
    tbody.appendChild(buildWordRow(word));
  });
  table.appendChild(tbody);

  return table;
}

/* Builds the table row for one word: noun, article, a short explanation, and a delete button. */
function buildWordRow(word) {
  var row = document.createElement('tr');

  var nounCell = document.createElement('td');
  nounCell.className = 'word-cell';
  nounCell.textContent = word.noun;

  var articleCell = document.createElement('td');
  articleCell.className = 'article-cell';
  articleCell.textContent = word.article;

  var ruleCell = document.createElement('td');
  ruleCell.className = 'rule-cell';
  ruleCell.innerHTML = formatRuleHtml(word.rule);

  var deleteCell = document.createElement('td');
  deleteCell.className = 'delete-cell';
  var deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete-x';
  deleteBtn.textContent = '×';
  deleteBtn.setAttribute('aria-label', 'Delete ' + word.noun);
  deleteBtn.addEventListener('click', function () {
    deleteWord(word.id);
  });
  deleteCell.appendChild(deleteBtn);

  row.appendChild(nounCell);
  row.appendChild(articleCell);
  row.appendChild(ruleCell);
  row.appendChild(deleteCell);

  return row;
}

/* Escapes text before it is dropped into innerHTML, so a noun can never inject markup. */
function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* Escapes a rule's text and highlights the word "exception"/"exceptions"
   wherever it appears, so that word alone stands out in bold red. */
function formatRuleHtml(text) {
  var escaped = escapeHtml(text);
  return escaped.replace(/\b(exceptions?)\b/gi, '<span class="exception-word">$1</span>');
}

/* ---------- Practice view ---------- */

/* Shuffles the deck into a fresh practice order and shows the first word. */
function startPractice() {
  practiceOrder = shuffle(words.map(function (word) { return word.id; }));
  practiceIndex = 0;
  chosenArticle = null;
  renderPractice();
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

/* Records the user's guess for the current word, updates its correct-answer
   streak, and flips the card to reveal the correct article and the rule. */
function chooseArticle(article) {
  if (practiceIndex >= practiceOrder.length || chosenArticle) {
    return;
  }
  chosenArticle = article;

  var word = findWord(practiceOrder[practiceIndex]);
  if (word) {
    word.practised = true;
    word.correctStreak = article === word.article ? word.correctStreak + 1 : 0;
    saveWords();
  }
  renderPractice();
}

/* Advances to the next word in the practice order. */
function goToNextWord() {
  if (!chosenArticle) {
    return;
  }
  practiceIndex++;
  chosenArticle = null;
  renderPractice();
}

/* Draws the current state of the practice view: progress, the card, or the completion screen. */
function renderPractice() {
  var empty = document.getElementById('practiceEmpty');
  var cardEl = document.getElementById('practiceCard');
  var progress = document.getElementById('practiceProgress');
  var hint = document.getElementById('continueHint');
  var done = document.getElementById('practiceDone');

  if (!words.length) {
    empty.classList.remove('hidden');
    cardEl.style.display = 'none';
    progress.textContent = '';
    hint.classList.remove('visible');
    done.classList.remove('visible');
    return;
  }
  empty.classList.add('hidden');

  if (practiceIndex >= practiceOrder.length) {
    cardEl.style.display = 'none';
    hint.classList.remove('visible');
    progress.textContent = '';
    done.classList.add('visible');

    var known = words.filter(function (w) { return wordStatus(w) === 'known'; }).length;
    var learning = words.filter(function (w) { return wordStatus(w) === 'learning'; }).length;
    document.getElementById('practiceDoneSummary').textContent =
      'Deck complete — ' + known + ' known, ' + learning + ' still learning.';
    return;
  }

  cardEl.style.display = '';
  done.classList.remove('visible');
  progress.textContent = 'Word ' + (practiceIndex + 1) + ' of ' + practiceOrder.length;

  var word = findWord(practiceOrder[practiceIndex]);
  document.getElementById('practiceNoun').textContent = word.noun;

  var flipped = !!chosenArticle;
  document.getElementById('practiceCardInner').classList.toggle('flipped', flipped);
  hint.classList.toggle('visible', flipped);

  renderChoiceButtons(word);

  if (flipped) {
    var correct = chosenArticle === word.article;
    var banner = document.getElementById('resultBanner');
    banner.textContent = correct ? 'Correct!' : 'Not quite — you chose ' + chosenArticle + '.';
    banner.className = 'result-banner ' + (correct ? 'correct' : 'incorrect');
    document.getElementById('practiceAnswer').textContent = word.article + ' ' + word.noun;
    document.getElementById('practiceRule').innerHTML = formatRuleHtml(word.rule);

    var status = wordStatus(word);
    var badge = document.getElementById('practiceStatusBadge');
    badge.className = 'status-badge' + (status ? ' ' + status : '');
    badge.textContent = status === 'known' ? 'Known' : 'Still learning';
  }
}

/* Draws the der/die/das choice buttons, highlighting the user's pick and the
   correct answer once a choice has been made, and disabling further picks. */
function renderChoiceButtons(word) {
  var buttons = document.querySelectorAll('#choiceButtons .choice-btn');
  buttons.forEach(function (button) {
    var article = button.dataset.article;
    button.className = 'choice-btn';
    button.disabled = !!chosenArticle;

    if (!chosenArticle) {
      return;
    }
    if (article === chosenArticle && article === word.article) {
      button.classList.add('correct-pick');
    } else if (article === chosenArticle) {
      button.classList.add('wrong-pick');
    } else if (article === word.article) {
      button.classList.add('reveal-correct');
    }
  });
}

/* ---------- Theme ---------- */

/* Reads the saved theme preference, defaulting to the original plain theme. */
function loadTheme() {
  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'colourful' || saved === 'default') {
      return saved;
    }
  } catch (err) {
    /* Storage may be blocked (e.g. private browsing); fall back to the default theme. */
  }
  return 'default';
}

/* Applies the given theme to the page and updates the toggle button's icon and label. */
function applyTheme(theme) {
  if (theme === 'colourful') {
    document.documentElement.setAttribute('data-theme', 'colourful');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  var toggle = document.getElementById('themeToggle');
  toggle.textContent = theme === 'colourful' ? '🖋️ Back to plain' : '🎨 Bring on the colour';
  toggle.setAttribute('aria-label', theme === 'colourful' ? 'Switch to plain theme' : 'Switch to colourful theme');
}

/* Switches between the plain and colourful themes and remembers the choice for next time. */
function toggleTheme() {
  var next = document.documentElement.getAttribute('data-theme') === 'colourful' ? 'default' : 'colourful';
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (err) {
    /* Storage may be full or blocked; the choice just won't persist across reloads. */
  }
}

/* ---------- Tabs ---------- */

/* Switches between the "Practice" and "Reference" views, (re)starting practice each time it's opened. */
function showView(view) {
  document.getElementById('practiceTab').classList.toggle('active', view === 'practice');
  document.getElementById('referenceTab').classList.toggle('active', view === 'reference');
  document.getElementById('practiceView').classList.toggle('active', view === 'practice');
  document.getElementById('referenceView').classList.toggle('active', view === 'reference');

  if (view === 'practice') {
    startPractice();
  } else {
    renderReference();
  }
}

/* Wires up the add form, tabs, choice buttons, the click-anywhere-to-continue
   behaviour, the theme toggle, and the restart action, then draws the deck. */
function init() {
  applyTheme(loadTheme());
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  document.getElementById('addForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var nounInput = document.getElementById('nounInput');
    var articleInput = document.getElementById('articleInput');
    var ruleInput = document.getElementById('ruleInput');
    addWord(nounInput.value, articleInput.value, ruleInput.value);
    nounInput.value = '';
    articleInput.value = '';
    ruleInput.value = '';
    nounInput.focus();
  });

  document.getElementById('tabs').addEventListener('click', function (event) {
    if (event.target.classList.contains('tab')) {
      showView(event.target.dataset.view);
    }
  });

  document.getElementById('choiceButtons').addEventListener('click', function (event) {
    if (event.target.classList.contains('choice-btn')) {
      chooseArticle(event.target.dataset.article);
      /* Stop this same click from also reaching the document-level listener
         below, which would otherwise skip straight to the next word. */
      event.stopPropagation();
    }
  });

  /* Once a card is flipped, a click anywhere on the page moves on to the next word. */
  document.addEventListener('click', function () {
    if (chosenArticle && document.getElementById('practiceView').classList.contains('active')) {
      goToNextWord();
    }
  });

  document.getElementById('restartPracticeBtn').addEventListener('click', startPractice);

  renderReference();
  startPractice();
}

init();

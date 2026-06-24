var LOVE_NOTES = [
  "you feel like home to me",
  "every flower here is me trying to say i love you",
  "you make my days feel softer",
  "this little garden is nothing compared to how beautiful you are",
  "i smile harder when i think about you",
  "you bring warmth into my life so easily",
  "loving you feels natural to me",
  "if i could gift you peace every day i would",
  "you are my favorite part of every day",
  "your name has a calmness in it that i never get tired of",
  "this garden will grow just like what i feel for you",
  "you make ordinary moments feel special",
  "if i could turn care into a place it would look like this",
  "you deserve beautiful things always",
  "no bee can reach what we have",
  "every time you water these plants i feel it too",
  "you are the rarest thing in my world nirvii",
  "i built this for you because you stay on my mind",
  "just like these flowers you need care and you have mine",
  "i love you more than all the petals in this garden"
];

var shownNotes = [];

function getNote() {
  if (shownNotes.length >= LOVE_NOTES.length) shownNotes = [];
  var available = [];
  for (var i = 0; i < LOVE_NOTES.length; i++) {
    if (shownNotes.indexOf(i) === -1) available.push(i);
  }
  var pick = available[Math.floor(Math.random() * available.length)];
  shownNotes.push(pick);
  return LOVE_NOTES[pick];
}

function renderNotesScreen() {
  var list = document.getElementById('notesList');
  if (!list) return;
  list.innerHTML = '';
  LOVE_NOTES.forEach(function(note) {
    var el = document.createElement('div');
    el.className = 'note-item';
    el.innerHTML =
      '<div class="note-item-text">' + note + '</div>' +
      '<div class="note-item-sig">from vansh</div>';
    list.appendChild(el);
  });
}

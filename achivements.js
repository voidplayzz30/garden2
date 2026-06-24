var ACHIEVEMENTS = [
  { id: 'firstSeed', icon: 'S', title: 'first seed', sub: 'you planted your first flower' },
  { id: 'firstBloom', icon: 'B', title: 'first bloom', sub: 'a flower reached full bloom' },
  { id: 'waterQueen', icon: 'W', title: 'water queen', sub: 'you watered 20 times' },
  { id: 'beeSurvivor', icon: 'X', title: 'bee survivor', sub: 'you survived a bee attack' },
  { id: 'beeSlayer', icon: 'Z', title: 'bee slayer', sub: 'survived 5 bee attacks' },
  { id: 'queenBeeKiller', icon: 'Q', title: 'queen bee defeated', sub: 'you beat the queen bee' },
  { id: 'bouquetMade', icon: 'F', title: 'bouquet queen', sub: 'you made your first bouquet' },
  { id: 'loveGiver', icon: 'L', title: 'love giver', sub: 'you gave love 30 times' },
  { id: 'greenThumb', icon: 'G', title: 'green thumb', sub: 'planted 8 flowers' },
  { id: 'oops', icon: 'O', title: 'oops', sub: 'a flower died from neglect' }
];

var unlockedAchievements = new Set();
var popupTimeout = null;

function initAchievements(savedArr) {
  unlockedAchievements = new Set(savedArr || []);
}

function unlockAchievement(id) {
  if (unlockedAchievements.has(id)) return;
  var ach = ACHIEVEMENTS.find(function(a) { return a.id === id; });
  if (!ach) return;
  unlockedAchievements.add(id);
  var popup = document.getElementById('achievementPopup');
  document.getElementById('achIcon').textContent = ach.icon;
  document.getElementById('achTitle').textContent = ach.title;
  document.getElementById('achSub').textContent = ach.sub;
  popup.classList.add('show');
  if (popupTimeout) clearTimeout(popupTimeout);
  popupTimeout = setTimeout(function() { popup.classList.remove('show'); }, 3500);
}

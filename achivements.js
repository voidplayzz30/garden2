var ACHIEVEMENTS = [
  { id: 'firstSeed', icon: '🌱', title: 'first seed', sub: 'you planted your first flower' },
  { id: 'firstBloom', icon: '🌸', title: 'first bloom', sub: 'a flower reached full bloom' },
  { id: 'waterQueen', icon: '💧', title: 'water queen', sub: 'you watered 20 times' },
  { id: 'beeSurvivor', icon: '🛡', title: 'bee survivor', sub: 'you survived a bee attack' },
  { id: 'beeSlayer', icon: '⚡', title: 'bee slayer', sub: 'survived 5 bee attacks' },
  { id: 'queenBeeKiller', icon: '👑', title: 'queen bee defeated', sub: 'you beat the queen bee' },
  { id: 'bouquetMade', icon: '💐', title: 'bouquet queen', sub: 'you made your first bouquet' },
  { id: 'loveGiver', icon: '💕', title: 'love giver', sub: 'you gave love 30 times' },
  { id: 'greenThumb', icon: '🌿', title: 'green thumb', sub: 'all 5 plots are filled' },
  { id: 'perfectGarden', icon: '✨', title: 'perfect garden', sub: 'all plants at full bloom' },
  { id: 'sevenDays', icon: '🔥', title: '7 day streak', sub: 'visited 7 days in a row' },
  { id: 'oops', icon: '😢', title: 'oops', sub: 'a flower died from neglect' }
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
  popupTimeout = setTimeout(function() {
    popup.classList.remove('show');
  }, 3500);
}
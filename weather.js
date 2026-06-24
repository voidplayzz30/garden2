var weatherState = { current: 'sunny', sunOpen: true };

function getDayPhase() {
  var h = new Date().getHours();
  if (h >= 6 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'sunset';
  return 'night';
}

function initWeather() {}
function updateCreatures() {}
function toggleSunlight() {}

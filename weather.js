var weatherState = {
  current: 'sunny',
  sunOpen: true
};

var SKY_COLORS = {
  day: {
    sunny: ['#1a1035', '#2e1b4a'],
    cloudy: ['#1a1a2e', '#2e2a3a'],
    rainy: ['#0f0f1e', '#1a1a2e'],
    stormy: ['#0a0a14', '#0f0f1e']
  },
  sunset: {
    sunny: ['#2a1020', '#7a3a50'],
    cloudy: ['#1a1020', '#5a2a40'],
    rainy: ['#0f0a18', '#2a1a28'],
    stormy: ['#0a0814', '#1a1020']
  },
  night: {
    sunny: ['#050510', '#0f0a1e'],
    cloudy: ['#080810', '#0f0f18'],
    rainy: ['#050508', '#0a0a10'],
    stormy: ['#030305', '#080808']
  }
};

function getDayPhase() {
  var h = new Date().getHours();
  if (h >= 6 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'sunset';
  return 'night';
}

function updateSky() {
  var phase = getDayPhase();
  var sky = SKY_COLORS[phase][weatherState.current];
  var skyBody = document.getElementById('skyBody');
  if (skyBody) {
    skyBody.style.background = 'linear-gradient(180deg, ' + sky[0] + ', ' + sky[1] + ')';
  }
}

function spawnClouds() {
  var container = document.getElementById('clouds');
  if (!container) return;
  container.innerHTML = '';
  var count = weatherState.current === 'sunny' ? 2
    : weatherState.current === 'cloudy' ? 5
    : weatherState.current === 'rainy' ? 6 : 4;

  for (var i = 0; i < count; i++) {
    var cloud = document.createElement('div');
    cloud.className = 'cloud';
    var y = 20 + Math.random() * 80;
    var duration = 30 + Math.random() * 40;
    cloud.style.cssText = 'top:' + y + 'px;animation-duration:' + duration + 's;animation-delay:-' + (Math.random() * duration) + 's;opacity:' + (0.4 + Math.random() * 0.4) + ';';
    cloud.innerHTML = '<div class="cloud-body" style="width:' + (80 + Math.random() * 60) + 'px;height:' + (30 + Math.random() * 20) + 'px;"></div>';
    container.appendChild(cloud);
  }
}

function spawnRain() {
  var container = document.getElementById('weatherLayer');
  if (!container) return;
  container.innerHTML = '';
  if (weatherState.current !== 'rainy' && weatherState.current !== 'stormy') return;
  var count = weatherState.current === 'stormy' ? 80 : 40;
  for (var i = 0; i < count; i++) {
    var drop = document.createElement('div');
    drop.className = 'rain-drop';
    var duration = 0.6 + Math.random() * 0.4;
    drop.style.cssText = 'left:' + (Math.random() * 100) + '%;top:-20px;height:' + (15 + Math.random() * 20) + 'px;animation-duration:' + duration + 's;animation-delay:-' + (Math.random() * duration) + 's;';
    container.appendChild(drop);
  }
}

function spawnButterflies(count) {
  count = count || 3;
  var container = document.getElementById('butterflies');
  if (!container) return;
  container.innerHTML = '';
  var colors = ['#f2a8cc', '#c9b2f5', '#a8d8f2', '#f2d8a8'];
  for (var i = 0; i < count; i++) {
    var b = document.createElement('div');
    b.className = 'butterfly';
    var color = colors[Math.floor(Math.random() * colors.length)];
    var duration = 6 + Math.random() * 8;
    b.style.cssText = 'left:' + (10 + Math.random() * 70) + '%;top:' + (30 + Math.random() * 40) + '%;animation-duration:' + duration + 's;animation-delay:-' + (Math.random() * duration) + 's;';
    b.innerHTML = '<div class="butterfly-wing-l" style="background:' + color + ';opacity:0.8;"></div><div style="width:4px;height:14px;background:#2a1a00;position:absolute;top:2px;left:14px;border-radius:2px;"></div><div class="butterfly-wing-r" style="background:' + color + ';opacity:0.8;"></div>';
    container.appendChild(b);
  }
}

function spawnFireflies(count) {
  count = count || 8;
  var container = document.getElementById('fireflies');
  if (!container) return;
  container.innerHTML = '';
  for (var i = 0; i < count; i++) {
    var f = document.createElement('div');
    f.className = 'firefly';
    var g = 1 + Math.random() * 1.5;
    var d = 4 + Math.random() * 6;
    f.style.cssText = 'left:' + (5 + Math.random() * 90) + '%;top:' + (20 + Math.random() * 70) + '%;animation-duration:' + g + 's,' + d + 's;animation-delay:-' + (Math.random() * g) + 's,-' + (Math.random() * d) + 's;';
    container.appendChild(f);
  }
}

function clearFireflies() {
  var c = document.getElementById('fireflies');
  if (c) c.innerHTML = '';
}

function clearButterflies() {
  var c = document.getElementById('butterflies');
  if (c) c.innerHTML = '';
}

function updateCreatures(gardenHealth) {
  var phase = getDayPhase();
  clearButterflies();
  clearFireflies();
  if (phase === 'night') {
    if (gardenHealth > 30) spawnFireflies(Math.floor(gardenHealth / 12));
    return;
  }
  if (gardenHealth > 60) spawnButterflies(Math.floor(gardenHealth / 25));
}

function toggleSunlight() {
  weatherState.sunOpen = !weatherState.sunOpen;
  var toggle = document.getElementById('sunToggle');
  var label = document.getElementById('sunLabel');
  if (toggle) toggle.classList.toggle('on', weatherState.sunOpen);
  if (label) label.textContent = weatherState.sunOpen ? 'open' : 'closed';
}

function initWeather() {
  weatherState.sunOpen = true;
  var toggle = document.getElementById('sunToggle');
  if (toggle) toggle.classList.add('on');
  updateSky();
  spawnClouds();
  setInterval(function() {
    updateSky();
  }, 60000);
}
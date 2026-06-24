var TOTAL_PLOTS = 3;
var FLOWERS_PER_PLOT = 8;
var WATER_INTERVAL_MS = 4 * 60 * 60 * 1000;

var gardenPlots = [];
var harvestedFlowers = [];
var currentPlotIndex = 0;
var currentTool = 'plant';
var selectedHoleIndex = null;
var waterCount = 0;
var loveCount = 0;
var beeWave = 1;
var visitStreak = 1;

var touchStartX = 0;
var touchCurrentX = 0;
var isDragging = false;

function initGarden() {
  try {
    var saved = loadState();
    if (saved && saved.gardenPlots && saved.gardenPlots.length > 0) {
      gardenPlots = saved.gardenPlots;
      harvestedFlowers = saved.harvestedFlowers || [];
      waterCount = saved.waterCount || 0;
      loveCount = saved.loveCount || 0;
      beeWave = saved.beeWave || 1;
      visitStreak = saved.visitStreak || 1;
      currentPlotIndex = 0;
      if (typeof initAchievements === 'function') initAchievements(saved.achievements || []);
    } else {
      createFreshGarden();
      if (typeof initAchievements === 'function') initAchievements([]);
    }
  } catch(e) {
    createFreshGarden();
  }

  var noteEl = document.getElementById('noteText');
  if (noteEl && typeof getNote === 'function') noteEl.textContent = getNote();

  renderAllPlots();
  updatePlotIndicator();
  updateHarvestBar();
  setupSwipe();

  setInterval(growthTick, 30000);
  setTimeout(function() { if (typeof checkBeeAttack === 'function') checkBeeAttack(beeWave, onBeeComplete); }, 5000);
}

function createFreshGarden() {
  gardenPlots = [];
  for (var p = 0; p < TOTAL_PLOTS; p++) {
    var plot = [];
    for (var f = 0; f < FLOWERS_PER_PLOT; f++) plot.push(null);
    gardenPlots.push(plot);
  }
  harvestedFlowers = [];
  visitStreak = 1;
}

function setupSwipe() {
  var container = document.getElementById('gardenSwipeContainer');
  if (!container) return;

  container.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  container.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    touchCurrentX = e.touches[0].clientX;
  }, { passive: true });

  container.addEventListener('touchend', function() {
    if (!isDragging) return;
    isDragging = false;
    var diff = touchStartX - touchCurrentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentPlotIndex < TOTAL_PLOTS - 1) currentPlotIndex++;
      else if (diff < 0 && currentPlotIndex > 0) currentPlotIndex--;
      updateSwipePosition();
      updatePlotIndicator();
    }
  });

  container.addEventListener('mousedown', function(e) {
    touchStartX = e.clientX;
    isDragging = true;
  });

  container.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    touchCurrentX = e.clientX;
  });

  container.addEventListener('mouseup', function() {
    if (!isDragging) return;
    isDragging = false;
    var diff = touchStartX - touchCurrentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentPlotIndex < TOTAL_PLOTS - 1) currentPlotIndex++;
      else if (diff < 0 && currentPlotIndex > 0) currentPlotIndex--;
      updateSwipePosition();
      updatePlotIndicator();
    }
  });
}

function updateSwipePosition() {
  var track = document.getElementById('gardenSwipeTrack');
  if (track) track.style.transform = 'translateX(-' + (currentPlotIndex * 100) + '%)';
}

function updatePlotIndicator() {
  var label = document.getElementById('plotLabel');
  if (label) label.textContent = 'plot ' + (currentPlotIndex + 1) + ' of ' + TOTAL_PLOTS;
  var dots = document.getElementById('plotDots');
  if (dots) {
    dots.innerHTML = '';
    for (var i = 0; i < TOTAL_PLOTS; i++) {
      var dot = document.createElement('div');
      dot.className = 'plot-dot' + (i === currentPlotIndex ? ' active' : '');
      dot.addEventListener('click', (function(idx) {
        return function() {
          currentPlotIndex = idx;
          updateSwipePosition();
          updatePlotIndicator();
        };
      })(i));
      dots.appendChild(dot);
    }
  }
}

function renderAllPlots() {
  var track = document.getElementById('gardenSwipeTrack');
  if (!track) return;
  track.innerHTML = '';

  for (var p = 0; p < TOTAL_PLOTS; p++) {
    var plotView = document.createElement('div');
    plotView.className = 'garden-plot';

    var plotData = gardenPlots[p];
    var aliveCount = plotData.filter(function(f) { return f && f.stage !== 'dead'; }).length;
    var bloomCount = plotData.filter(function(f) { return f && f.stage === 'bloom'; }).length;

    var ground = document.createElement('div');
    ground.className = 'plot-ground';

    var grassHTML = '<div class="grass-blades">';
    for (var g = 0; g < 25; g++) {
      var left = (g * 4) + Math.random() * 2;
      var height = 12 + Math.random() * 12;
      var delay = Math.random() * 3;
      grassHTML += '<div class="grass-blade" style="left:' + left + '%;height:' + height + 'px;animation-delay:-' + delay + 's;"></div>';
    }
    grassHTML += '</div>';

    var stonesHTML = '';
    var stones = [
      { top: '15%', left: '5%', w: 14, h: 10 },
      { top: '45%', right: '6%', w: 12, h: 8 },
      { bottom: '20%', left: '8%', w: 16, h: 11 },
      { top: '70%', right: '4%', w: 10, h: 7 }
    ];
    stones.forEach(function(s) {
      var pos = '';
      if (s.top) pos += 'top:' + s.top + ';';
      if (s.bottom) pos += 'bottom:' + s.bottom + ';';
      if (s.left) pos += 'left:' + s.left + ';';
      if (s.right) pos += 'right:' + s.right + ';';
      stonesHTML += '<div class="deco-stone" style="' + pos + 'width:' + s.w + 'px;height:' + s.h + 'px;"></div>';
    });

    var bubblesHTML = '';
    for (var b = 0; b < 5; b++) {
      bubblesHTML += '<div class="water-bubble" style="animation-delay:-' + (b * 0.6) + 's;"></div>';
    }

    ground.innerHTML =
      grassHTML +
      stonesHTML +
      '<div class="plot-title-bar">' +
        '<div class="plot-title">plot ' + (p + 1) + '</div>' +
        '<div class="plot-stats">' +
          '<div class="plot-stat">' + aliveCount + '/8</div>' +
          (bloomCount > 0 ? '<div class="plot-stat" style="color:var(--gold)">' + bloomCount + ' ready</div>' : '') +
        '</div>' +
      '</div>' +
      '<div class="garden-layout">' +
        '<div class="water-stream">' + bubblesHTML + '</div>' +
        '<div class="flower-grid" id="grid-' + p + '"></div>' +
      '</div>';

    plotView.appendChild(ground);
    track.appendChild(plotView);

    var grid = ground.querySelector('#grid-' + p);
    for (var f = 0; f < FLOWERS_PER_PLOT; f++) {
      var flower = plotData[f];
      var hole = document.createElement('div');
      hole.className = 'flower-hole';

      if (flower) {
        hole.classList.add('has-flower');
        if (flower.stage === 'bloom') hole.classList.add('bloomed');
        if (flower.stage === 'dead') hole.classList.add('dead');

        var catalog = getPlantById(flower.type);
        var flowerName = catalog ? catalog.name : flower.type;
        var stageText = flower.stage === 'dead' ? 'gone' : (STAGE_LABELS[flower.stage] || flower.stage);
        var healthPct = Math.round(flower.health);
        var waterPct = Math.round(flower.water);
        var healthColor = healthPct > 60 ? 'fill-health' : 'fill-low';
        var waterColor = waterPct > 30 ? 'fill-water' : 'fill-low';

        var plantHTML = flower.stage === 'dead'
          ? drawDeadPlantSVG(45, 55)
          : drawPlantSVG({ type: flower.type, stage: flower.stage, health: flower.health }, 45, 55);

        hole.innerHTML =
          (flower.stage === 'bloom' ? '<div class="harvest-bloom-icon">✂</div>' : '') +
          '<div class="flower-in-hole">' + plantHTML + '</div>' +
          '<div class="flower-info">' +
            '<div class="flower-name">' + flowerName + '</div>' +
            '<div class="flower-stage">' + stageText + '</div>' +
            '<div class="flower-mini-bars">' +
              '<div class="flower-mini-bar"><div class="flower-mini-fill ' + healthColor + '" style="width:' + healthPct + '%"></div></div>' +
              '<div class="flower-mini-bar"><div class="flower-mini-fill ' + waterColor + '" style="width:' + waterPct + '%"></div></div>' +
            '</div>' +
          '</div>';
      } else {
        hole.innerHTML =
          '<div class="hole-empty">' +
            '<div class="hole-dig-marks"></div>' +
            '<div class="hole-plus"></div>' +
          '</div>';
      }

      (function(plotIdx, flowerIdx) {
        hole.addEventListener('click', function() { handleFlowerClick(plotIdx, flowerIdx); });
      })(p, f);

      grid.appendChild(hole);
    }
  }

  updateSwipePosition();
}

function handleFlowerClick(plotIdx, flowerIdx) {
  var flower = gardenPlots[plotIdx][flowerIdx];

  if (currentTool === 'plant') {
    if (flower) { showToast('already planted here'); }
    else { selectedHoleIndex = { plot: plotIdx, flower: flowerIdx }; openSeedModal(); }
  }

  if (currentTool === 'water') {
    if (!flower || flower.stage === 'dead') { showToast('nothing to water'); return; }
    flower.water = Math.min(100, (flower.water || 0) + 40);
    flower.lastWatered = Date.now();
    flower.lastInteracted = Date.now();
    flower.health = Math.min(100, flower.health + 8);
    waterCount++;
    if (waterCount >= 20 && typeof unlockAchievement === 'function') unlockAchievement('waterQueen');
    showToast('watered ' + flower.type);
    saveCurrentState();
    renderAllPlots();
  }

  if (currentTool === 'love') {
    if (!flower || flower.stage === 'dead') { showToast('plant something first'); return; }
    flower.health = Math.min(100, flower.health + 5);
    flower.lastInteracted = Date.now();
    loveCount++;
    if (loveCount >= 30 && typeof unlockAchievement === 'function') unlockAchievement('loveGiver');
    showToast('gave love to ' + flower.type);
    saveCurrentState();
    renderAllPlots();
  }

  if (currentTool === 'harvest') {
    if (!flower) { showToast('nothing to harvest'); return; }
    if (flower.stage !== 'bloom') { showToast('not ready. wait for full bloom'); return; }
    harvestedFlowers.push({ type: flower.type, harvestedAt: Date.now() });
    gardenPlots[plotIdx][flowerIdx] = null;
    showToast('harvested ' + flower.type + '!');
    var noteEl = document.getElementById('noteText');
    if (noteEl && typeof getNote === 'function') noteEl.textContent = getNote();
    saveCurrentState();
    renderAllPlots();
    updateHarvestBar();
  }
}

function openSeedModal() {
  renderSeedList();
  document.getElementById('seedModal').classList.add('open');
}

function closeSeedModal(e) {
  if (e && e.target !== document.getElementById('seedModal')) return;
  document.getElementById('seedModal').classList.remove('open');
}

function renderSeedList() {
  var list = document.getElementById('seedList');
  if (!list) return;
  list.innerHTML = '';
  PLANT_CATALOG.forEach(function(seed) {
    var card = document.createElement('div');
    card.className = 'seed-card';
    card.innerHTML =
      '<div class="seed-thumb" style="border-color:' + seed.petalColor + ';">' +
        drawPlantSVG({ type: seed.id, stage: 'bloom', health: 100 }, 40, 40) +
      '</div>' +
      '<div class="seed-info">' +
        '<div class="seed-name">' + seed.name + '</div>' +
        '<div class="seed-desc">' + seed.desc + '</div>' +
        '<div class="seed-time">grows in ' + seed.growHours + 'h</div>' +
      '</div>' +
      '<div class="seed-pill">plant</div>';
    card.addEventListener('click', function() { plantFlower(seed); });
    list.appendChild(card);
  });
}

function plantFlower(seed) {
  if (!selectedHoleIndex) return;
  var pi = selectedHoleIndex.plot;
  var fi = selectedHoleIndex.flower;
  gardenPlots[pi][fi] = {
    type: seed.id, stage: 'seed', health: 100, water: 80,
    plantedAt: Date.now(), lastWatered: Date.now(), lastInteracted: Date.now()
  };
  document.getElementById('seedModal').classList.remove('open');
  if (typeof unlockAchievement === 'function') unlockAchievement('firstSeed');
  showToast('planted ' + seed.name);
  var total = 0;
  gardenPlots.forEach(function(plot) { plot.forEach(function(f) { if (f) total++; }); });
  if (total >= 8 && typeof unlockAchievement === 'function') unlockAchievement('greenThumb');
  selectedHoleIndex = null;
  saveCurrentState();
  renderAllPlots();
}

function growthTick() {
  var now = Date.now();
  var changed = false;
  gardenPlots.forEach(function(plot) {
    plot.forEach(function(flower) {
      if (!flower) return;
      var catalog = getPlantById(flower.type);
      if (!catalog) return;
      var ageMs = now - flower.plantedAt;
      var stageMs = (catalog.growHours * 3600000) / 4;
      var waterAge = now - (flower.lastWatered || flower.plantedAt);
      var waterPct = Math.max(0, 100 - (waterAge / WATER_INTERVAL_MS) * 100);
      flower.water = Math.round(waterPct);
      if (waterPct < 20) flower.health = Math.max(0, flower.health - 2);
      else if (waterPct > 50) flower.health = Math.min(100, flower.health + 0.3);
      if (flower.health <= 0 && flower.stage !== 'dead') {
        flower.stage = 'dead';
        if (typeof unlockAchievement === 'function') unlockAchievement('oops');
        changed = true; return;
      }
      if (flower.stage !== 'dead' && flower.stage !== 'bloom') {
        var stageIdx = getStageIndex(flower.stage);
        var expected = Math.min(4, Math.floor(ageMs / stageMs));
        if (expected > stageIdx) {
          flower.stage = STAGES[expected];
          changed = true;
          if (flower.stage === 'bloom') {
            if (typeof unlockAchievement === 'function') unlockAchievement('firstBloom');
            showToast('a ' + flower.type + ' is ready to harvest!');
          }
        }
      }
      changed = true;
    });
  });
  if (changed) {
    renderAllPlots();
    updateHarvestBar();
    saveCurrentState();
  }
}

function setTool(tool) {
  currentTool = tool;
  document.querySelectorAll('.tool').forEach(function(t) { t.classList.remove('active'); });
  var btn = document.getElementById('tool' + tool.charAt(0).toUpperCase() + tool.slice(1));
  if (btn) btn.classList.add('active');
  showToast(tool + ' mode');
}

function updateHarvestBar() {
  var el = document.getElementById('harvestCount');
  if (el) el.textContent = harvestedFlowers.length + ' flowers harvested';
}

function saveCurrentState() {
  try {
    saveState({
      gardenPlots: gardenPlots,
      harvestedFlowers: harvestedFlowers,
      waterCount: waterCount,
      loveCount: loveCount,
      beeWave: beeWave,
      visitStreak: visitStreak,
      lastVisit: Date.now(),
      achievements: typeof unlockedAchievements !== 'undefined' ? Array.from(unlockedAchievements) : []
    });
  } catch(e) {}
}

function onBeeComplete(survived) {
  if (survived) {
    beeWave = Math.min(beeWave + 1, 5);
    if (beeWave >= 5 && typeof unlockAchievement === 'function') unlockAchievement('beeSlayer');
  }
  saveCurrentState();
}

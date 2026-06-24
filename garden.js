var PLOT_COUNT = 5;
var WATER_INTERVAL_MS = 4 * 60 * 60 * 1000;
var plots = [null, null, null, null, null];
var currentTool = 'plant';
var waterCount = 0;
var loveCount = 0;
var beeWave = 1;
var visitStreak = 1;

window.gardenPlots = plots;

function initGarden() {
  try {
    var saved = loadState();
    if (saved && saved.plots && saved.plots.length > 0) {
      plots = saved.plots;
      while (plots.length < PLOT_COUNT) plots.push(null);
      waterCount = saved.waterCount || 0;
      loveCount = saved.loveCount || 0;
      beeWave = saved.beeWave || 1;
      visitStreak = saved.visitStreak || 1;
      if (typeof initAchievements === 'function') initAchievements(saved.achievements || []);
      checkStreak(saved.lastVisit);
    } else {
      plots = [null, null, null, null, null];
      if (typeof initAchievements === 'function') initAchievements([]);
      visitStreak = 1;
    }
  } catch(e) {
    plots = [null, null, null, null, null];
    visitStreak = 1;
  }
  
  window.gardenPlots = plots;
  
  var noteEl = document.getElementById('noteText');
  if (noteEl && typeof getNote === 'function') noteEl.textContent = getNote();
  
  renderGarden();
  updateStats();
  
  if (typeof initWeather === 'function') initWeather();
  if (typeof updateCreatures === 'function') updateCreatures(getGardenHealth());
  
  setInterval(growthTick, 60000);
  setInterval(function() { 
    if (typeof updateCreatures === 'function') updateCreatures(getGardenHealth()); 
  }, 120000);
  
  setTimeout(function() { 
    if (typeof checkBeeAttack === 'function') checkBeeAttack(beeWave, onBeeComplete); 
  }, 3000);
}

function checkStreak(lastVisit) {
  if (!lastVisit) { visitStreak = 1; return; }
  var last = new Date(lastVisit).toDateString();
  var today = new Date().toDateString();
  var yesterday = new Date(Date.now() - 86400000).toDateString();
  if (last === today) return;
  if (last === yesterday) visitStreak++;
  else visitStreak = 1;
  if (visitStreak >= 7 && typeof unlockAchievement === 'function') unlockAchievement('sevenDays');
}

function growthTick() {
  var now = Date.now();
  var changed = false;

  for (var i = 0; i < plots.length; i++) {
    var plot = plots[i];
    if (!plot) continue;
    var catalog = getPlantById(plot.type);
    if (!catalog) continue;

    var ageMs = now - plot.plantedAt;
    var stageMs = (catalog.growHours * 3600000) / 4;

    var waterAge = now - (plot.lastWatered || plot.plantedAt);
    var waterPct = Math.max(0, 100 - (waterAge / WATER_INTERVAL_MS) * 100);
    plots[i].water = Math.round(waterPct);

    if (typeof weatherState !== 'undefined' && weatherState.current === 'rainy') {
      plots[i].water = Math.min(100, plots[i].water + 20);
      plots[i].lastWatered = now;
    }

    if (waterPct < 20) {
      plots[i].health = Math.max(0, plots[i].health - 2);
    } else if (waterPct > 50) {
      plots[i].health = Math.min(100, plots[i].health + 0.5);
    }

    if (plots[i].health <= 0 && plot.stage !== 'dead') {
      plots[i].stage = 'dead';
      if (typeof unlockAchievement === 'function') unlockAchievement('oops');
      showToast('oh no your ' + plot.type + ' died');
      changed = true;
      continue;
    }

    if (plot.stage !== 'dead' && plot.stage !== 'bloom') {
      var sunBonus = (typeof weatherState !== 'undefined' && weatherState.sunOpen) ? 1 : 0.6;
      var stageIdx = getStageIndex(plot.stage);
      var expected = Math.min(4, Math.floor((ageMs * sunBonus) / stageMs));
      if (expected > stageIdx) {
        plots[i].stage = STAGES[expected];
        changed = true;
        if (plots[i].stage === 'bloom') {
          if (typeof unlockAchievement === 'function') unlockAchievement('firstBloom');
          showToast('your ' + plot.type + ' is in full bloom');
        }
      }
    }
    changed = true;
  }

  if (changed) {
    window.gardenPlots = plots;
    renderGarden();
    updateStats();
    saveCurrentState();
  }
}

function renderGarden() {
  var grid = document.getElementById('gardenGrid');
  if (!grid) return;
  
  grid.innerHTML = '';

  for (var i = 0; i < plots.length; i++) {
    var plot = plots[i];
    var plotEl = document.createElement('div');
    plotEl.className = 'plot';
    plotEl.setAttribute('data-plot', i);

    if (plot) {
      plotEl.classList.add('has-plant');
      if (plot.stage === 'dead') plotEl.classList.add('dead');
      else if (plot.water < 25 || plot.health < 30) plotEl.classList.add('wilting');

      var healthClass = plot.health > 60 ? 'good' : plot.health > 30 ? 'ok' : 'bad';
      var plantHTML = plot.stage === 'dead'
        ? drawDeadPlantSVG(70, 90)
        : drawPlantSVG({ type: plot.type, stage: plot.stage, health: plot.health }, 70, 90);

      plotEl.innerHTML =
        '<div class="plot-soil' + (plot.water > 60 ? ' wet' : '') + '"></div>' +
        '<div class="plant-wrap">' + plantHTML + '</div>' +
        '<div class="health-bar"><div class="health-fill ' + healthClass + '" style="width:' + plot.health + '%"></div></div>' +
        '<div class="plot-label">' + (plot.stage === 'dead' ? 'gone' : (STAGE_LABELS[plot.stage] || plot.stage)) + '</div>';
    } else {
      plotEl.innerHTML = '<div class="empty-plus"></div>';
    }

    (function(idx) {
      plotEl.addEventListener('click', function() { handlePlotClick(idx); });
    })(i);

    grid.appendChild(plotEl);
  }
}

function handlePlotClick(idx) {
  if (currentTool === 'plant') {
    if (!plots[idx]) openSeedModal(idx);
    else showToast('already planted here');
  }
  if (currentTool === 'water') {
    if (!plots[idx] || plots[idx].stage === 'dead') { showToast('nothing to water here'); return; }
    waterPlant(idx);
  }
  if (currentTool === 'love') {
    if (!plots[idx] || plots[idx].stage === 'dead') { showToast('plant a flower first'); return; }
    lovePlant(idx);
  }
}

function waterPlant(idx) {
  plots[idx].water = Math.min(100, (plots[idx].water || 0) + 40);
  plots[idx].lastWatered = Date.now();
  plots[idx].lastInteracted = Date.now();
  plots[idx].health = Math.min(100, plots[idx].health + 10);
  waterCount++;
  if (waterCount >= 20 && typeof unlockAchievement === 'function') unlockAchievement('waterQueen');
  var plotEl = document.querySelector('[data-plot="' + idx + '"]');
  if (plotEl) spawnWaterDrops(plotEl);
  showToast('watered');
  saveCurrentState();
  renderGarden();
  updateStats();
}

function lovePlant(idx) {
  plots[idx].health = Math.min(100, plots[idx].health + 5);
  plots[idx].lastInteracted = Date.now();
  loveCount++;
  if (loveCount >= 30 && typeof unlockAchievement === 'function') unlockAchievement('loveGiver');
  var plotEl = document.querySelector('[data-plot="' + idx + '"]');
  if (plotEl) spawnHearts(plotEl);
  showToast('love given');
  saveCurrentState();
  renderGarden();
  updateStats();
}

function openSeedModal(idx) {
  var sub = document.getElementById('seedModalSub');
  if (sub) sub.textContent = 'for plot ' + (idx + 1);
  renderSeedList(idx);
  var modal = document.getElementById('seedModal');
  if (modal) modal.classList.add('open');
}

function closeSeedModal(e) {
  if (e && e.target !== document.getElementById('seedModal')) return;
  var modal = document.getElementById('seedModal');
  if (modal) modal.classList.remove('open');
}

function renderSeedList(idx) {
  var list = document.getElementById('seedList');
  if (!list) return;
  list.innerHTML = '';
  PLANT_CATALOG.forEach(function(seed) {
    var card = document.createElement('div');
    card.className = 'seed-card';
    card.innerHTML =
      '<div class="seed-thumb" style="border-color:' + seed.petalColor + ';">' +
        drawPlantSVG({ type: seed.id, stage: 'bloom', health: 100 }, 50, 50) +
      '</div>' +
      '<div class="seed-info">' +
        '<div class="seed-name">' + seed.name + '</div>' +
        '<div class="seed-time">' + seed.desc + ' grows in ' + seed.growHours + 'h</div>' +
      '</div>' +
      '<div class="seed-pill">plant</div>';
    card.addEventListener('click', function() { plantSeed(seed, idx); });
    list.appendChild(card);
  });
}

function plantSeed(seed, idx) {
  plots[idx] = {
    type: seed.id,
    stage: 'seed',
    health: 100,
    water: 80,
    plantedAt: Date.now(),
    lastWatered: Date.now(),
    lastInteracted: Date.now(),
    hasWeed: false
  };
  window.gardenPlots = plots;
  var modal = document.getElementById('seedModal');
  if (modal) modal.classList.remove('open');
  if (typeof unlockAchievement === 'function') unlockAchievement('firstSeed');
  var noteEl = document.getElementById('noteText');
  if (noteEl && typeof getNote === 'function') noteEl.textContent = getNote();
  var filled = plots.filter(function(p) { return p; }).length;
  if (filled === PLOT_COUNT && typeof unlockAchievement === 'function') unlockAchievement('greenThumb');
  saveCurrentState();
  renderGarden();
  updateStats();
  setTimeout(function() {
    var plotEl = document.querySelector('[data-plot="' + idx + '"]');
    if (plotEl) spawnSparkles(plotEl);
  }, 100);
}

function setTool(tool) {
  currentTool = tool;
  document.querySelectorAll('.tool').forEach(function(t) { t.classList.remove('active'); });
  var btn = document.getElementById('tool' + tool.charAt(0).toUpperCase() + tool.slice(1));
  if (btn) btn.classList.add('active');
  showToast(tool + ' tool selected');
}

function getGardenHealth() {
  var alive = plots.filter(function(p) { return p && p.stage !== 'dead'; });
  if (!alive.length) return 0;
  return Math.round(alive.reduce(function(sum, p) { return sum + p.health; }, 0) / alive.length);
}

function updateStats() {
  var alive = plots.filter(function(p) { return p && p.stage !== 'dead'; }).length;
  var scoreEl = document.getElementById('statScore');
  var plantsEl = document.getElementById('statPlants');
  var streakEl = document.getElementById('statStreak');
  if (scoreEl) scoreEl.textContent = getGardenHealth() + '%';
  if (plantsEl) plantsEl.textContent = alive + '/' + PLOT_COUNT;
  if (streakEl) streakEl.textContent = visitStreak;
}

function saveCurrentState() {
  try {
    saveState({
      plots: plots,
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

function spawnHearts(container) {
  for (var i = 0; i < 5; i++) {
    (function() {
      var heart = document.createElement('div');
      heart.className = 'heart-particle';
      heart.style.cssText = 'left:' + (30 + Math.random() * 40) + '%;top:' + (20 + Math.random() * 40) + '%;animation-delay:' + (Math.random() * 0.3) + 's;';
      heart.innerHTML = '<svg viewBox="0 0 20 18" width="12" height="12"><path d="M10 16s-8-5.5-8-10a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 4.5-8 10-8 10z" fill="#f2a8cc"/></svg>';
      container.appendChild(heart);
      setTimeout(function() { if (heart.parentNode) heart.remove(); }, 1300);
    })();
  }
}

function spawnWaterDrops(container) {
  for (var i = 0; i < 6; i++) {
    (function() {
      var drop = document.createElement('div');
      drop.className = 'water-drop';
      drop.style.cssText = 'left:' + (20 + Math.random() * 60) + '%;top:' + (10 + Math.random() * 30) + '%;animation-delay:' + (Math.random() * 0.4) + 's;';
      container.appendChild(drop);
      setTimeout(function() { if (drop.parentNode) drop.remove(); }, 800);
    })();
  }
}

function spawnSparkles(container) {
  for (var i = 0; i < 8; i++) {
    (function() {
      var sp = document.createElement('div');
      sp.className = 'sparkle';
      sp.style.cssText = 'left:' + (10 + Math.random() * 80) + '%;top:' + (10 + Math.random() * 80) + '%;animation-delay:' + (Math.random() * 0.5) + 's;';
      container.appendChild(sp);
      setTimeout(function() { if (sp.parentNode) sp.remove(); }, 1000);
    })();
  }
}

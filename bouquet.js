var bouquetState = { selected: [], wrapColor: '#f2a8cc', ribbonColor: '#f5d88b' };

var WRAPS = [
  { hex: '#f2a8cc', name: 'pink' },
  { hex: '#d96a78', name: 'red' },
  { hex: '#76b7ff', name: 'blue' },
  { hex: '#ffffff', name: 'white' },
  { hex: '#c9b2f5', name: 'purple' },
  { hex: '#a8d4b0', name: 'green' },
  { hex: '#f5d88b', name: 'gold' }
];

var RIBBONS = [
  { hex: '#d96a78', name: 'red' },
  { hex: '#f2a8cc', name: 'pink' },
  { hex: '#f5d88b', name: 'gold' },
  { hex: '#ffffff', name: 'white' },
  { hex: '#c9b2f5', name: 'purple' },
  { hex: '#ff69b4', name: 'hot pink' }
];

function openBouquet() {
  if (harvestedFlowers.length === 0) {
    showToast('no harvested flowers. harvest bloomed flowers first');
    return;
  }
  bouquetState.selected = [];
  renderBouquetScreen();
  showScreen('bouquetScreen');
}

function closeBouquet() { showScreen('gardenScreen'); }

function renderBouquetScreen() {
  var list = document.getElementById('harvestedList');
  if (list) {
    list.innerHTML = '';
    harvestedFlowers.forEach(function(f, i) {
      var chip = document.createElement('div');
      chip.className = 'harvested-chip';
      chip.textContent = f.type;
      chip.addEventListener('click', function() {
        var idx = bouquetState.selected.indexOf(i);
        if (idx !== -1) { bouquetState.selected.splice(idx, 1); chip.classList.remove('in-bouquet'); }
        else { bouquetState.selected.push(i); chip.classList.add('in-bouquet'); }
        renderBouquetCanvas();
      });
      list.appendChild(chip);
    });
  }

  var wrapDiv = document.getElementById('wrapOptions');
  if (wrapDiv) {
    wrapDiv.innerHTML = '';
    WRAPS.forEach(function(w) {
      var c = document.createElement('div');
      c.className = 'color-chip' + (w.hex === bouquetState.wrapColor ? ' selected' : '');
      c.style.background = w.hex;
      c.addEventListener('click', function() {
        bouquetState.wrapColor = w.hex;
        wrapDiv.querySelectorAll('.color-chip').forEach(function(x) { x.classList.remove('selected'); });
        c.classList.add('selected');
        renderBouquetCanvas();
      });
      wrapDiv.appendChild(c);
    });
  }

  var ribDiv = document.getElementById('ribbonOptions');
  if (ribDiv) {
    ribDiv.innerHTML = '';
    RIBBONS.forEach(function(r) {
      var c = document.createElement('div');
      c.className = 'color-chip' + (r.hex === bouquetState.ribbonColor ? ' selected' : '');
      c.style.background = r.hex;
      c.addEventListener('click', function() {
        bouquetState.ribbonColor = r.hex;
        ribDiv.querySelectorAll('.color-chip').forEach(function(x) { x.classList.remove('selected'); });
        c.classList.add('selected');
        renderBouquetCanvas();
      });
      ribDiv.appendChild(c);
    });
  }

  renderBouquetCanvas();
}

function renderBouquetCanvas() {
  var canvas = document.getElementById('bouquetCanvas');
  if (!canvas) return;
  canvas.innerHTML = '';
  if (bouquetState.selected.length === 0) {
    canvas.innerHTML = '<div class="bouquet-empty">tap your harvested flowers to add them</div>';
    canvas.style.background = 'rgba(255,255,255,0.06)';
    canvas.style.borderColor = 'rgba(255,255,255,0.18)';
    return;
  }
  canvas.style.borderColor = bouquetState.wrapColor;
  canvas.style.background = bouquetState.wrapColor + '15';
  var ribbon = document.createElement('div');
  ribbon.style.cssText = 'width:100%;height:4px;background:' + bouquetState.ribbonColor + ';border-radius:4px;margin-bottom:8px;';
  canvas.appendChild(ribbon);
  bouquetState.selected.forEach(function(idx) {
    var f = harvestedFlowers[idx];
    if (!f) return;
    var wrap = document.createElement('div');
    wrap.className = 'bouquet-placed';
    wrap.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;margin:4px;';
    wrap.innerHTML = drawPlantSVG({ type: f.type, stage: 'bloom', health: 100 }, 44, 56) +
      '<span style="font-size:9px;color:var(--muted);text-transform:lowercase;margin-top:2px;">' + f.type + '</span>';
    canvas.appendChild(wrap);
  });
}

function shareBouquet() {
  if (bouquetState.selected.length === 0) { showToast('add some flowers first'); return; }
  var note = document.getElementById('bouquetNote');
  var noteText = note ? note.value : '';
  var flowers = bouquetState.selected.map(function(idx) {
    return harvestedFlowers[idx] ? harvestedFlowers[idx].type : '';
  }).filter(function(f) { return f; }).join(' and ');
  var wName = WRAPS.find(function(w) { return w.hex === bouquetState.wrapColor; });
  var rName = RIBBONS.find(function(r) { return r.hex === bouquetState.ribbonColor; });
  var msg = 'i made you a bouquet from my love garden\n\n' +
    'flowers: ' + flowers + '\n' +
    'wrapped in ' + (wName ? wName.name : 'pretty') + ' paper\n' +
    'with a ' + (rName ? rName.name : 'cute') + ' ribbon\n\n' +
    (noteText ? noteText + '\n\n' : '') +
    'grown with love by nirvii';
  var waUrl = 'https://wa.me/918899292701?text=' + encodeURIComponent(msg);
  window.open(waUrl, '_blank');
  if (typeof unlockAchievement === 'function') unlockAchievement('bouquetMade');
  showToast('bouquet sent!');
  var used = bouquetState.selected.sort(function(a,b) { return b-a; });
  used.forEach(function(idx) { harvestedFlowers.splice(idx, 1); });
  bouquetState.selected = [];
  saveCurrentState();
  updateHarvestBar();
  closeBouquet();
}

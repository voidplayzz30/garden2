var bouquetState = {
  selectedFlowers: [],
  wrapColor: 'pink',
  ribbonColor: 'gold'
};

var WRAP_COLORS = [
  { id: 'pink', label: 'pink', hex: '#f2a8cc' },
  { id: 'white', label: 'white', hex: '#ffffff' },
  { id: 'purple', label: 'purple', hex: '#c9b2f5' },
  { id: 'green', label: 'green', hex: '#a8d4b0' }
];

var RIBBON_COLORS = [
  { id: 'gold', label: 'gold', hex: '#f5d88b' },
  { id: 'white', label: 'white', hex: '#ffffff' },
  { id: 'pink', label: 'pink', hex: '#f2a8cc' },
  { id: 'red', label: 'red', hex: '#e87a7a' }
];

function openBouquet() {
  var bloomed = [];
  if (window.gardenPlots) {
    window.gardenPlots.forEach(function(p, i) {
      if (p && p.stage === 'bloom') bloomed.push({ plot: i, type: p.type });
    });
  }
  if (bloomed.length === 0) {
    showToast('no bloomed flowers yet. keep growing');
    return;
  }
  bouquetState.selectedFlowers = [];
  renderBouquetScreen(bloomed);
  showScreen('bouquetScreen');
}

function closeBouquet() {
  showScreen('gardenScreen');
}

function renderBouquetScreen(bloomed) {
  var chips = document.getElementById('bloomedFlowers');
  chips.innerHTML = '';
  bloomed.forEach(function(item, i) {
    var chip = document.createElement('div');
    chip.className = 'bouquet-flower-chip';
    chip.textContent = item.type;
    chip.setAttribute('data-i', i);
    chip.addEventListener('click', function() {
      var already = bouquetState.selectedFlowers.findIndex(function(f) { return f.i === i; });
      if (already !== -1) {
        bouquetState.selectedFlowers.splice(already, 1);
        chip.classList.remove('selected');
      } else {
        bouquetState.selectedFlowers.push({ i: i, type: item.type });
        chip.classList.add('selected');
      }
      renderBouquetCanvas();
    });
    chips.appendChild(chip);
  });

  var wrapC = document.getElementById('wrapOptions');
  wrapC.innerHTML = '';
  WRAP_COLORS.forEach(function(w) {
    var btn = document.createElement('button');
    btn.className = 'wrap-chip' + (w.id === bouquetState.wrapColor ? ' selected' : '');
    btn.textContent = w.label;
    btn.style.borderColor = w.hex;
    btn.addEventListener('click', function() {
      bouquetState.wrapColor = w.id;
      wrapC.querySelectorAll('.wrap-chip').forEach(function(c) { c.classList.remove('selected'); });
      btn.classList.add('selected');
    });
    wrapC.appendChild(btn);
  });

  var ribC = document.getElementById('ribbonOptions');
  ribC.innerHTML = '';
  RIBBON_COLORS.forEach(function(r) {
    var btn = document.createElement('button');
    btn.className = 'ribbon-chip' + (r.id === bouquetState.ribbonColor ? ' selected' : '');
    btn.textContent = r.label;
    btn.style.borderColor = r.hex;
    btn.addEventListener('click', function() {
      bouquetState.ribbonColor = r.id;
      ribC.querySelectorAll('.ribbon-chip').forEach(function(c) { c.classList.remove('selected'); });
      btn.classList.add('selected');
    });
    ribC.appendChild(btn);
  });

  renderBouquetCanvas();
}

function renderBouquetCanvas() {
  var canvas = document.getElementById('bouquetCanvas');
  canvas.innerHTML = '';
  if (bouquetState.selectedFlowers.length === 0) {
    canvas.innerHTML = '<div class="bouquet-drop-hint">tap flowers above to add them</div>';
    return;
  }
  bouquetState.selectedFlowers.forEach(function(item) {
    var wrap = document.createElement('div');
    wrap.className = 'bouquet-placed';
    wrap.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;margin:4px;';
    wrap.innerHTML = drawPlantSVG({ type: item.type, stage: 'bloom', health: 100 }, 50, 70) +
      '<span style="font-size:10px;color:rgba(255,255,255,0.7);text-transform:lowercase;">' + item.type + '</span>';
    canvas.appendChild(wrap);
  });
}

function shareBouquet() {
  var note = document.getElementById('bouquetNote').value;
  if (bouquetState.selectedFlowers.length === 0) {
    showToast('pick some flowers first');
    return;
  }
  var flowers = bouquetState.selectedFlowers.map(function(f) { return f.type; }).join(', ');
  var msg = encodeURIComponent(
    'i grew these flowers for you in my love garden\n\n' +
    'flowers: ' + flowers + '\n' +
    'wrap: ' + bouquetState.wrapColor + ' ribbon: ' + bouquetState.ribbonColor + '\n\n' +
    (note ? 'note: ' + note + '\n\n' : '') +
    'made with love by nirvii'
  );
  var waUrl = 'https://wa.me/+918899292701?text=' + msg;
  window.open(waUrl, '_blank');
  unlockAchievement('bouquetMade');
  showToast('bouquet sent to vansh');
  closeBouquet();
}
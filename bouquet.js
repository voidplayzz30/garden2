var bouquetState = { selected: [], wrapColor: '#f2a8cc', ribbonColor: '#f5d88b' };

var WRAPS = [
  { hex: '#f2a8cc', name: 'pink' },
  { hex: '#d96a78', name: 'red' },
  { hex: '#76b7ff', name: 'blue' },
  { hex: '#ffffff', name: 'white' },
  { hex: '#c9b2f5', name: 'purple' },
  { hex: '#a8d4b0', name: 'green' },
  { hex: '#f5d88b', name: 'gold' },
  { hex: '#8b4a6b', name: 'wine' }
];

var RIBBONS = [
  { hex: '#d96a78', name: 'red' },
  { hex: '#f2a8cc', name: 'pink' },
  { hex: '#f5d88b', name: 'gold' },
  { hex: '#ffffff', name: 'white' },
  { hex: '#c9b2f5', name: 'purple' },
  { hex: '#ff69b4', name: 'hot pink' },
  { hex: '#4a8a6b', name: 'green' }
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
      chip.className = 'harvested-chip-visual';
      chip.innerHTML =
        '<div class="chip-flower">' + drawPlantSVG({ type: f.type, stage: 'bloom', health: 100 }, 36, 44) + '</div>' +
        '<span class="chip-name">' + f.type + '</span>';
      chip.addEventListener('click', function() {
        var idx = bouquetState.selected.indexOf(i);
        if (idx !== -1) { 
          bouquetState.selected.splice(idx, 1); 
          chip.classList.remove('in-bouquet');
        } else { 
          bouquetState.selected.push(i); 
          chip.classList.add('in-bouquet');
          // Little animation when clicked
          chip.style.animation = 'chipPop 0.4s ease-out';
          setTimeout(function() { chip.style.animation = ''; }, 400);
        }
        renderBouquet();
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
      c.title = w.name;
      c.addEventListener('click', function() {
        bouquetState.wrapColor = w.hex;
        wrapDiv.querySelectorAll('.color-chip').forEach(function(x) { x.classList.remove('selected'); });
        c.classList.add('selected');
        renderBouquet();
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
      c.title = r.name;
      c.addEventListener('click', function() {
        bouquetState.ribbonColor = r.hex;
        ribDiv.querySelectorAll('.color-chip').forEach(function(x) { x.classList.remove('selected'); });
        c.classList.add('selected');
        renderBouquet();
      });
      ribDiv.appendChild(c);
    });
  }

  renderBouquet();
}

function renderBouquet() {
  var canvas = document.getElementById('bouquetCanvas');
  if (!canvas) return;
  
  if (bouquetState.selected.length === 0) {
    canvas.innerHTML = '<div class="bouquet-empty">tap flowers above to build your bouquet</div>';
    return;
  }

  // Get selected flowers
  var flowers = bouquetState.selected.map(function(idx) { return harvestedFlowers[idx]; }).filter(function(f) { return f; });
  
  var svgHTML = buildBouquetSVG(flowers, bouquetState.wrapColor, bouquetState.ribbonColor);
  canvas.innerHTML = svgHTML;
}

function buildBouquetSVG(flowers, wrapColor, ribbonColor) {
  var w = 280;
  var h = 340;
  var svg = '<svg width="100%" height="100%" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" id="bouquetSvg" style="max-width:280px;">';
  
  // Sparkle background
  svg += '<defs>';
  svg += '<radialGradient id="glow" cx="50%" cy="40%">';
  svg += '<stop offset="0%" stop-color="' + wrapColor + '" stop-opacity="0.3"/>';
  svg += '<stop offset="100%" stop-color="' + wrapColor + '" stop-opacity="0"/>';
  svg += '</radialGradient>';
  svg += '<linearGradient id="wrap" x1="0%" y1="0%" x2="0%" y2="100%">';
  svg += '<stop offset="0%" stop-color="' + wrapColor + '" stop-opacity="0.9"/>';
  svg += '<stop offset="50%" stop-color="' + wrapColor + '"/>';
  svg += '<stop offset="100%" stop-color="' + darkenColor(wrapColor, 30) + '"/>';
  svg += '</linearGradient>';
  svg += '<linearGradient id="wrapDark" x1="0%" y1="0%" x2="0%" y2="100%">';
  svg += '<stop offset="0%" stop-color="' + darkenColor(wrapColor, 20) + '"/>';
  svg += '<stop offset="100%" stop-color="' + darkenColor(wrapColor, 50) + '"/>';
  svg += '</linearGradient>';
  svg += '</defs>';
  
  // Background glow
  svg += '<ellipse cx="140" cy="130" rx="130" ry="100" fill="url(#glow)"/>';
  
  // Sparkles around
  var sparkles = [
    { x: 40, y: 60, r: 2 }, { x: 240, y: 80, r: 2 },
    { x: 30, y: 150, r: 1.5 }, { x: 250, y: 180, r: 1.5 },
    { x: 60, y: 40, r: 1 }, { x: 220, y: 50, r: 1 },
    { x: 45, y: 220, r: 1.5 }, { x: 235, y: 210, r: 1.5 }
  ];
  sparkles.forEach(function(s) {
    svg += '<circle cx="' + s.x + '" cy="' + s.y + '" r="' + s.r + '" fill="#fff" opacity="0.7"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite"/></circle>';
  });
  
  // Position flowers in a beautiful arrangement
  var positions = calculateFlowerPositions(flowers.length);
  
  // Draw flowers (back layer - leaves and stems)
  flowers.forEach(function(f, i) {
    var pos = positions[i];
    var catalog = getPlantById(f.type);
    if (!catalog) return;
    var sc = catalog.stemColor;
    
    // Long stem going down to wrapper
    svg += '<line x1="' + pos.x + '" y1="' + pos.y + '" x2="140" y2="250" stroke="' + sc + '" stroke-width="3" stroke-linecap="round" opacity="0.8"/>';
  });
  
  // Draw greenery (leaves) between flowers
  for (var g = 0; g < 6; g++) {
    var lx = 90 + (g * 20) + (Math.random() * 10 - 5);
    var ly = 210 + (g % 2) * 15;
    svg += '<ellipse cx="' + lx + '" cy="' + ly + '" rx="14" ry="6" fill="#3f7b55" opacity="0.7" transform="rotate(' + (g * 30 - 45) + ' ' + lx + ' ' + ly + ')"/>';
    svg += '<ellipse cx="' + lx + '" cy="' + ly + '" rx="10" ry="4" fill="#4d9a6a" opacity="0.6" transform="rotate(' + (g * 30 - 45) + ' ' + lx + ' ' + ly + ')"/>';
  }
  
  // Draw flowers (front layer - the blooms)
  flowers.forEach(function(f, i) {
    var pos = positions[i];
    svg += drawBouquetFlower(f.type, pos.x, pos.y, pos.size);
  });
  
  // ==== WRAPPER (cone shape) ====
  // Back of wrapper
  svg += '<path d="M 70 230 L 210 230 L 240 340 L 40 340 Z" fill="url(#wrapDark)" opacity="0.9"/>';
  
  // Front of wrapper (crossed)
  svg += '<path d="M 80 240 L 200 240 L 175 330 L 105 330 Z" fill="url(#wrap)"/>';
  
  // Left fold
  svg += '<path d="M 80 240 L 140 260 L 105 330 L 60 320 Z" fill="' + darkenColor(wrapColor, 15) + '" opacity="0.85"/>';
  
  // Right fold
  svg += '<path d="M 200 240 L 140 260 L 175 330 L 220 320 Z" fill="' + darkenColor(wrapColor, 15) + '" opacity="0.85"/>';
  
  // Highlight on wrapper
  svg += '<path d="M 90 245 L 100 250 L 110 320 L 100 322 Z" fill="#fff" opacity="0.2"/>';
  svg += '<path d="M 190 245 L 200 250 L 180 320 L 175 322 Z" fill="#fff" opacity="0.15"/>';
  
  // ==== RIBBON ====
  // Ribbon tie in the middle
  var ribbonY = 275;
  
  // Ribbon horizontal band
  svg += '<rect x="70" y="' + ribbonY + '" width="140" height="14" fill="' + ribbonColor + '" rx="2"/>';
  svg += '<rect x="70" y="' + ribbonY + '" width="140" height="4" fill="#fff" opacity="0.3" rx="2"/>';
  
  // Ribbon bow center
  svg += '<circle cx="140" cy="' + (ribbonY + 7) + '" r="9" fill="' + darkenColor(ribbonColor, 25) + '"/>';
  svg += '<circle cx="140" cy="' + (ribbonY + 7) + '" r="6" fill="' + ribbonColor + '"/>';
  
  // Left bow loop
  svg += '<path d="M 140 ' + (ribbonY + 7) + ' Q 115 ' + (ribbonY - 5) + ' 105 ' + (ribbonY + 5) + ' Q 100 ' + (ribbonY + 15) + ' 125 ' + (ribbonY + 12) + ' Z" fill="' + ribbonColor + '"/>';
  svg += '<path d="M 140 ' + (ribbonY + 7) + ' Q 118 ' + (ribbonY) + ' 110 ' + (ribbonY + 6) + '" stroke="' + darkenColor(ribbonColor, 20) + '" stroke-width="1" fill="none"/>';
  
  // Right bow loop
  svg += '<path d="M 140 ' + (ribbonY + 7) + ' Q 165 ' + (ribbonY - 5) + ' 175 ' + (ribbonY + 5) + ' Q 180 ' + (ribbonY + 15) + ' 155 ' + (ribbonY + 12) + ' Z" fill="' + ribbonColor + '"/>';
  svg += '<path d="M 140 ' + (ribbonY + 7) + ' Q 162 ' + (ribbonY) + ' 170 ' + (ribbonY + 6) + '" stroke="' + darkenColor(ribbonColor, 20) + '" stroke-width="1" fill="none"/>';
  
  // Bow tails
  svg += '<path d="M 138 ' + (ribbonY + 12) + ' L 130 ' + (ribbonY + 35) + ' L 138 ' + (ribbonY + 33) + ' Z" fill="' + ribbonColor + '"/>';
  svg += '<path d="M 142 ' + (ribbonY + 12) + ' L 152 ' + (ribbonY + 38) + ' L 145 ' + (ribbonY + 34) + ' Z" fill="' + ribbonColor + '"/>';
  
  // Sender text
  svg += '<text x="140" y="330" font-family="Arial" font-size="9" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-weight="bold">from nirvii</text>';
  
  svg += '</svg>';
  return svg;
}

function calculateFlowerPositions(count) {
  var positions = [];
  var centerX = 140;
  
  if (count === 1) {
    positions.push({ x: centerX, y: 120, size: 1.0 });
  } else if (count === 2) {
    positions.push({ x: centerX - 30, y: 130, size: 0.9 });
    positions.push({ x: centerX + 30, y: 130, size: 0.9 });
  } else if (count === 3) {
    positions.push({ x: centerX, y: 100, size: 1.0 });
    positions.push({ x: centerX - 40, y: 145, size: 0.85 });
    positions.push({ x: centerX + 40, y: 145, size: 0.85 });
  } else if (count === 4) {
    positions.push({ x: centerX - 25, y: 100, size: 0.95 });
    positions.push({ x: centerX + 25, y: 100, size: 0.95 });
    positions.push({ x: centerX - 45, y: 160, size: 0.85 });
    positions.push({ x: centerX + 45, y: 160, size: 0.85 });
  } else if (count === 5) {
    positions.push({ x: centerX, y: 90, size: 1.0 });
    positions.push({ x: centerX - 40, y: 130, size: 0.9 });
    positions.push({ x: centerX + 40, y: 130, size: 0.9 });
    positions.push({ x: centerX - 30, y: 175, size: 0.8 });
    positions.push({ x: centerX + 30, y: 175, size: 0.8 });
  } else {
    // 6+ flowers arrangement
    var rows = [
      { y: 90, count: 2, spacing: 40, size: 0.95 },
      { y: 130, count: 3, spacing: 45, size: 0.9 },
      { y: 175, count: 2, spacing: 40, size: 0.85 },
      { y: 200, count: 2, spacing: 30, size: 0.75 }
    ];
    var placed = 0;
    for (var r = 0; r < rows.length && placed < count; r++) {
      var row = rows[r];
      var startX = centerX - ((row.count - 1) * row.spacing) / 2;
      for (var c = 0; c < row.count && placed < count; c++) {
        positions.push({
          x: startX + c * row.spacing,
          y: row.y,
          size: row.size
        });
        placed++;
      }
    }
    // Extra flowers if 8+
    while (positions.length < count) {
      positions.push({ 
        x: centerX + (Math.random() * 100 - 50), 
        y: 90 + Math.random() * 100, 
        size: 0.7 
      });
    }
  }
  
  return positions;
}

function drawBouquetFlower(type, cx, cy, sizeScale) {
  var catalog = getPlantById(type);
  if (!catalog) return '';
  var pc = catalog.petalColor;
  var pd = catalog.petalDark;
  var cc = catalog.centerColor;
  var s = sizeScale;
  
  if (type === 'tulip') {
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')">' +
      '<ellipse cx="-6" cy="4" rx="8" ry="14" fill="' + pd + '" transform="rotate(-10)"/>' +
      '<ellipse cx="6" cy="4" rx="8" ry="14" fill="' + pd + '" transform="rotate(10)"/>' +
      '<ellipse cx="0" cy="0" rx="9" ry="16" fill="' + pc + '"/>' +
      '<ellipse cx="0" cy="-3" rx="4" ry="7" fill="' + cc + '" opacity="0.6"/>' +
      '</g>';
  }
  
  if (type === 'rose') {
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')">' +
      '<circle cx="0" cy="0" r="14" fill="' + pd + '"/>' +
      '<circle cx="-3" cy="-3" r="10" fill="' + pc + '"/>' +
      '<circle cx="4" cy="-1" r="8" fill="' + pd + '"/>' +
      '<circle cx="0" cy="-6" r="6" fill="' + pc + '"/>' +
      '<circle cx="0" cy="0" r="3" fill="' + cc + '"/>' +
      '</g>';
  }
  
  if (type === 'sunflower') {
    var petals = '';
    for (var i = 0; i < 12; i++) {
      var ang = (i * 30);
      petals += '<ellipse cx="0" cy="-16" rx="5" ry="10" fill="' + pc + '" transform="rotate(' + ang + ')"/>';
    }
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')">' +
      petals +
      '<circle cx="0" cy="0" r="10" fill="' + pd + '"/>' +
      '<circle cx="0" cy="0" r="7" fill="#3a1a00"/>' +
      '</g>';
  }
  
  if (type === 'cherry') {
    var cp = '';
    for (var j = 0; j < 5; j++) {
      var ang = j * 72;
      cp += '<ellipse cx="0" cy="-11" rx="7" ry="10" fill="' + pc + '" transform="rotate(' + ang + ')"/>';
    }
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')">' +
      cp +
      '<circle cx="0" cy="0" r="4" fill="' + cc + '"/>' +
      '</g>';
  }
  
  if (type === 'lavender') {
    var sp = '';
    for (var k = 0; k < 6; k++) {
      var y = -k * 5;
      var r = 7 - k * 0.8;
      sp += '<ellipse cx="0" cy="' + y + '" rx="' + r + '" ry="4" fill="' + pc + '"/>';
      if (k < 4) {
        sp += '<ellipse cx="-6" cy="' + (y + 2) + '" rx="5" ry="3" fill="' + pd + '" transform="rotate(-30 -6 ' + (y+2) + ')"/>';
        sp += '<ellipse cx="6" cy="' + (y + 2) + '" rx="5" ry="3" fill="' + pd + '" transform="rotate(30 6 ' + (y+2) + ')"/>';
      }
    }
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')">' + sp + '</g>';
  }
  
  if (type === 'daisy') {
    var dp = '';
    for (var d = 0; d < 10; d++) {
      var ang = d * 36;
      dp += '<ellipse cx="0" cy="-12" rx="4" ry="9" fill="' + pc + '" transform="rotate(' + ang + ')"/>';
    }
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')">' +
      dp +
      '<circle cx="0" cy="0" r="6" fill="' + cc + '"/>' +
      '</g>';
  }
  
  if (type === 'lily') {
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')">' +
      '<ellipse cx="-8" cy="0" rx="7" ry="13" fill="' + pc + '" transform="rotate(-25)"/>' +
      '<ellipse cx="8" cy="0" rx="7" ry="13" fill="' + pc + '" transform="rotate(25)"/>' +
      '<ellipse cx="0" cy="-3" rx="6" ry="12" fill="' + pd + '"/>' +
      '<ellipse cx="0" cy="-5" rx="3" ry="7" fill="' + cc + '" opacity="0.6"/>' +
      '<line x1="0" y1="-10" x2="0" y2="-16" stroke="' + cc + '" stroke-width="1.5"/>' +
      '<circle cx="0" cy="-17" r="1.5" fill="' + cc + '"/>' +
      '</g>';
  }
  
  return '';
}

function darkenColor(hex, percent) {
  var num = parseInt(hex.replace('#', ''), 16);
  var r = Math.max(0, (num >> 16) - Math.round(255 * percent / 100));
  var g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * percent / 100));
  var b = Math.max(0, (num & 0x0000FF) - Math.round(255 * percent / 100));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function shareBouquet() {
  if (bouquetState.selected.length === 0) { 
    showToast('add some flowers first'); 
    return; 
  }

  var note = document.getElementById('bouquetNote');
  var noteText = note ? note.value.trim() : '';
  
  showToast('creating your bouquet image...');
  
  // Convert SVG to image and download/share
  setTimeout(function() {
    generateBouquetImage(noteText);
  }, 300);
}

function generateBouquetImage(noteText) {
  var svg = document.getElementById('bouquetSvg');
  if (!svg) { showToast('something went wrong'); return; }
  
  var svgData = new XMLSerializer().serializeToString(svg);
  var canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800;
  var ctx = canvas.getContext('2d');
  
  // Background
  var grad = ctx.createLinearGradient(0, 0, 0, 800);
  grad.addColorStop(0, '#2e1b4a');
  grad.addColorStop(1, '#1a0f2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 800);
  
  // Load SVG as image
  var img = new Image();
  var svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  var url = URL.createObjectURL(svgBlob);
  
  img.onload = function() {
    // Draw bouquet centered
    ctx.drawImage(img, 40, 60, 520, 640);
    URL.revokeObjectURL(url);
    
    // Add title
    ctx.fillStyle = '#f5d88b';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('a bouquet for vansh', 300, 45);
    
    // Add note if exists
    if (noteText) {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = 'italic 20px Arial';
      var lines = wrapText(ctx, noteText, 520);
      var startY = 720;
      lines.forEach(function(line, i) {
        ctx.fillText(line, 300, startY + i * 26);
      });
    }
    
    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '14px Arial';
    ctx.fillText('grown with love in nirvii\'s garden', 300, 780);
    
    // Convert to blob and share
    canvas.toBlob(function(blob) {
      if (!blob) { showToast('image failed'); return; }
      
      var imgUrl = URL.createObjectURL(blob);
      
      // Try native share first (mobile)
      if (navigator.share && navigator.canShare) {
        var file = new File([blob], 'bouquet.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: 'a bouquet for vansh',
            text: noteText || 'i made this for you'
          }).then(function() {
            onBouquetSent();
          }).catch(function() {
            fallbackShare(imgUrl, noteText);
          });
          return;
        }
      }
      
      fallbackShare(imgUrl, noteText);
    }, 'image/png');
  };
  
  img.onerror = function() {
    showToast('image failed. try again');
  };
  
  img.src = url;
}

function fallbackShare(imgUrl, noteText) {
  // Show download modal
  var modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.style.zIndex = '999';
  modal.innerHTML =
    '<div class="modal-sheet">' +
      '<div class="sheet-handle"></div>' +
      '<h2>your bouquet is ready</h2>' +
      '<p class="sheet-sub">save it then share on whatsapp with vansh</p>' +
      '<img src="' + imgUrl + '" style="width:100%;border-radius:16px;margin-bottom:14px;">' +
      '<a href="' + imgUrl + '" download="bouquet-for-vansh.png" style="display:block;text-decoration:none;">' +
        '<button class="btn-main" style="margin-bottom:10px;">save bouquet</button>' +
      '</a>' +
      '<button class="btn-main" style="background:#25d366;color:white;" onclick="openWhatsApp(\'' + (noteText.replace(/'/g, "\\'")) + '\')">open whatsapp</button>' +
      '<button class="btn-main" style="background:transparent;color:white;border:1px solid rgba(255,255,255,0.2);margin-top:8px;" onclick="this.parentNode.parentNode.remove()">close</button>' +
    '</div>';
  document.body.appendChild(modal);
  
  onBouquetSent();
}

function openWhatsApp(noteText) {
  var msg = noteText || 'i made you a bouquet from my love garden';
  msg += '\n\ngrown with love by nirvii';
  var waUrl = 'https://wa.me/?text=' + encodeURIComponent(msg);
  window.open(waUrl, '_blank');
}

function onBouquetSent() {
  if (typeof unlockAchievement === 'function') unlockAchievement('bouquetMade');
  showToast('bouquet ready to share!');
  var used = bouquetState.selected.sort(function(a,b) { return b-a; });
  used.forEach(function(idx) { harvestedFlowers.splice(idx, 1); });
  bouquetState.selected = [];
  saveCurrentState();
  updateHarvestBar();
}

function wrapText(ctx, text, maxWidth) {
  var words = text.split(' ');
  var lines = [];
  var current = '';
  for (var i = 0; i < words.length; i++) {
    var test = current + words[i] + ' ';
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current.trim());
      current = words[i] + ' ';
    } else {
      current = test;
    }
  }
  if (current) lines.push(current.trim());
  return lines.slice(0, 3);
}

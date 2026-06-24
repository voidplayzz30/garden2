var PLANT_CATALOG = [
  {
    id: 'tulip',
    name: 'tulip',
    desc: 'soft pink and full of love',
    growHours: 2,
    petalColor: '#f58bc7',
    petalDark: '#d968aa',
    stemColor: '#4d9a6a',
    centerColor: '#fff0f8'
  },
  {
    id: 'rose',
    name: 'rose',
    desc: 'classic deep and beautiful',
    growHours: 3,
    petalColor: '#d96a78',
    petalDark: '#b84d59',
    stemColor: '#4b8e63',
    centerColor: '#ffe0e6'
  },
  {
    id: 'sunflower',
    name: 'sunflower',
    desc: 'bright happy and warm',
    growHours: 2.5,
    petalColor: '#f4c84e',
    petalDark: '#d8aa31',
    stemColor: '#5a9e5d',
    centerColor: '#7b4a1a'
  },
  {
    id: 'cherry',
    name: 'cherry blossom',
    desc: 'rare and delicate',
    growHours: 4,
    petalColor: '#f9b8d0',
    petalDark: '#e88aaa',
    stemColor: '#8b6058',
    centerColor: '#fff5f8'
  },
  {
    id: 'lavender',
    name: 'lavender',
    desc: 'calm and gentle',
    growHours: 1.5,
    petalColor: '#b09af0',
    petalDark: '#8169d7',
    stemColor: '#528a67',
    centerColor: '#e8e0ff'
  },
  {
    id: 'daisy',
    name: 'daisy',
    desc: 'simple sweet and cheerful',
    growHours: 1,
    petalColor: '#ffffff',
    petalDark: '#e0e0e0',
    stemColor: '#5a9a5a',
    centerColor: '#f5d44b'
  },
  {
    id: 'lily',
    name: 'lily',
    desc: 'elegant and graceful',
    growHours: 3.5,
    petalColor: '#f5e0f0',
    petalDark: '#d4a0c4',
    stemColor: '#4a8a5a',
    centerColor: '#ffe8a0'
  }
];

var STAGES = ['seed', 'sprout', 'growing', 'budding', 'bloom'];

var STAGE_LABELS = {
  seed: 'seed',
  sprout: 'sprout',
  growing: 'growing',
  budding: 'budding',
  bloom: 'full bloom'
};

function getStageIndex(stage) {
  return STAGES.indexOf(stage);
}

function getPlantById(id) {
  return PLANT_CATALOG.find(function(p) { return p.id === id; });
}

function getTimeToNextStage(plot) {
  if (!plot || plot.stage === 'bloom' || plot.stage === 'dead') return '';
  var catalog = getPlantById(plot.type);
  if (!catalog) return '';
  
  var stageMs = (catalog.growHours * 3600000) / 4;
  var stageIdx = getStageIndex(plot.stage);
  var sunBonus = (typeof weatherState !== 'undefined' && weatherState.sunOpen) ? 1 : 0.6;
  var ageMs = Date.now() - plot.plantedAt;
  var nextStageTime = ((stageIdx + 1) * stageMs) / sunBonus;
  var remaining = nextStageTime - ageMs;
  
  if (remaining <= 0) return 'soon';
  
  var mins = Math.floor(remaining / 60000);
  if (mins < 60) return mins + 'm left';
  var hrs = Math.floor(mins / 60);
  var remMins = mins % 60;
  return hrs + 'h ' + remMins + 'm';
}

function drawPlantSVG(plantData, w, h) {
  w = w || 70;
  h = h || 90;
  var type = plantData.type;
  var stage = plantData.stage;
  var health = plantData.health !== undefined ? plantData.health : 100;
  var catalog = getPlantById(type);
  if (!catalog) return '';

  var pc = health > 60 ? catalog.petalColor : health > 30 ? '#c8b060' : '#8a7050';
  var pd = health > 60 ? catalog.petalDark : health > 30 ? '#a09040' : '#6a5a30';
  var sc = health > 60 ? catalog.stemColor : health > 30 ? '#7a9a50' : '#6a7040';
  var cc = catalog.centerColor;
  var cx = w / 2;

  if (stage === 'seed') {
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg">' +
      '<ellipse cx="' + cx + '" cy="' + (h-8) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<ellipse cx="' + cx + '" cy="' + (h-12) + '" rx="6" ry="4" fill="#6a4438"/>' +
      '<circle cx="' + cx + '" cy="' + (h-14) + '" r="3" fill="' + sc + '" opacity="0.6"/>' +
      '</svg>';
  }

  if (stage === 'sprout') {
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-40) + '" stroke="' + sc + '" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-12) + '" cy="' + (h-36) + '" rx="9" ry="6" fill="' + sc + '" transform="rotate(-30 ' + (cx-12) + ' ' + (h-36) + ')"/>' +
      '<ellipse cx="' + (cx+12) + '" cy="' + (h-38) + '" rx="9" ry="6" fill="' + sc + '" transform="rotate(30 ' + (cx+12) + ' ' + (h-38) + ')"/>' +
      '</svg>';
  }

  if (stage === 'growing') {
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-54) + '" stroke="' + sc + '" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-14) + '" cy="' + (h-40) + '" rx="11" ry="7" fill="' + sc + '" transform="rotate(-35 ' + (cx-14) + ' ' + (h-40) + ')"/>' +
      '<ellipse cx="' + (cx+14) + '" cy="' + (h-48) + '" rx="11" ry="7" fill="' + sc + '" transform="rotate(35 ' + (cx+14) + ' ' + (h-48) + ')"/>' +
      '<ellipse cx="' + (cx-10) + '" cy="' + (h-54) + '" rx="8" ry="5" fill="' + sc + '" opacity="0.7" transform="rotate(-20 ' + (cx-10) + ' ' + (h-54) + ')"/>' +
      '</svg>';
  }

  if (stage === 'budding') {
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-60) + '" stroke="' + sc + '" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-14) + '" cy="' + (h-44) + '" rx="11" ry="7" fill="' + sc + '" transform="rotate(-35 ' + (cx-14) + ' ' + (h-44) + ')"/>' +
      '<ellipse cx="' + (cx+14) + '" cy="' + (h-52) + '" rx="11" ry="7" fill="' + sc + '" transform="rotate(35 ' + (cx+14) + ' ' + (h-52) + ')"/>' +
      '<ellipse cx="' + cx + '" cy="' + (h-72) + '" rx="9" ry="13" fill="' + pd + '"/>' +
      '<ellipse cx="' + cx + '" cy="' + (h-74) + '" rx="6" ry="9" fill="' + pc + '" opacity="0.7"/>' +
      '</svg>';
  }

  // BLOOM stage - unique per flower
  if (type === 'tulip') {
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-58) + '" stroke="' + sc + '" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-14) + '" cy="' + (h-46) + '" rx="12" ry="7" fill="' + sc + '" transform="rotate(-35 ' + (cx-14) + ' ' + (h-46) + ')"/>' +
      '<ellipse cx="' + (cx+14) + '" cy="' + (h-54) + '" rx="12" ry="7" fill="' + sc + '" transform="rotate(35 ' + (cx+14) + ' ' + (h-54) + ')"/>' +
      '<ellipse cx="' + (cx-8) + '" cy="' + (h-70) + '" rx="10" ry="16" fill="' + pd + '" transform="rotate(-10 ' + (cx-8) + ' ' + (h-70) + ')"/>' +
      '<ellipse cx="' + (cx+8) + '" cy="' + (h-70) + '" rx="10" ry="16" fill="' + pd + '" transform="rotate(10 ' + (cx+8) + ' ' + (h-70) + ')"/>' +
      '<ellipse cx="' + cx + '" cy="' + (h-76) + '" rx="10" ry="18" fill="' + pc + '"/>' +
      '<ellipse cx="' + cx + '" cy="' + (h-74) + '" rx="4" ry="7" fill="' + cc + '" opacity="0.5"/>' +
      '</svg>';
  }

  if (type === 'rose') {
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-56) + '" stroke="' + sc + '" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-16) + '" cy="' + (h-44) + '" rx="12" ry="7" fill="' + sc + '" transform="rotate(-35 ' + (cx-16) + ' ' + (h-44) + ')"/>' +
      '<ellipse cx="' + (cx+16) + '" cy="' + (h-52) + '" rx="12" ry="7" fill="' + sc + '" transform="rotate(35 ' + (cx+16) + ' ' + (h-52) + ')"/>' +
      '<circle cx="' + cx + '" cy="' + (h-72) + '" r="16" fill="' + pd + '"/>' +
      '<circle cx="' + (cx-5) + '" cy="' + (h-78) + '" r="10" fill="' + pc + '"/>' +
      '<circle cx="' + (cx+5) + '" cy="' + (h-76) + '" r="9" fill="' + pd + '"/>' +
      '<circle cx="' + cx + '" cy="' + (h-82) + '" r="7" fill="' + pc + '"/>' +
      '<circle cx="' + cx + '" cy="' + (h-84) + '" r="3" fill="' + cc + '"/>' +
      '</svg>';
  }

  if (type === 'sunflower') {
    var petals = '';
    for (var i = 0; i < 12; i++) {
      var angle = (i * 30) * Math.PI / 180;
      var px = cx + Math.cos(angle) * 18;
      var py = (h - 74) + Math.sin(angle) * 18;
      petals += '<ellipse cx="' + px + '" cy="' + py + '" rx="6" ry="10" fill="' + pc + '" transform="rotate(' + (i*30) + ' ' + px + ' ' + py + ')"/>';
    }
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-56) + '" stroke="' + sc + '" stroke-width="6" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-16) + '" cy="' + (h-40) + '" rx="12" ry="7" fill="' + sc + '" transform="rotate(-30 ' + (cx-16) + ' ' + (h-40) + ')"/>' +
      '<ellipse cx="' + (cx+16) + '" cy="' + (h-48) + '" rx="12" ry="7" fill="' + sc + '" transform="rotate(30 ' + (cx+16) + ' ' + (h-48) + ')"/>' +
      petals +
      '<circle cx="' + cx + '" cy="' + (h-74) + '" r="12" fill="' + pd + '"/>' +
      '<circle cx="' + cx + '" cy="' + (h-74) + '" r="8" fill="#3a1a00"/>' +
      '</svg>';
  }

  if (type === 'cherry') {
    var cpetals = '';
    for (var j = 0; j < 5; j++) {
      var cangle = (j * 72 - 90) * Math.PI / 180;
      var cpx = cx + Math.cos(cangle) * 12;
      var cpy = (h - 74) + Math.sin(cangle) * 12;
      cpetals += '<ellipse cx="' + cpx + '" cy="' + cpy + '" rx="8" ry="11" fill="' + pc + '" transform="rotate(' + (j*72) + ' ' + cpx + ' ' + cpy + ')" opacity="0.9"/>';
    }
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-56) + '" stroke="' + sc + '" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="' + (cx-6) + '" y1="' + (h-46) + '" x2="' + (cx-16) + '" y2="' + (h-60) + '" stroke="' + sc + '" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="' + (cx+6) + '" y1="' + (h-50) + '" x2="' + (cx+16) + '" y2="' + (h-62) + '" stroke="' + sc + '" stroke-width="3" stroke-linecap="round"/>' +
      cpetals +
      '<circle cx="' + cx + '" cy="' + (h-74) + '" r="4" fill="' + cc + '"/>' +
      '</svg>';
  }

  if (type === 'lavender') {
    var spikes = '';
    for (var k = 0; k < 6; k++) {
      var sy = (h - 56) - k * 7;
      var srx = 7 - k;
      spikes += '<ellipse cx="' + cx + '" cy="' + sy + '" rx="' + srx + '" ry="4" fill="' + pc + '" opacity="' + (0.7 + k * 0.05) + '"/>';
      if (k < 4) {
        spikes += '<ellipse cx="' + (cx-8-k*2) + '" cy="' + (sy+2) + '" rx="5" ry="3" fill="' + pd + '" opacity="0.7" transform="rotate(-30 ' + (cx-8-k*2) + ' ' + (sy+2) + ')"/>';
        spikes += '<ellipse cx="' + (cx+8+k*2) + '" cy="' + (sy+2) + '" rx="5" ry="3" fill="' + pd + '" opacity="0.7" transform="rotate(30 ' + (cx+8+k*2) + ' ' + (sy+2) + ')"/>';
      }
    }
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-54) + '" stroke="' + sc + '" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-12) + '" cy="' + (h-38) + '" rx="9" ry="5" fill="' + sc + '" transform="rotate(-30 ' + (cx-12) + ' ' + (h-38) + ')"/>' +
      '<ellipse cx="' + (cx+12) + '" cy="' + (h-44) + '" rx="9" ry="5" fill="' + sc + '" transform="rotate(30 ' + (cx+12) + ' ' + (h-44) + ')"/>' +
      spikes +
      '</svg>';
  }

  if (type === 'daisy') {
    var dpetals = '';
    for (var d = 0; d < 8; d++) {
      var dangle = (d * 45) * Math.PI / 180;
      var dpx = cx + Math.cos(dangle) * 14;
      var dpy = (h - 74) + Math.sin(dangle) * 14;
      dpetals += '<ellipse cx="' + dpx + '" cy="' + dpy + '" rx="6" ry="10" fill="' + pc + '" transform="rotate(' + (d*45) + ' ' + dpx + ' ' + dpy + ')"/>';
    }
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-56) + '" stroke="' + sc + '" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-14) + '" cy="' + (h-42) + '" rx="10" ry="6" fill="' + sc + '" transform="rotate(-30 ' + (cx-14) + ' ' + (h-42) + ')"/>' +
      '<ellipse cx="' + (cx+14) + '" cy="' + (h-48) + '" rx="10" ry="6" fill="' + sc + '" transform="rotate(30 ' + (cx+14) + ' ' + (h-48) + ')"/>' +
      dpetals +
      '<circle cx="' + cx + '" cy="' + (h-74) + '" r="8" fill="' + cc + '"/>' +
      '</svg>';
  }

  if (type === 'lily') {
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-58) + '" stroke="' + sc + '" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-14) + '" cy="' + (h-44) + '" rx="12" ry="7" fill="' + sc + '" transform="rotate(-35 ' + (cx-14) + ' ' + (h-44) + ')"/>' +
      '<ellipse cx="' + (cx+14) + '" cy="' + (h-52) + '" rx="12" ry="7" fill="' + sc + '" transform="rotate(35 ' + (cx+14) + ' ' + (h-52) + ')"/>' +
      '<ellipse cx="' + (cx-10) + '" cy="' + (h-72) + '" rx="9" ry="16" fill="' + pc + '" transform="rotate(-20 ' + (cx-10) + ' ' + (h-72) + ')"/>' +
      '<ellipse cx="' + (cx+10) + '" cy="' + (h-72) + '" rx="9" ry="16" fill="' + pc + '" transform="rotate(20 ' + (cx+10) + ' ' + (h-72) + ')"/>' +
      '<ellipse cx="' + cx + '" cy="' + (h-76) + '" rx="7" ry="14" fill="' + pd + '"/>' +
      '<ellipse cx="' + cx + '" cy="' + (h-78) + '" rx="3" ry="6" fill="' + cc + '" opacity="0.6"/>' +
      '<line x1="' + cx + '" y1="' + (h-84) + '" x2="' + cx + '" y2="' + (h-92) + '" stroke="' + cc + '" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="' + cx + '" cy="' + (h-93) + '" r="2" fill="' + cc + '"/>' +
      '</svg>';
  }

  return '';
}

function drawDeadPlantSVG(w, h) {
  w = w || 70;
  h = h || 90;
  var cx = w / 2;
  return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
    '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#6a4438"/>' +
    '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-46) + '" stroke="#5a4030" stroke-width="4" stroke-linecap="round"/>' +
    '<line x1="' + cx + '" y1="' + (h-34) + '" x2="' + (cx-14) + '" y2="' + (h-48) + '" stroke="#5a4030" stroke-width="3" stroke-linecap="round"/>' +
    '<line x1="' + cx + '" y1="' + (h-40) + '" x2="' + (cx+12) + '" y2="' + (h-52) + '" stroke="#5a4030" stroke-width="3" stroke-linecap="round"/>' +
    '</svg>' +
    '<div class="ghost-flower"><svg width="18" height="22"><circle cx="9" cy="7" r="5" fill="rgba(200,200,255,0.4)"/><ellipse cx="9" cy="18" rx="5" ry="4" fill="rgba(200,200,255,0.25)"/></svg></div>';
}

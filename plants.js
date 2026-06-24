const PLANT_CATALOG = [
  {
    id: 'tulip',
    name: 'tulip',
    desc: 'soft pink and full of love',
    growHours: 48,
    petalColor: '#f58bc7',
    petalDark: '#d968aa',
    stemColor: '#4d9a6a',
    centerColor: '#fff0f8'
  },
  {
    id: 'rose',
    name: 'rose',
    desc: 'classic deep and beautiful',
    growHours: 72,
    petalColor: '#d96a78',
    petalDark: '#b84d59',
    stemColor: '#4b8e63',
    centerColor: '#ffe0e6'
  },
  {
    id: 'sunflower',
    name: 'sunflower',
    desc: 'bright happy and warm',
    growHours: 60,
    petalColor: '#f4c84e',
    petalDark: '#d8aa31',
    stemColor: '#5a9e5d',
    centerColor: '#7b4a1a'
  },
  {
    id: 'cherry',
    name: 'cherry blossom',
    desc: 'rare and delicate',
    growHours: 96,
    petalColor: '#f9b8d0',
    petalDark: '#e88aaa',
    stemColor: '#8b6058',
    centerColor: '#fff5f8'
  },
  {
    id: 'lavender',
    name: 'lavender',
    desc: 'calm and gentle',
    growHours: 36,
    petalColor: '#b09af0',
    petalDark: '#8169d7',
    stemColor: '#528a67',
    centerColor: '#e8e0ff'
  }
];

const STAGES = ['seed', 'sprout', 'growing', 'budding', 'bloom'];

const STAGE_LABELS = {
  seed: 'just planted',
  sprout: 'sprouting',
  growing: 'growing',
  budding: 'budding',
  bloom: 'full bloom'
};

function getStageIndex(stage) {
  return STAGES.indexOf(stage);
}

function getPlantById(id) {
  return PLANT_CATALOG.find(p => p.id === id);
}

function drawPlantSVG(plantData, w, h) {
  w = w || 70;
  h = h || 90;
  const type = plantData.type;
  const stage = plantData.stage;
  const health = plantData.health !== undefined ? plantData.health : 100;
  const catalog = getPlantById(type);
  if (!catalog) return '';

  const pc = health > 60 ? catalog.petalColor : health > 30 ? '#c8b060' : '#8a7050';
  const pd = health > 60 ? catalog.petalDark : health > 30 ? '#a09040' : '#6a5a30';
  const sc = health > 60 ? catalog.stemColor : health > 30 ? '#7a9a50' : '#6a7040';
  const cc = catalog.centerColor;
  const cx = w / 2;

  if (stage === 'seed') {
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg">' +
      '<ellipse cx="' + cx + '" cy="' + (h-8) + '" rx="22" ry="9" fill="' + sc + '" opacity="0.6"/>' +
      '<circle cx="' + cx + '" cy="' + (h-14) + '" r="4" fill="' + sc + '"/>' +
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
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-58) + '" stroke="' + sc + '" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-16) + '" cy="' + (h-44) + '" rx="12" ry="7" fill="' + sc + '" transform="rotate(-35 ' + (cx-16) + ' ' + (h-44) + ')"/>' +
      '<ellipse cx="' + (cx+16) + '" cy="' + (h-52) + '" rx="12" ry="7" fill="' + sc + '" transform="rotate(35 ' + (cx+16) + ' ' + (h-52) + ')"/>' +
      '</svg>';
  }

  if (stage === 'budding') {
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-64) + '" stroke="' + sc + '" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-16) + '" cy="' + (h-48) + '" rx="12" ry="7" fill="' + sc + '" transform="rotate(-35 ' + (cx-16) + ' ' + (h-48) + ')"/>' +
      '<ellipse cx="' + (cx+16) + '" cy="' + (h-56) + '" rx="12" ry="7" fill="' + sc + '" transform="rotate(35 ' + (cx+16) + ' ' + (h-56) + ')"/>' +
      '<ellipse cx="' + cx + '" cy="' + (h-76) + '" rx="9" ry="13" fill="' + pd + '"/>' +
      '<ellipse cx="' + cx + '" cy="' + (h-78) + '" rx="6" ry="9" fill="' + pc + '" opacity="0.8"/>' +
      '</svg>';
  }

  if (type === 'tulip') {
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-62) + '" stroke="' + sc + '" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-16) + '" cy="' + (h-50) + '" rx="13" ry="8" fill="' + sc + '" transform="rotate(-35 ' + (cx-16) + ' ' + (h-50) + ')"/>' +
      '<ellipse cx="' + (cx+16) + '" cy="' + (h-58) + '" rx="13" ry="8" fill="' + sc + '" transform="rotate(35 ' + (cx+16) + ' ' + (h-58) + ')"/>' +
      '<ellipse cx="' + (cx-9) + '" cy="' + (h-74) + '" rx="10" ry="18" fill="' + pd + '" transform="rotate(-12 ' + (cx-9) + ' ' + (h-74) + ')"/>' +
      '<ellipse cx="' + (cx+9) + '" cy="' + (h-74) + '" rx="10" ry="18" fill="' + pd + '" transform="rotate(12 ' + (cx+9) + ' ' + (h-74) + ')"/>' +
      '<ellipse cx="' + cx + '" cy="' + (h-80) + '" rx="11" ry="20" fill="' + pc + '"/>' +
      '<ellipse cx="' + cx + '" cy="' + (h-78) + '" rx="5" ry="8" fill="' + cc + '" opacity="0.6"/>' +
      '</svg>';
  }

  if (type === 'rose') {
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-60) + '" stroke="' + sc + '" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-18) + '" cy="' + (h-48) + '" rx="14" ry="8" fill="' + sc + '" transform="rotate(-35 ' + (cx-18) + ' ' + (h-48) + ')"/>' +
      '<ellipse cx="' + (cx+18) + '" cy="' + (h-56) + '" rx="14" ry="8" fill="' + sc + '" transform="rotate(35 ' + (cx+18) + ' ' + (h-56) + ')"/>' +
      '<circle cx="' + cx + '" cy="' + (h-76) + '" r="18" fill="' + pd + '"/>' +
      '<circle cx="' + (cx-6) + '" cy="' + (h-82) + '" r="12" fill="' + pc + '"/>' +
      '<circle cx="' + (cx+6) + '" cy="' + (h-80) + '" r="10" fill="' + pd + '"/>' +
      '<circle cx="' + cx + '" cy="' + (h-86) + '" r="8" fill="' + pc + '"/>' +
      '<circle cx="' + cx + '" cy="' + (h-88) + '" r="4" fill="' + cc + '"/>' +
      '</svg>';
  }

  if (type === 'sunflower') {
    let petals = '';
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * Math.PI / 180;
      const px = cx + Math.cos(angle) * 20;
      const py = (h - 78) + Math.sin(angle) * 20;
      petals += '<ellipse cx="' + px + '" cy="' + py + '" rx="7" ry="11" fill="' + pc + '" transform="rotate(' + (i*30) + ' ' + px + ' ' + py + ')"/>';
    }
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-60) + '" stroke="' + sc + '" stroke-width="6" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-18) + '" cy="' + (h-44) + '" rx="14" ry="8" fill="' + sc + '" transform="rotate(-30 ' + (cx-18) + ' ' + (h-44) + ')"/>' +
      '<ellipse cx="' + (cx+18) + '" cy="' + (h-52) + '" rx="14" ry="8" fill="' + sc + '" transform="rotate(30 ' + (cx+18) + ' ' + (h-52) + ')"/>' +
      petals +
      '<circle cx="' + cx + '" cy="' + (h-78) + '" r="14" fill="' + pd + '"/>' +
      '<circle cx="' + cx + '" cy="' + (h-78) + '" r="9" fill="#3a1a00"/>' +
      '</svg>';
  }

  if (type === 'cherry') {
    let petals = '';
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 - 90) * Math.PI / 180;
      const px = cx + Math.cos(angle) * 14;
      const py = (h - 78) + Math.sin(angle) * 14;
      petals += '<ellipse cx="' + px + '" cy="' + py + '" rx="9" ry="12" fill="' + pc + '" transform="rotate(' + (i*72) + ' ' + px + ' ' + py + ')" opacity="0.9"/>';
    }
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + (cx-8) + '" y1="' + (h-14) + '" x2="' + (cx-8) + '" y2="' + (h-52) + '" stroke="' + sc + '" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="' + (cx+8) + '" y1="' + (h-14) + '" x2="' + (cx+8) + '" y2="' + (h-48) + '" stroke="' + sc + '" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-58) + '" stroke="' + sc + '" stroke-width="4" stroke-linecap="round"/>' +
      petals +
      '<circle cx="' + cx + '" cy="' + (h-78) + '" r="5" fill="' + cc + '"/>' +
      '</svg>';
  }

  if (type === 'lavender') {
    let spikes = '';
    for (let i = 0; i < 6; i++) {
      const y = (h - 60) - i * 8;
      const rw = 8 - i;
      spikes += '<ellipse cx="' + cx + '" cy="' + y + '" rx="' + rw + '" ry="5" fill="' + pc + '" opacity="' + (0.7 + i * 0.05) + '"/>';
      if (i < 4) {
        spikes += '<ellipse cx="' + (cx-10-i*2) + '" cy="' + (y+3) + '" rx="6" ry="4" fill="' + pd + '" opacity="0.8" transform="rotate(-30 ' + (cx-10-i*2) + ' ' + (y+3) + ')"/>';
        spikes += '<ellipse cx="' + (cx+10+i*2) + '" cy="' + (y+3) + '" rx="6" ry="4" fill="' + pd + '" opacity="0.8" transform="rotate(30 ' + (cx+10+i*2) + ' ' + (y+3) + ')"/>';
      }
    }
    return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
      '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#8a5d4b"/>' +
      '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-58) + '" stroke="' + sc + '" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx-14) + '" cy="' + (h-40) + '" rx="10" ry="6" fill="' + sc + '" transform="rotate(-30 ' + (cx-14) + ' ' + (h-40) + ')"/>' +
      '<ellipse cx="' + (cx+14) + '" cy="' + (h-46) + '" rx="10" ry="6" fill="' + sc + '" transform="rotate(30 ' + (cx+14) + ' ' + (h-46) + ')"/>' +
      spikes +
      '</svg>';
  }

  return '';
}

function drawDeadPlantSVG(w, h) {
  w = w || 70;
  h = h || 90;
  const cx = w / 2;
  return '<svg width="' + w + '" height="' + h + '" class="plant-svg" overflow="visible">' +
    '<ellipse cx="' + cx + '" cy="' + (h-6) + '" rx="22" ry="9" fill="#6a4438"/>' +
    '<line x1="' + cx + '" y1="' + (h-14) + '" x2="' + cx + '" y2="' + (h-50) + '" stroke="#5a4030" stroke-width="4" stroke-linecap="round"/>' +
    '<line x1="' + cx + '" y1="' + (h-38) + '" x2="' + (cx-16) + '" y2="' + (h-52) + '" stroke="#5a4030" stroke-width="3" stroke-linecap="round"/>' +
    '<line x1="' + cx + '" y1="' + (h-44) + '" x2="' + (cx+14) + '" y2="' + (h-56) + '" stroke="#5a4030" stroke-width="3" stroke-linecap="round"/>' +
    '</svg>' +
    '<div class="ghost-flower"><svg width="20" height="24"><circle cx="10" cy="8" r="6" fill="rgba(200,200,255,0.5)"/><ellipse cx="10" cy="20" rx="6" ry="5" fill="rgba(200,200,255,0.3)"/></svg></div>';
}

function drawWeedSVG() {
  return '<svg width="24" height="32" class="plant-svg">' +
    '<line x1="12" y1="30" x2="12" y2="10" stroke="#6a8a3a" stroke-width="3" stroke-linecap="round"/>' +
    '<ellipse cx="6" cy="18" rx="7" ry="4" fill="#7a9a4a" transform="rotate(-20 6 18)"/>' +
    '<ellipse cx="18" cy="14" rx="7" ry="4" fill="#7a9a4a" transform="rotate(20 18 14)"/>' +
    '<ellipse cx="12" cy="10" rx="6" ry="4" fill="#8aaa5a"/>' +
    '</svg>';
}
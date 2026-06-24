var beeState = {
  active: false,
  bees: [],
  shieldCount: 2,
  smokeCount: 1,
  timerInterval: null,
  attackDuration: 90,
  elapsed: 0,
  wave: 1,
  queenAlive: false,
  queenHits: 0,
  protectedCount: 0,
  onComplete: null
};

function checkBeeAttack(wave, onComplete) {
  var now = new Date();
  var hour = now.getHours();
  if (hour < 17) return;

  var today = now.toDateString();
  var last = localStorage.getItem('lastBeeAttack');
  if (last === today) return;

  if (Math.random() < 0.60) {
    localStorage.setItem('lastBeeAttack', today);
    startBeeAttack(wave, onComplete);
  }
}

function startBeeAttack(wave, onComplete) {
  wave = wave || 1;
  beeState.active = true;
  beeState.wave = wave;
  beeState.shieldCount = 2;
  beeState.smokeCount = 1;
  beeState.elapsed = 0;
  beeState.protectedCount = 0;
  beeState.onComplete = onComplete || null;
  beeState.queenAlive = wave >= 4;
  beeState.queenHits = 0;
  beeState.bees = [];

  document.getElementById('shieldCount').textContent = beeState.shieldCount;
  document.getElementById('smokeCount').textContent = beeState.smokeCount;
  document.getElementById('beeScore').textContent = '0/5';

  var screen = document.getElementById('beeScreen');
  screen.classList.add('active');

  var field = document.getElementById('beeField');
  field.innerHTML = '';

  var beeCount = Math.min(3 + wave * 2, 14);

  if (beeState.queenAlive) spawnQueenBee(field);

  for (var i = 0; i < beeCount; i++) {
    (function(delay) {
      setTimeout(function() { spawnBee(field, wave); }, delay);
    })(i * 400);
  }

  var fill = document.getElementById('beeTimerFill');
  fill.style.width = '100%';

  beeState.timerInterval = setInterval(function() {
    beeState.elapsed += 0.5;
    var pct = Math.max(0, 100 - (beeState.elapsed / beeState.attackDuration) * 100);
    fill.style.width = pct + '%';
    if (beeState.elapsed >= beeState.attackDuration) endBeeAttack(true);
  }, 500);
}

function spawnBee(field, wave) {
  var bee = document.createElement('div');
  bee.className = 'bee';

  var startX = Math.random() < 0.5 ? -50 : window.innerWidth + 50;
  var startY = Math.random() * 200;
  bee.style.left = startX + 'px';
  bee.style.top = startY + 'px';

  bee.innerHTML =
    '<div class="bee-wing-l"></div>' +
    '<div class="bee-wing-r"></div>' +
    '<div class="bee-body">' +
      '<div class="bee-stripe"></div>' +
      '<div class="bee-stripe"></div>' +
    '</div>' +
    '<div class="bee-stinger"></div>' +
    '<div class="bee-eye"></div>';

  bee.addEventListener('click', function() { swatBee(bee); });
  bee.addEventListener('touchstart', function(e) { e.preventDefault(); swatBee(bee); }, { passive: false });

  field.appendChild(bee);
  var speed = Math.max(0.4, 1.2 - wave * 0.1);
  moveBee(bee, speed, field);
  beeState.bees.push(bee);
}

function spawnQueenBee(field) {
  var queen = document.createElement('div');
  queen.className = 'bee queen-bee';
  queen.id = 'queenBee';
  queen.style.left = (window.innerWidth / 2 - 28) + 'px';
  queen.style.top = '-80px';

  queen.innerHTML =
    '<div class="queen-crown"></div>' +
    '<div class="bee-wing-l"></div>' +
    '<div class="bee-wing-r"></div>' +
    '<div class="bee-body">' +
      '<div class="bee-stripe"></div>' +
      '<div class="bee-stripe"></div>' +
      '<div class="bee-stripe"></div>' +
    '</div>' +
    '<div class="bee-stinger"></div>' +
    '<div class="bee-eye"></div>';

  queen.addEventListener('click', function() { hitQueenBee(queen, field); });
  queen.addEventListener('touchstart', function(e) { e.preventDefault(); hitQueenBee(queen, field); }, { passive: false });

  field.appendChild(queen);
  moveBee(queen, 0.6, field);
  beeState.bees.push(queen);
}

function hitQueenBee(queen, field) {
  beeState.queenHits++;
  showToast('queen bee hit ' + beeState.queenHits + '/5');
  if (beeState.queenHits >= 5) {
    queen.classList.add('bee-swatted');
    beeState.queenAlive = false;
    unlockAchievement('queenBeeKiller');
    setTimeout(function() { if (queen.parentNode) queen.remove(); }, 500);
    showToast('queen bee defeated!');
  }
}

function moveBee(bee, speed, field) {
  var x = parseFloat(bee.style.left);
  var y = parseFloat(bee.style.top);
  var vx = (Math.random() * 1.5 + 0.5) * (x < 0 ? 1 : -1) * speed;
  var vy = (Math.random() * 0.5 + 0.2) * speed;
  var ticker = 0;

  var loop = setInterval(function() {
    if (!beeState.active || !bee.parentNode) {
      clearInterval(loop);
      return;
    }
    ticker++;
    if (ticker % 80 === 0) {
      vx += (Math.random() - 0.5) * 1.5;
      vy += (Math.random() - 0.5) * 0.8;
    }
    x += vx;
    y += vy;
    if (x < -40) { x = -40; vx = Math.abs(vx); }
    if (x > window.innerWidth - 20) { x = window.innerWidth - 20; vx = -Math.abs(vx); }
    if (y < 0) { y = 0; vy = Math.abs(vy); }
    if (y > 300) { y = 300; vy = -Math.abs(vy); }
    bee.style.left = x + 'px';
    bee.style.top = y + 'px';
  }, 30);

  bee._moveLoop = loop;
}

function swatBee(bee) {
  if (bee.classList.contains('bee-swatted')) return;
  bee.classList.add('bee-swatted');
  if (bee._moveLoop) clearInterval(bee._moveLoop);
  beeState.protectedCount++;
  document.getElementById('beeScore').textContent = beeState.protectedCount + '/5';
  setTimeout(function() {
    if (bee.parentNode) bee.remove();
    beeState.bees = beeState.bees.filter(function(b) { return b !== bee; });
    var remaining = document.querySelectorAll('.bee:not(.bee-swatted)').length;
    if (remaining === 0 && beeState.active) endBeeAttack(true);
  }, 500);
}

function useShield() {
  if (beeState.shieldCount <= 0) { showToast('no shields left'); return; }
  beeState.shieldCount--;
  document.getElementById('shieldCount').textContent = beeState.shieldCount;
  var bees = document.querySelectorAll('.bee:not(.bee-swatted)');
  bees.forEach(function(bee) {
    bee.style.opacity = '0.4';
    setTimeout(function() { if (bee.parentNode) bee.style.opacity = '1'; }, 3000);
  });
  showToast('shield activated');
}

function useSmoke() {
  if (beeState.smokeCount <= 0) { showToast('no smoke left'); return; }
  beeState.smokeCount--;
  document.getElementById('smokeCount').textContent = beeState.smokeCount;
  var field = document.getElementById('beeField');
  var smoke = document.createElement('div');
  smoke.className = 'smoke-puff';
  smoke.style.cssText = 'left:50%;top:50%;';
  field.appendChild(smoke);
  setTimeout(function() { if (smoke.parentNode) smoke.remove(); }, 1500);
  showToast('bees scattered');
}

function endBeeAttack(survived) {
  if (!beeState.active) return;
  beeState.active = false;
  clearInterval(beeState.timerInterval);
  var screen = document.getElementById('beeScreen');
  screen.classList.remove('active');
  if (survived) {
    unlockAchievement('beeSurvivor');
    showToast('garden saved! your flowers are safe');
  } else {
    showToast('some flowers were damaged');
  }
  if (beeState.onComplete) beeState.onComplete(survived);
}
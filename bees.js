var beeState = {
  active: false, bees: [], shieldCount: 2, smokeCount: 1,
  timerInterval: null, attackDuration: 90, elapsed: 0,
  wave: 1, queenAlive: false, queenHits: 0, protectedCount: 0, onComplete: null
};

function checkBeeAttack(wave, onComplete) {
  var now = new Date();
  if (now.getHours() < 17) return;
  var today = now.toDateString();
  if (localStorage.getItem('lastBeeAttack') === today) return;
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
  document.getElementById('beeScreen').classList.add('active');

  var field = document.getElementById('beeField');
  field.innerHTML = '';
  var beeCount = Math.min(3 + wave * 2, 14);
  if (beeState.queenAlive) spawnQueenBee(field);
  for (var i = 0; i < beeCount; i++) {
    (function(delay) { setTimeout(function() { spawnBee(field, wave); }, delay); })(i * 400);
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
  var sx = Math.random() < 0.5 ? -50 : window.innerWidth + 50;
  bee.style.left = sx + 'px';
  bee.style.top = (Math.random() * 200) + 'px';
  bee.innerHTML = '<div class="bee-wing-l"></div><div class="bee-wing-r"></div><div class="bee-body"><div class="bee-stripe"></div><div class="bee-stripe"></div></div><div class="bee-stinger"></div><div class="bee-eye"></div>';
  bee.addEventListener('click', function() { swatBee(bee); });
  bee.addEventListener('touchstart', function(e) { e.preventDefault(); swatBee(bee); }, { passive: false });
  field.appendChild(bee);
  moveBee(bee, Math.max(0.4, 1.2 - wave * 0.1));
  beeState.bees.push(bee);
}

function spawnQueenBee(field) {
  var q = document.createElement('div');
  q.className = 'bee queen-bee';
  q.style.left = (window.innerWidth / 2 - 28) + 'px';
  q.style.top = '-80px';
  q.innerHTML = '<div class="queen-crown"></div><div class="bee-wing-l"></div><div class="bee-wing-r"></div><div class="bee-body"><div class="bee-stripe"></div><div class="bee-stripe"></div></div><div class="bee-stinger"></div><div class="bee-eye"></div>';
  q.addEventListener('click', function() { hitQueenBee(q, field); });
  q.addEventListener('touchstart', function(e) { e.preventDefault(); hitQueenBee(q, field); }, { passive: false });
  field.appendChild(q);
  moveBee(q, 0.6);
  beeState.bees.push(q);
}

function hitQueenBee(queen, field) {
  beeState.queenHits++;
  showToast('queen bee hit ' + beeState.queenHits + '/5');
  if (beeState.queenHits >= 5) {
    queen.classList.add('bee-swatted');
    beeState.queenAlive = false;
    unlockAchievement('queenBeeKiller');
    setTimeout(function() { if (queen.parentNode) queen.remove(); }, 500);
  }
}

function moveBee(bee, speed) {
  var x = parseFloat(bee.style.left);
  var y = parseFloat(bee.style.top);
  var vx = (Math.random() * 1.5 + 0.5) * (x < 0 ? 1 : -1) * speed;
  var vy = (Math.random() * 0.5 + 0.2) * speed;
  var t = 0;
  var loop = setInterval(function() {
    if (!beeState.active || !bee.parentNode) { clearInterval(loop); return; }
    t++;
    if (t % 80 === 0) { vx += (Math.random() - 0.5) * 1.5; vy += (Math.random() - 0.5) * 0.8; }
    x += vx; y += vy;
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
  setTimeout(function() {
    if (bee.parentNode) bee.remove();
    beeState.bees = beeState.bees.filter(function(b) { return b !== bee; });
    var rem = document.querySelectorAll('.bee:not(.bee-swatted)').length;
    if (rem === 0 && beeState.active) endBeeAttack(true);
  }, 500);
}

function useShield() {
  if (beeState.shieldCount <= 0) { showToast('no shields left'); return; }
  beeState.shieldCount--;
  document.getElementById('shieldCount').textContent = beeState.shieldCount;
  document.querySelectorAll('.bee:not(.bee-swatted)').forEach(function(b) {
    b.style.opacity = '0.4';
    setTimeout(function() { if (b.parentNode) b.style.opacity = '1'; }, 3000);
  });
  showToast('shield activated');
}

function useSmoke() {
  if (beeState.smokeCount <= 0) { showToast('no smoke left'); return; }
  beeState.smokeCount--;
  document.getElementById('smokeCount').textContent = beeState.smokeCount;
  var s = document.createElement('div');
  s.className = 'smoke-puff';
  s.style.cssText = 'left:50%;top:50%;';
  document.getElementById('beeField').appendChild(s);
  setTimeout(function() { if (s.parentNode) s.remove(); }, 1500);
  showToast('bees scattered');
}

function endBeeAttack(survived) {
  if (!beeState.active) return;
  beeState.active = false;
  clearInterval(beeState.timerInterval);
  document.getElementById('beeScreen').classList.remove('active');
  if (survived) {
    unlockAchievement('beeSurvivor');
    showToast('garden saved!');
  }
  if (beeState.onComplete) beeState.onComplete(survived);
}

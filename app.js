function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
}

function enterGarden() {
  showScreen('gardenScreen');
  initGarden();
}

function openNotes() {
  if (typeof renderNotesScreen === 'function') renderNotesScreen();
  showScreen('notesScreen');
}

function closeNotes() { showScreen('gardenScreen'); }

function showToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(function() { toast.classList.remove('show'); }, 2200);
}

function updateClock() {
  var now = new Date();
  var h = now.getHours().toString().padStart(2, '0');
  var m = now.getMinutes().toString().padStart(2, '0');
  var el = document.getElementById('clock');
  if (el) el.textContent = h + ':' + m;
}

setInterval(updateClock, 1000);
updateClock();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(function() {});
}

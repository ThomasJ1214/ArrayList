const setupPanel = document.getElementById('setupPanel');
const mapSection = document.getElementById('mapSection');
const beginGameBtn = document.getElementById('beginGame');
const loadSaveBtn = document.getElementById('loadSave');
const saveGameBtn = document.getElementById('saveGame');
const player = document.getElementById('player');
const map = document.getElementById('map');
const trail = document.getElementById('trail');
const npcText = document.getElementById('npcText');
const playerNameLabel = document.getElementById('playerNameLabel');
const xpLabel = document.getElementById('xpLabel');

const SAVE_KEY = 'arraylistAdventureSaveV4';
const LEGACY_SAVE_KEYS = ['arraylistAdventureSaveV3', 'arraylistAdventureSaveV2'];
const playerState = {
  name: 'Guest',
  xp: 0,
  tint: 'none',
  unlocked: 1,
  pos: { x: 80, y: 470 },
  completed: {}
};
const nodes = [];

function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(playerState));
}

function loadState() {
  for (const key of [SAVE_KEY, ...LEGACY_SAVE_KEYS]) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    Object.assign(playerState, JSON.parse(raw));
    if (!playerState.completed) playerState.completed = {};
    if (key !== SAVE_KEY) saveState();
    return true;
  }
  return false;
}

function renderHUD() {
  playerNameLabel.textContent = playerState.name;
  xpLabel.textContent = playerState.xp;
  player.style.filter = playerState.tint;
}

function setDirection(direction) {
  const row = { down: 0, left: 1, right: 2, up: 3 }[direction];
  player.style.backgroundPositionY = `${-row * 48}px`;
}

function renderPlayer() {
  player.style.left = `${playerState.pos.x}px`;
  player.style.top = `${playerState.pos.y}px`;
}

function buildTrail() {
  const points = [
    { x: 80, y: 470 }, { x: 190, y: 430 }, { x: 300, y: 390 }, { x: 420, y: 340 },
    { x: 540, y: 300 }, { x: 660, y: 250 }, { x: 780, y: 200 }, { x: 900, y: 150 }
  ];

  LEVELS.forEach((level, i) => {
    const point = points[i] || points[points.length - 1];
    nodes.push({ ...point, unlocked: i < playerState.unlocked });

    const node = document.createElement('button');
    node.className = 'node';
    node.style.left = `${point.x}px`;
    node.style.top = `${point.y}px`;
    node.textContent = String(level.id);
    node.disabled = i >= playerState.unlocked;
    node.title = level.title;
    node.addEventListener('click', () => goToLevel(i));
    trail.appendChild(node);
  });
}

function nearUnlockedNode() {
  return nodes.findIndex((n) => Math.hypot(n.x - playerState.pos.x, n.y - playerState.pos.y) < 30 && n.unlocked);
}

function goToLevel(index) {
  saveState();
  window.location.href = `level.html?level=${index}`;
}

function startAdventure(fromSave = false) {
  if (!fromSave) {
    playerState.name = document.getElementById('username').value.trim() || 'Guest';
    playerState.tint = document.getElementById('avatarColor').value;
    saveState();
  }
  renderHUD();
  renderPlayer();
  setupPanel.classList.add('hidden');
  mapSection.classList.remove('hidden');
  map.focus();
}

beginGameBtn.addEventListener('click', () => startAdventure(false));
loadSaveBtn.addEventListener('click', () => {
  const ok = loadState();
  if (ok) startAdventure(true);
  else npcText.textContent = 'No save found yet. Start a new journey.';
});
saveGameBtn.addEventListener('click', () => {
  saveState();
  saveGameBtn.textContent = 'Saved';
  setTimeout(() => { saveGameBtn.textContent = 'Save'; }, 900);
});

document.querySelectorAll('.npc').forEach((npc) => {
  npc.addEventListener('click', () => {
    npcText.textContent = npc.dataset.text;
  });
});

window.addEventListener('keydown', (event) => {
  if (mapSection.classList.contains('hidden')) return;

  const key = event.key.toLowerCase();
  const step = 14;
  let moved = false;

  if (key === 'w') { playerState.pos.y -= step; setDirection('up'); moved = true; }
  if (key === 's') { playerState.pos.y += step; setDirection('down'); moved = true; }
  if (key === 'a') { playerState.pos.x -= step; setDirection('left'); moved = true; }
  if (key === 'd') { playerState.pos.x += step; setDirection('right'); moved = true; }
  if (!moved) return;

  player.classList.add('walk');
  clearTimeout(window.walkTimer);
  window.walkTimer = setTimeout(() => player.classList.remove('walk'), 220);

  playerState.pos.x = Math.max(20, Math.min(930, playerState.pos.x));
  playerState.pos.y = Math.max(40, Math.min(520, playerState.pos.y));
  renderPlayer();

  const nodeIndex = nearUnlockedNode();
  if (nodeIndex >= 0) goToLevel(nodeIndex);
});

buildTrail();
renderHUD();
renderPlayer();

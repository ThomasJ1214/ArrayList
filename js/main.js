const setupPanel = document.getElementById('setupPanel');
const mapSection = document.getElementById('mapSection');
const beginGameBtn = document.getElementById('beginGame');
const loadSaveBtn = document.getElementById('loadSave');
const saveGameBtn = document.getElementById('saveGame');
const player = document.getElementById('player');
const map = document.getElementById('map');
const trail = document.getElementById('trail');
const playerNameLabel = document.getElementById('playerNameLabel');
const xpLabel = document.getElementById('xpLabel');

const levelDialog = document.getElementById('levelDialog');
const levelTitle = document.getElementById('levelTitle');
const learnText = document.getElementById('learnText');
const codeBox = document.getElementById('codeBox');
const runCode = document.getElementById('runCode');
const codeFeedback = document.getElementById('codeFeedback');
const miniGamePrompt = document.getElementById('miniGamePrompt');
const miniGameOptions = document.getElementById('miniGameOptions');
const miniGameFeedback = document.getElementById('miniGameFeedback');
const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const closeLevel = document.getElementById('closeLevel');

const puzzleBank = document.getElementById('puzzleBank');
const puzzleSlots = document.getElementById('puzzleSlots');
const checkPuzzle = document.getElementById('checkPuzzle');
const puzzleFeedback = document.getElementById('puzzleFeedback');

const bossBattle = document.getElementById('bossBattle');
const bossName = document.getElementById('bossName');
const bossHp = document.getElementById('bossHp');
const bossPrompt = document.getElementById('bossPrompt');
const bossOptions = document.getElementById('bossOptions');
const bossFeedback = document.getElementById('bossFeedback');

const npcDialog = document.getElementById('npcDialog');
const npcText = document.getElementById('npcText');
document.querySelectorAll('.npc').forEach((npc) => {
  npc.addEventListener('click', () => {
    npcText.textContent = npc.dataset.text;
    npcDialog.showModal();
  });
});
document.getElementById('closeNpc').addEventListener('click', () => npcDialog.close());

const playerState = { name: 'Guest', xp: 0, tint: 'none', unlocked: 1, pos: { x: 80, y: 470 } };
const SAVE_KEY = 'arraylistAdventureSaveV2';
let currentLevel = 0;
let nodes = [];
let bossState = { hp: 0, step: 0 };

function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(playerState));
}

function loadState() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  Object.assign(playerState, JSON.parse(raw));
  return true;
}

function setPlayerSpriteRow(direction) {
  const row = { down: 0, left: 1, right: 2, up: 3 }[direction];
  player.style.backgroundPositionY = `${-row * 48}px`;
}

function renderHUD() {
  playerNameLabel.textContent = playerState.name;
  xpLabel.textContent = playerState.xp;
  player.style.filter = playerState.tint;
}

function buildTrail() {
  const points = [
    { x: 80, y: 470 }, { x: 200, y: 420 }, { x: 320, y: 360 }, { x: 430, y: 300 },
    { x: 540, y: 290 }, { x: 660, y: 240 }, { x: 760, y: 180 }, { x: 860, y: 120 }
  ];
  LEVELS.forEach((_, i) => {
    nodes.push({ ...points[i], unlocked: i < playerState.unlocked });
    const node = document.createElement('button');
    node.className = 'node';
    node.style.left = `${points[i].x}px`;
    node.style.top = `${points[i].y}px`;
    node.textContent = i + 1;
    node.disabled = i >= playerState.unlocked;
    node.addEventListener('click', () => openLevel(i));
    trail.appendChild(node);
  });
}

function renderPlayer() {
  player.style.left = `${playerState.pos.x}px`;
  player.style.top = `${playerState.pos.y}px`;
}

function nearNode() {
  return nodes.findIndex((n) => Math.hypot(n.x - playerState.pos.x, n.y - playerState.pos.y) < 32 && n.unlocked);
}

function unlockNextLevel(i) {
  if (!nodes[i + 1]) return;
  nodes[i + 1].unlocked = true;
  trail.children[i + 1].disabled = false;
  playerState.unlocked = Math.max(playerState.unlocked, i + 2);
}

function startBoss(level) {
  bossBattle.classList.remove('hidden');
  bossName.textContent = level.boss.name;
  bossState.hp = level.boss.hp;
  bossState.step = 0;
  bossHp.textContent = bossState.hp;
  renderBossQuestion(level);
}

function renderBossQuestion(level) {
  const q = level.boss.attacks[bossState.step];
  bossPrompt.textContent = q.prompt;
  bossOptions.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = opt;
    btn.onclick = () => {
      if (idx === q.answer) {
        bossState.hp -= 1;
        bossState.step += 1;
        bossHp.textContent = bossState.hp;
        bossFeedback.textContent = 'Direct hit!';
        if (bossState.hp <= 0 || bossState.step >= level.boss.attacks.length) {
          bossFeedback.textContent = `Boss defeated! +40 XP`;
          playerState.xp += 40;
          renderHUD();
          unlockNextLevel(currentLevel);
          saveState();
        } else {
          renderBossQuestion(level);
        }
      } else {
        bossFeedback.textContent = 'The boss resisted. Try again.';
      }
    };
    bossOptions.appendChild(btn);
  });
}

function createDragToken(text) {
  const token = document.createElement('button');
  token.className = 'token';
  token.textContent = text;
  token.draggable = true;
  token.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', text));
  return token;
}

function renderPuzzle(level) {
  puzzleBank.innerHTML = '';
  puzzleSlots.innerHTML = '';
  level.puzzleBank.forEach((piece) => puzzleBank.appendChild(createDragToken(piece)));

  level.puzzleTemplate.forEach(() => {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.addEventListener('dragover', (e) => e.preventDefault());
    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.textContent = e.dataTransfer.getData('text/plain');
      slot.classList.add('filled');
    });
    puzzleSlots.appendChild(slot);
  });
}

function openLevel(i) {
  currentLevel = i;
  const level = LEVELS[i];
  levelTitle.textContent = level.title;
  learnText.textContent = level.learn;
  codeBox.value = '';
  codeFeedback.textContent = '';
  miniGameFeedback.textContent = '';
  quizFeedback.textContent = '';
  puzzleFeedback.textContent = '';
  bossFeedback.textContent = '';

  renderPuzzle(level);

  miniGamePrompt.textContent = level.miniPrompt;
  miniGameOptions.innerHTML = '';
  level.miniChoices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = choice;
    btn.onclick = () => {
      if (idx === level.miniAnswer) {
        miniGameFeedback.textContent = 'Nice! +10 XP';
        playerState.xp += 10;
        renderHUD();
      } else miniGameFeedback.textContent = 'Miss! Try again.';
    };
    miniGameOptions.appendChild(btn);
  });

  quizQuestion.textContent = level.quizQ;
  quizOptions.innerHTML = '';
  level.quizChoices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = choice;
    btn.onclick = () => {
      const correct = idx === level.quizAnswer;
      quizFeedback.textContent = correct ? 'Quiz clear! +20 XP' : 'Not yet. Re-read and retry.';
      if (correct) {
        playerState.xp += 20;
        renderHUD();
        unlockNextLevel(i);
        if (level.boss) startBoss(level);
        saveState();
      }
    };
    quizOptions.appendChild(btn);
  });

  if (!level.boss) bossBattle.classList.add('hidden');
  levelDialog.showModal();
}

runCode.addEventListener('click', () => {
  const level = LEVELS[currentLevel];
  const missing = level.codeMustInclude.filter((token) => !codeBox.value.includes(token));
  if (missing.length === 0) {
    codeFeedback.textContent = 'Compiler rune glows: all required concepts detected. +15 XP';
    playerState.xp += 15;
    renderHUD();
  } else {
    codeFeedback.textContent = `Still missing: ${missing.join(', ')}`;
  }
});

checkPuzzle.addEventListener('click', () => {
  const level = LEVELS[currentLevel];
  const attempt = [...puzzleSlots.children].map((slot) => slot.textContent.trim());
  const ok = JSON.stringify(attempt) === JSON.stringify(level.puzzleTemplate);
  puzzleFeedback.textContent = ok ? 'Puzzle solved! +15 XP' : 'Puzzle order is off. Rearrange and retry.';
  if (ok) {
    playerState.xp += 15;
    renderHUD();
  }
});

closeLevel.addEventListener('click', () => levelDialog.close());

function startAdventure(fromSave = false) {
  if (!fromSave) {
    playerState.name = document.getElementById('username').value.trim() || 'Guest';
    playerState.tint = document.getElementById('avatarColor').value;
    saveState();
  }
  renderHUD();
  setupPanel.classList.add('hidden');
  mapSection.classList.remove('hidden');
  renderPlayer();
  map.focus();
}

beginGameBtn.addEventListener('click', () => startAdventure(false));
loadSaveBtn.addEventListener('click', () => {
  const ok = loadState();
  if (ok) startAdventure(true);
});
saveGameBtn.addEventListener('click', () => {
  saveState();
  saveGameBtn.textContent = 'Saved!';
  setTimeout(() => { saveGameBtn.textContent = 'Save Game'; }, 1000);
});

window.addEventListener('keydown', (e) => {
  if (mapSection.classList.contains('hidden')) return;
  const key = e.key.toLowerCase();
  const step = 14;
  let moved = false;
  if (key === 'w') { playerState.pos.y -= step; setPlayerSpriteRow('up'); moved = true; }
  if (key === 's') { playerState.pos.y += step; setPlayerSpriteRow('down'); moved = true; }
  if (key === 'a') { playerState.pos.x -= step; setPlayerSpriteRow('left'); moved = true; }
  if (key === 'd') { playerState.pos.x += step; setPlayerSpriteRow('right'); moved = true; }

  if (!moved) return;
  player.classList.add('walk');
  clearTimeout(window.walkTimer);
  window.walkTimer = setTimeout(() => player.classList.remove('walk'), 220);

  playerState.pos.x = Math.max(20, Math.min(920, playerState.pos.x));
  playerState.pos.y = Math.max(40, Math.min(520, playerState.pos.y));
  renderPlayer();

  const idx = nearNode();
  if (idx >= 0) openLevel(idx);
});

buildTrail();
renderHUD();
renderPlayer();

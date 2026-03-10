const playerNameLabel = document.getElementById('playerNameLabel');
const xpLabel = document.getElementById('xpLabel');
const levelHeader = document.getElementById('levelHeader');
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
const returnMap = document.getElementById('returnMap');
const saveGame = document.getElementById('saveGame');

const SAVE_KEY = 'arraylistAdventureSaveV3';
const DEFAULT_STATE = { name: 'Guest', xp: 0, tint: 'none', unlocked: 1, pos: { x: 80, y: 470 } };
const playerState = { ...DEFAULT_STATE };
const bossState = { hp: 0, step: 0 };

const params = new URLSearchParams(window.location.search);
const levelIndex = Math.max(0, Math.min(LEVELS.length - 1, Number(params.get('level') || 0)));
const level = LEVELS[levelIndex];

function saveState() { localStorage.setItem(SAVE_KEY, JSON.stringify(playerState)); }
function loadState() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  Object.assign(playerState, JSON.parse(raw));
}
function renderHUD() {
  playerNameLabel.textContent = playerState.name;
  xpLabel.textContent = playerState.xp;
}

function addXP(amount) {
  playerState.xp += amount;
  renderHUD();
  saveState();
}

function unlockNextLevel() {
  playerState.unlocked = Math.max(playerState.unlocked, levelIndex + 2);
  saveState();
}

function createToken(value) {
  const token = document.createElement('button');
  token.className = 'token';
  token.textContent = value;
  token.draggable = true;
  token.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', value);
  });
  return token;
}

function renderPuzzle() {
  puzzleBank.innerHTML = '';
  puzzleSlots.innerHTML = '';
  level.puzzleBank.forEach((piece) => puzzleBank.appendChild(createToken(piece)));
  level.puzzleTemplate.forEach(() => {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.addEventListener('dragover', (event) => event.preventDefault());
    slot.addEventListener('drop', (event) => {
      event.preventDefault();
      slot.textContent = event.dataTransfer.getData('text/plain');
      slot.classList.add('filled');
    });
    puzzleSlots.appendChild(slot);
  });
}

function renderBossQuestion() {
  const q = level.boss.attacks[bossState.step];
  bossPrompt.textContent = q.prompt;
  bossOptions.innerHTML = '';
  q.options.forEach((option, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = option;
    btn.onclick = () => {
      if (idx !== q.answer) {
        bossFeedback.textContent = 'The boss blocks that move. Try again.';
        return;
      }
      bossState.hp -= 1;
      bossState.step += 1;
      bossHp.textContent = bossState.hp;
      if (bossState.hp <= 0 || bossState.step >= level.boss.attacks.length) {
        bossFeedback.textContent = 'Boss defeated! +40 XP';
        addXP(40);
        unlockNextLevel();
      } else {
        bossFeedback.textContent = 'Direct hit!';
        renderBossQuestion();
      }
    };
    bossOptions.appendChild(btn);
  });
}

function startBoss() {
  if (!level.boss) {
    bossBattle.classList.add('hidden');
    return;
  }
  bossBattle.classList.remove('hidden');
  bossName.textContent = level.boss.name;
  bossState.hp = level.boss.hp;
  bossState.step = 0;
  bossHp.textContent = bossState.hp;
  renderBossQuestion();
}

function initPage() {
  loadState();
  renderHUD();
  levelHeader.textContent = level.title;
  learnText.textContent = level.learn;
  renderPuzzle();

  miniGamePrompt.textContent = level.miniPrompt;
  level.miniChoices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = choice;
    btn.onclick = () => {
      if (idx === level.miniAnswer) {
        miniGameFeedback.textContent = 'Correct! +10 XP';
        addXP(10);
      } else {
        miniGameFeedback.textContent = 'Try another answer.';
      }
    };
    miniGameOptions.appendChild(btn);
  });

  quizQuestion.textContent = level.quizQ;
  level.quizChoices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = choice;
    btn.onclick = () => {
      const correct = idx === level.quizAnswer;
      quizFeedback.textContent = correct ? 'Quiz passed! +20 XP' : 'Incorrect. Study and retry.';
      if (!correct) return;
      addXP(20);
      unlockNextLevel();
      startBoss();
    };
    quizOptions.appendChild(btn);
  });

  startBoss();
}

runCode.addEventListener('click', () => {
  const missing = level.codeMustInclude.filter((token) => !codeBox.value.includes(token));
  if (missing.length === 0) {
    codeFeedback.textContent = 'Great snippet. +15 XP';
    addXP(15);
  } else {
    codeFeedback.textContent = `Missing: ${missing.join(', ')}`;
  }
});

checkPuzzle.addEventListener('click', () => {
  const attempt = [...puzzleSlots.children].map((slot) => slot.textContent.trim());
  const pass = JSON.stringify(attempt) === JSON.stringify(level.puzzleTemplate);
  puzzleFeedback.textContent = pass ? 'Puzzle solved! +15 XP' : 'Not quite. Reorder your tokens.';
  if (pass) addXP(15);
});

returnMap.addEventListener('click', () => window.location.href = 'game.html');
saveGame.addEventListener('click', () => { saveState(); saveGame.textContent = 'Saved'; setTimeout(() => saveGame.textContent = 'Save Progress', 900); });

initPage();

const playerNameLabel = document.getElementById('playerNameLabel');
const xpLabel = document.getElementById('xpLabel');
const levelHeader = document.getElementById('levelHeader');
const learnText = document.getElementById('learnText');

const codeBox = document.getElementById('codeBox');
const runCode = document.getElementById('runCode');
const codeFeedback = document.getElementById('codeFeedback');

const puzzleBank = document.getElementById('puzzleBank');
const puzzleSlots = document.getElementById('puzzleSlots');
const checkPuzzle = document.getElementById('checkPuzzle');
const puzzleFeedback = document.getElementById('puzzleFeedback');

const miniGamePrompt = document.getElementById('miniGamePrompt');
const miniGameOptions = document.getElementById('miniGameOptions');
const miniGameFeedback = document.getElementById('miniGameFeedback');

const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');

const bossBattle = document.getElementById('bossBattle');
const bossName = document.getElementById('bossName');
const bossHp = document.getElementById('bossHp');
const bossPrompt = document.getElementById('bossPrompt');
const bossOptions = document.getElementById('bossOptions');
const bossFeedback = document.getElementById('bossFeedback');

const returnMap = document.getElementById('returnMap');
const saveGame = document.getElementById('saveGame');

const SAVE_KEY = 'arraylistAdventureSaveV4';
const LEGACY_SAVE_KEYS = ['arraylistAdventureSaveV3', 'arraylistAdventureSaveV2'];
const playerState = { name: 'Guest', xp: 0, unlocked: 1, completed: {} };
const bossState = { hp: 0, step: 0, done: false };

const params = new URLSearchParams(window.location.search);
const levelIndex = Math.max(0, Math.min(LEVELS.length - 1, Number(params.get('level') || 0)));
const level = LEVELS[levelIndex];
const stageKey = `level-${level.id}`;

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
    return;
  }
}

function getStageProgress() {
  if (!playerState.completed[stageKey]) {
    playerState.completed[stageKey] = {
      code: false,
      puzzle: false,
      mini: false,
      quiz: false,
      boss: false
    };
  }
  return playerState.completed[stageKey];
}

function renderHUD() {
  playerNameLabel.textContent = playerState.name;
  xpLabel.textContent = playerState.xp;
}

function awardXP(amount, part) {
  const progress = getStageProgress();
  if (progress[part]) return false;
  progress[part] = true;
  playerState.xp += amount;
  renderHUD();
  saveState();
  return true;
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
    btn.addEventListener('click', () => {
      if (idx !== q.answer) {
        bossFeedback.textContent = 'That move misses. Try another.';
        return;
      }

      bossState.hp -= 1;
      bossState.step += 1;
      bossHp.textContent = bossState.hp;

      if (bossState.hp <= 0 || bossState.step >= level.boss.attacks.length) {
        bossState.done = true;
        const gained = awardXP(40, 'boss');
        bossFeedback.textContent = gained ? 'Boss cleared! +40 XP' : 'Boss already cleared.';
        unlockNextLevel();
        return;
      }

      bossFeedback.textContent = 'Direct hit!';
      renderBossQuestion();
    });
    bossOptions.appendChild(btn);
  });
}

function maybeStartBoss() {
  if (!level.boss) {
    bossBattle.classList.add('hidden');
    return;
  }

  const progress = getStageProgress();
  if (!progress.quiz) {
    bossBattle.classList.remove('hidden');
    bossName.textContent = level.boss.name;
    bossHp.textContent = level.boss.hp;
    bossPrompt.textContent = 'Pass the quiz to unlock this boss battle.';
    bossOptions.innerHTML = '';
    bossFeedback.textContent = '';
    return;
  }

  bossBattle.classList.remove('hidden');
  bossName.textContent = level.boss.name;
  bossState.hp = level.boss.hp;
  bossState.step = 0;
  bossState.done = false;
  bossHp.textContent = bossState.hp;
  bossFeedback.textContent = '';
  renderBossQuestion();
}

function initPage() {
  loadState();
  const progress = getStageProgress();
  renderHUD();

  levelHeader.textContent = level.title;
  learnText.textContent = level.learn;
  renderPuzzle();

  miniGamePrompt.textContent = level.miniPrompt;
  miniGameOptions.innerHTML = '';
  level.miniChoices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = choice;
    btn.addEventListener('click', () => {
      if (idx !== level.miniAnswer) {
        miniGameFeedback.textContent = 'Try another answer.';
        return;
      }
      const gained = awardXP(10, 'mini');
      miniGameFeedback.textContent = gained ? 'Correct! +10 XP' : 'Already completed.';
    });
    miniGameOptions.appendChild(btn);
  });

  quizQuestion.textContent = level.quizQ;
  quizOptions.innerHTML = '';
  level.quizChoices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = choice;
    btn.addEventListener('click', () => {
      if (idx !== level.quizAnswer) {
        quizFeedback.textContent = 'Incorrect. Review and retry.';
        return;
      }
      const gained = awardXP(20, 'quiz');
      quizFeedback.textContent = gained ? 'Quiz passed! +20 XP' : 'Quiz already completed.';
      unlockNextLevel();
      maybeStartBoss();
    });
    quizOptions.appendChild(btn);
  });

  codeFeedback.textContent = progress.code ? 'Code check already completed.' : '';
  puzzleFeedback.textContent = progress.puzzle ? 'Puzzle already completed.' : '';
  miniGameFeedback.textContent = progress.mini ? 'Mini challenge already completed.' : '';
  quizFeedback.textContent = progress.quiz ? 'Quiz already completed.' : '';

  maybeStartBoss();
}

runCode.addEventListener('click', () => {
  const missing = level.codeMustInclude.filter((token) => !codeBox.value.includes(token));
  if (missing.length) {
    codeFeedback.textContent = `Missing: ${missing.join(', ')}`;
    return;
  }
  const gained = awardXP(15, 'code');
  codeFeedback.textContent = gained ? 'Valid snippet! +15 XP' : 'Code check already completed.';
});

checkPuzzle.addEventListener('click', () => {
  const attempt = [...puzzleSlots.children].map((slot) => slot.textContent.trim());
  const pass = JSON.stringify(attempt) === JSON.stringify(level.puzzleTemplate);
  if (!pass) {
    puzzleFeedback.textContent = 'Not quite. Reorder the tokens and try again.';
    return;
  }
  const gained = awardXP(15, 'puzzle');
  puzzleFeedback.textContent = gained ? 'Puzzle solved! +15 XP' : 'Puzzle already completed.';
});

returnMap.addEventListener('click', () => {
  window.location.href = 'game.html';
});

saveGame.addEventListener('click', () => {
  saveState();
  saveGame.textContent = 'Saved';
  setTimeout(() => { saveGame.textContent = 'Save Progress'; }, 900);
});

initPage();

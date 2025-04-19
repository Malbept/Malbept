// game.js
import { database } from './firebase.js';
import { ref, get, set, update } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js';
import { updateUI, updateTasks } from './ui.js';
import { getTranslation } from './translations.js';
import { handleTap } from './ui.js';

export let gameState = {
  score: 0,
  clicks: 0,
  energy: 100,
  maxEnergy: 100,
  level: 1,
  progress: 0,
  clickMultiplier: 1,
  autoClickers: [],
  tasks: [],
  skins: [],
  boosts: [],
  activeBoosts: []
};

const ENERGY_REGEN_RATE = 1;
const ENERGY_COST_PER_CLICK = 1;
const LEVEL_UP_THRESHOLD = 100;

function updateProgress() {
  gameState.progress = (gameState.score % LEVEL_UP_THRESHOLD) / LEVEL_UP_THRESHOLD * 100;
  if (gameState.score >= LEVEL_UP_THRESHOLD * gameState.level) {
    gameState.level += 1;
    gameState.progress = 0;
    gameState.maxEnergy += 10;
    gameState.energy = gameState.maxEnergy;
  }
}

function updateTasksProgress(type) {
  gameState.tasks.forEach(task => {
    if (!task.completed && task.type === type) {
      task.progress = type === 'clicks' ? gameState.clicks : gameState.score;
      if (task.progress >= task.target) {
        task.completed = true;
      }
    }
  });
  updateTasks();
}

export function buyClickMultiplier(id, cost, multiplier) {
  if (gameState.score >= cost) {
    gameState.score -= cost;
    gameState.clickMultiplier *= multiplier;
    updateTasksProgress('upgrades');
    saveGameState();
    playSound('buy');
    updateUI();
  } else {
    alert(getTranslation('not_enough_points'));
  }
}

export function buyAutoClicker(id, cost, rate) {
  if (gameState.score >= cost) {
    gameState.score -= cost;
    gameState.autoClickers.push({ id, rate });
    updateTasksProgress('upgrades');
    saveGameState();
    playSound('buy');
    updateUI();
  } else {
    alert(getTranslation('not_enough_points'));
  }
}

export function buyEnergyMax(id, cost, amount) {
  if (gameState.score >= cost) {
    gameState.score -= cost;
    gameState.maxEnergy += amount;
    gameState.energy = gameState.maxEnergy;
    updateTasksProgress('upgrades');
    saveGameState();
    playSound('buy');
    updateUI();
  } else {
    alert(getTranslation('not_enough_points'));
  }
}

export function buySkin(id, cost) {
  if (gameState.score >= cost) {
    gameState.score -= cost;
    gameState.skins.push(id);
    applySkin(id);
    updateTasksProgress('upgrades');
    saveGameState();
    playSound('buy');
    updateUI();
  } else {
    alert(getTranslation('not_enough_points'));
  }
}

export function buyBoost(id, cost, multiplier, duration) {
  if (gameState.score >= cost) {
    if (gameState.activeBoosts.some(boost => boost.id === id)) {
      alert(getTranslation('boost_active'));
      return;
    }
    gameState.score -= cost;
    gameState.activeBoosts.push({ id, multiplier, expires: Date.now() + duration * 1000 });
    updateTasksProgress('upgrades');
    saveGameState();
    playSound('buy');
    updateUI();
  } else {
    alert(getTranslation('not_enough_points'));
  }
}

function applySkin(skin) {
  const tapButton = document.getElementById('tap-button');
  if (tapButton) {
    tapButton.classList.remove('vyshyvanka', 'cossack', 'neon', 'cyber');
    tapButton.classList.add(skin);
  }
}

function playSound(type) {
  const sound = document.getElementById(`${type}-sound`);
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(err => console.error(`Error playing ${type} sound:`, err));
  }
}

function autoClick() {
  let totalRate = 0;
  gameState.autoClickers.forEach(autoClicker => {
    totalRate += autoClicker.rate;
  });
  gameState.score += totalRate / 10;
  updateProgress();
  updateTasksProgress('score');
  saveGameState();
  updateUI();
}

function regenerateEnergy() {
  if (gameState.energy < gameState.maxEnergy) {
    gameState.energy = Math.min(gameState.energy + ENERGY_REGEN_RATE / 10, gameState.maxEnergy);
    updateUI();
  }
}

function updateBoosts() {
  const now = Date.now();
  gameState.activeBoosts = gameState.activeBoosts.filter(boost => boost.expires > now);
  updateUI();
}

export async function loadGameState() {
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  if (!userId) {
    console.error('No user ID found');
    return;
  }

  const playerRef = ref(database, 'players/' + userId);
  try {
    const snapshot = await get(playerRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      gameState.score = data.score || 0;
      gameState.clicks = data.clicks || 0;
      gameState.energy = data.energy || 100;
      gameState.maxEnergy = data.maxEnergy || 100;
      gameState.level = data.level || 1;
      gameState.clickMultiplier = data.clickMultiplier || 1;
      gameState.autoClickers = data.autoClickers || [];
      gameState.skins = data.skins || [];
      gameState.boosts = data.boosts || [];
      gameState.activeBoosts = data.activeBoosts || [];
      updateProgress();
      if (gameState.skins.length > 0) {
        applySkin(gameState.skins[gameState.skins.length - 1]);
      }
    }
  } catch (error) {
    console.error('Error loading game state:', error);
  }

  const tasksRef = ref(database, 'tasks');
  try {
    const snapshot = await get(tasksRef);
    if (snapshot.exists()) {
      gameState.tasks = Object.entries(snapshot.val()).map(([id, task]) => ({
        id,
        ...task,
        progress: 0,
        completed: false
      }));
      updateTasksProgress('clicks');
      updateTasksProgress('score');
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }

  updateUI();
  updateTasks();
}

function saveGameState() {
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  if (!userId) {
    console.error('No user ID found');
    return;
  }

  const playerRef = ref(database, 'players/' + userId);
  update(playerRef, {
    score: Math.floor(gameState.score),
    clicks: gameState.clicks,
    energy: gameState.energy,
    maxEnergy: gameState.maxEnergy,
    level: gameState.level,
    clickMultiplier: gameState.clickMultiplier,
    autoClickers: gameState.autoClickers,
    skins: gameState.skins,
    boosts: gameState.boosts,
    activeBoosts: gameState.activeBoosts,
    lastUpdated: Date.now()
  }).catch(error => {
    console.error('Error saving game state:', error);
  });
}

setInterval(autoClick, 100);
setInterval(regenerateEnergy, 100);
setInterval(updateBoosts, 1000);
document.addEventListener('DOMContentLoaded', loadGameState);

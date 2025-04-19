// ui.js
import { database } from './firebase.js';
import { ref, update } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js';
import { loadTranslations, getTranslation, currentLanguage, changeLanguage } from './translations.js';
import { gameState, loadGameState } from './game.js';

let playerName = "Гравець";

export function openScreen(screenName) {
  console.log(`Opening screen: ${screenName}`);
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.querySelectorAll('.nav-button').forEach(button => {
    button.classList.remove('active');
  });

  const screenElement = document.getElementById(screenName);
  if (screenElement) {
    screenElement.classList.add('active');
  } else {
    console.error(`Screen ${screenName} not found!`);
  }

  const navButton = document.querySelector(`.nav-button.${screenName}-button`);
  if (navButton) {
    navButton.classList.add('active');
  } else {
    console.error(`Nav button for ${screenName} not found!`);
  }

  window.location.hash = screenName;
}

export function handleTap() {
  let multiplier = gameState.clickMultiplier;
  gameState.activeBoosts.forEach(boost => {
    if (boost.id === 'speed' || boost.id === 'score' || boost.id === 'ultimate' || boost.id === 'mega') {
      multiplier *= boost.multiplier;
    }
  });

  if (gameState.energy >= 1) {
    gameState.score += multiplier;
    gameState.clicks += 1;
    gameState.energy -= 1;
    updateProgress();
    updateTasksProgress('clicks');
    saveGameState();
    document.getElementById('click-sound')?.play().catch(err => console.error('Error playing click sound:', err));
    updateUI();
  } else {
    alert(getTranslation('no_energy'));
  }
}

function updateProgress() {
  gameState.progress = (gameState.score % 100) / 100 * 100;
  if (gameState.score >= 100 * gameState.level) {
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

export function updateUI() {
  const scoreElement = document.getElementById('score');
  const energyElement = document.getElementById('energy');
  const levelElement = document.getElementById('level');
  const progressTextElement = document.querySelector('.progress-text');
  const progressFillElement = document.querySelector('.progress-fill');
  const playerNameElement = document.getElementById('player-name');

  if (scoreElement) scoreElement.innerText = `${Math.floor(gameState.score)}P`;
  if (energyElement) energyElement.innerText = `${getTranslation('energy')}: ${Math.floor(gameState.energy)}/${gameState.maxEnergy}`;
  if (levelElement) levelElement.innerText = `${getTranslation('level')}: ${gameState.level}`;
  if (progressTextElement) progressTextElement.innerText = `${Math.round(gameState.progress)}%`;
  if (progressFillElement) progressFillElement.style.width = `${gameState.progress}%`;
  if (playerNameElement) playerNameElement.innerText = `${getTranslation('player')}: ${playerName}`;

  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  if (userId) {
    update(ref(database, 'players/' + userId), {
      score: Math.floor(gameState.score),
      clicks: gameState.clicks,
      lastUpdated: Date.now()
    }).catch(error => console.error('Error updating player data:', error));
  }
}

export function updateTasks() {
  const taskList = document.getElementById('task-list');
  if (!taskList) return;

  taskList.innerHTML = '';
  gameState.tasks.filter(task => task.level <= gameState.level).forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    let buttonHtml = task.completed && !task.claimed
      ? `<button onclick="claimTask('${task.id}')">${getTranslation('redeem_promo')}</button>`
      : task.completed
        ? `<span>${getTranslation('completed')}</span>`
        : task.type === 'social'
          ? `<button onclick="window.open('${task.url}', '_blank')">${getTranslation('join')}</button>`
          : '';
    taskItem.innerHTML = `
      <p>${task.description} (${task.progress}/${task.target}) - ${getTranslation('reward')}: ${task.reward}P</p>
      ${buttonHtml}
    `;
    taskList.appendChild(taskItem);
  });
}

export function updateUIText() {
  document.querySelectorAll('[data-lang]').forEach(element => {
    const key = element.getAttribute('data-lang');
    element.innerHTML = getTranslation(key);
  });
  const playerNameElement = document.getElementById('player-name');
  if (playerNameElement) {
    playerNameElement.innerText = `${getTranslation('player')}: ${playerName}`;
  }
  updateUI();
  updateTasks();
}

export function changeTheme(theme) {
  const selectedTheme = theme || document.getElementById('theme-select').value;
  localStorage.setItem('theme', selectedTheme);

  if (selectedTheme === 'custom') {
    const customTheme = JSON.parse(localStorage.getItem('customTheme')) || {};
    document.body.style.background = customTheme.background || 'linear-gradient(135deg, #1e3a8a, #3b82f6)';
    document.body.style.color = customTheme.textColor || '#ffffff';
    document.querySelectorAll('.tap-button, .nav-button, .shop-item button, .promo-section button, #add-task-section button, #add-promo-section button, .settings-section button, .load-more-button').forEach(el => {
      el.style.background = customTheme.buttonColor || '#3b82f6';
      el.style.color = customTheme.textColor || '#ffffff';
    });
    document.querySelectorAll('.info-card, .shop-item, .task-item, .leaderboard-item').forEach(el => {
      el.style.background = customTheme.cardColor || 'rgba(255, 255, 255, 0.2)';
    });
    document.querySelectorAll('.progress-fill').forEach(el => {
      el.style.background = customTheme.progressColor || '#60a5fa';
    });
    document.querySelectorAll('h1, h3, h4').forEach(el => {
      el.style.color = customTheme.headerColor || '#ffffff';
    });
    document.querySelectorAll('.info-card, .shop-item, .task-item, .leaderboard-item, .tap-button').forEach(el => {
      el.style.boxShadow = `0 0 10px ${customTheme.shadowColor || '#000000'}`;
    });
  }

  document.body.className = selectedTheme;
  updateUI();
}

export function saveCustomTheme() {
  const backgroundColor = document.getElementById('custom-theme-bg').value;
  const buttonColor = document.getElementById('custom-theme-button').value;
  const textColor = document.getElementById('custom-theme-text').value;
  const cardColor = document.getElementById('custom-theme-card').value;
  const progressColor = document.getElementById('custom-theme-progress').value;
  const headerColor = document.getElementById('custom-theme-header').value;
  const shadowColor = document.getElementById('custom-theme-shadow').value;

  const customTheme = {
    background: `linear-gradient(135deg, ${backgroundColor}, ${buttonColor})`,
    buttonColor,
    textColor,
    cardColor: `rgba(${parseInt(cardColor.slice(1,3),16)},${parseInt(cardColor.slice(3,5),16)},${parseInt(cardColor.slice(5,7),16)},0.2)`,
    progressColor,
    headerColor,
    shadowColor
  };

  localStorage.setItem('customTheme', JSON.stringify(customTheme));
  changeTheme('custom');
}

export async function initializeUI() {
  await loadTranslations();

  if (window.Telegram && window.Telegram.WebApp) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    if (user && user.username) {
      playerName = user.username;
    } else if (user && user.first_name) {
      playerName = user.first_name;
    }
  }

  const savedLanguage = localStorage.getItem('language') || 'uk';
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const languageSelect = document.getElementById('language-select');
  const themeSelect = document.getElementById('theme-select');

  if (languageSelect) {
    languageSelect.value = savedLanguage;
    languageSelect.addEventListener('change', () => {
      changeLanguage(languageSelect.value);
      updateUIText();
    });
  } else {
    console.error('Language select element not found!');
  }

  if (themeSelect) {
    themeSelect.innerHTML = `
      <option value="dark">${getTranslation('theme_dark')}</option>
      <option value="light">${getTranslation('theme_light')}</option>
      <option value="ukrainian">${getTranslation('theme_ukrainian')}</option>
      <option value="neon">${getTranslation('theme_neon')}</option>
      <option value="cosmic">${getTranslation('theme_cosmic')}</option>
      <option value="forest">${getTranslation('theme_forest')}</option>
      <option value="custom">${getTranslation('theme_custom')}</option>
    `;
    themeSelect.value = savedTheme;
    themeSelect.addEventListener('change', () => changeTheme(themeSelect.value));
  } else {
    console.error('Theme select element not found!');
  }

  changeLanguage(savedLanguage);
  changeTheme(savedTheme);
  updateUIText();

  const tapButton = document.getElementById('tap-button');
  if (tapButton) {
    tapButton.addEventListener('click', handleTap);
  }

  const saveCustomThemeButton = document.getElementById('save-custom-theme');
  if (saveCustomThemeButton) {
    saveCustomThemeButton.addEventListener('click', saveCustomTheme);
  }

  document.querySelectorAll('.nav-button').forEach(button => {
    const screenName = button.className.match(/(\w+)-button/)[1];
    button.addEventListener('click', () => {
      console.log(`Nav button clicked: ${screenName}`);
      if (screenName === 'shop') {
        window.location.href = 'shop.html';
      } else {
        openScreen(screenName);
      }
    });
  });

  const hash = window.location.hash.replace('#', '');
  if (hash) {
    openScreen(hash);
  } else {
    openScreen('main');
  }

  await loadGameState();
  updateUI();
  updateTasks();
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing UI');
  initializeUI().catch(err => console.error('Error initializing UI:', err));
});

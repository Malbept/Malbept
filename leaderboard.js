// leaderboard.js
import { database } from './firebase.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js';
import { getTranslation } from './translations.js';

export async function updateLeaderboard() {
  const scoreList = document.getElementById('leaderboard-score-list');
  const clicksList = document.getElementById('leaderboard-clicks-list');
  const playerScoreRank = document.getElementById('player-score-rank');
  const playerClicksRank = document.getElementById('player-clicks-rank');
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  if (!scoreList || !clicksList || !playerScoreRank || !playerClicksRank) return;

  try {
    const playersRef = ref(database, 'players');
    const snapshot = await get(playersRef);
    if (!snapshot.exists()) {
      scoreList.innerHTML = `<p>${getTranslation('no_players')}</p>`;
      clicksList.innerHTML = `<p>${getTranslation('no_players')}</p>`;
      return;
    }

    const players = [];
    snapshot.forEach(child => {
      const data = child.val();
      players.push({
        id: child.key,
        name: data.username || 'Анонім',
        score: data.score || 0,
        clicks: data.clicks || 0
      });
    });

    // Лидерборд по очкам
    const scoreSorted = players.sort((a, b) => b.score - a.score).slice(0, 10);
    scoreList.innerHTML = '';
    scoreSorted.forEach((player, index) => {
      const item = document.createElement('div');
      item.className = `leaderboard-item ${player.id === userId ? 'current-player' : ''}`;
      item.innerHTML = `<p>#${index + 1} ${player.name}: ${Math.floor(player.score)}P</p>`;
      scoreList.appendChild(item);
    });

    // Лидерборд по кликам
    const clicksSorted = players.sort((a, b) => b.clicks - a.clicks).slice(0, 10);
    clicksList.innerHTML = '';
    clicksSorted.forEach((player, index) => {
      const item = document.createElement('div');
      item.className = `leaderboard-item ${player.id === userId ? 'current-player' : ''}`;
      item.innerHTML = `<p>#${index + 1} ${player.name}: ${player.clicks} ${getTranslation('clicks')}</p>`;
      clicksList.appendChild(item);
    });

    // Ранг игрока
    const player = players.find(p => p.id === userId);
    if (player) {
      const scoreRank = players.sort((a, b) => b.score - a.score).findIndex(p => p.id === userId) + 1;
      const clicksRank = players.sort((a, b) => b.clicks - a.clicks).findIndex(p => p.id === userId) + 1;
      playerScoreRank.innerHTML = `<p>${getTranslation('your_rank')}: #${scoreRank} (${Math.floor(player.score)}P)</p>`;
      playerClicksRank.innerHTML = `<p>${getTranslation('your_rank')}: #${clicksRank} (${player.clicks} ${getTranslation('clicks')})</p>`;
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    scoreList.innerHTML = `<p>${getTranslation('error_loading_leaderboard')}</p>`;
    clicksList.innerHTML = `<p>${getTranslation('error_loading_leaderboard')}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('leaderboard')) {
    updateLeaderboard();
  }
});
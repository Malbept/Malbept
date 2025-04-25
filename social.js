// social.js
function showFriends() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Друзья 👥</h2>
        ${profile.friends.length ? profile.friends.map(friend => `
            <p>${friend.username} (Уровень ${friend.level}, Монеты: ${friend.coins})</p>
            <button class="action" onclick="sendGift('${friend.username}')">Отправить подарок (10 монет)</button>
        `).join('') : '<p>Нет друзей</p>'}
        <p>Добавить друга:</p>
        <input id="friendInput" type="text" placeholder="Введите имя друга">
        <button class="action" onclick="addFriend()">Добавить</button>
    `;
    historyStack.push('showFriends');
}

function addFriend() {
    const friendName = document.getElementById('friendInput').value;
    if (friendName && friendName !== profile.username && !profile.friends.some(f => f.username === profile.username)) {
        profile.friends.push({ username: friendName, level: 1, coins: 100 });
        showNotification(`Друг ${friendName} добавлен! 👥`);
    } else {
        showNotification('Нельзя добавить этого друга! 😿');
    }
    showFriends();
    updateProfile();
}

function sendGift(friendName) {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - profile.lastGiftSent < oneDay) {
        showNotification('Подарок можно отправить раз в день! ⏳');
        return;
    }
    if (profile.coins >= 10) {
        profile.coins -= 10;
        profile.lastGiftSent = now;
        showNotification(`Подарок отправлен ${friendName}! 🎁`);
        showFriends();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function showTournaments() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (!profile.tournament || profile.tournament.end < now) {
        profile.tournament = {
            type: 'blackjack',
            scores: [{ username: profile.username, score: 0 }],
            end: now + oneDay
        };
    }
    const userScore = profile.tournament.scores.find(s => s.username === profile.username)?.score || 0;
    const top3 = profile.tournament.scores.sort((a, b) => b.score - a.score).slice(0, 3);
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Турнир по блекджеку 🏆</h2>
        <p>Твой счёт: ${userScore}</p>
        <p>Топ-3:</p>
        ${top3.map((s, i) => `<p>${i + 1}. ${s.username}: ${s.score}</p>`).join('')}
        <p>Время до конца: ${Math.floor((profile.tournament.end - now) / (1000 * 60))} минут</p>
        <button class="action" onclick="playBlackjack(true)">Играть в турнире</button>
    `;
    historyStack.push('showTournaments');
}

function showSeasonPass() {
    const tasks = [
        { id: 'play_games', description: 'Сыграй 10 игр', goal: 10, reward: 100 },
        { id: 'earn_coins', description: 'Заработай 500 монет', goal: 500, reward: 150 }
    ];
    const passRewards = [
        { level: 1, reward: '100 монет' },
        { level: 2, reward: 'Редкий питомец' },
        { level: 3, reward: '200 монет' }
    ];
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Сезонный пропуск 🎟️</h2>
        <p>Уровень: ${profile.seasonPass.level}</p>
        <p>Прогресс: ${profile.seasonPass.progress}/100</p>
        <p>Задания:</p>
        ${tasks.map(task => `<p>${task.description}</p>`).join('')}
        <p>Награды:</p>
        ${passRewards.map(r => `<p>Уровень ${r.level}: ${r.reward} ${profile.seasonPass.level >= r.level ? '(Получено)' : ''}</p>`).join('')}
    `;
    historyStack.push('showSeasonPass');
}

function checkSeasonPass(type) {
    if (type === 'play_blackjack' || type === 'play_slots') {
        profile.seasonPass.progress += 10;
        if (profile.seasonPass.progress >= 100) {
            profile.seasonPass.level++;
            profile.seasonPass.progress = 0;
            if (profile.seasonPass.level === 2) {
                profile.pets.push({ name: 'Редкий питомец', level: 1, rarity: 'редкий' });
                showNotification('Сезонный пропуск: Получен редкий питомец! 🐾');
            } else {
                profile.coins += 100 * profile.seasonPass.level;
                showNotification(`Сезонный пропуск: Уровень ${profile.seasonPass.level}! +${100 * profile.seasonPass.level} монет 🎉`);
            }
        }
        updateProfile();
    }
}

// Конец файла social.js
// ui.js
let profile = {
    username: 'ошибка',
    coins: 100,
    xp: 0,
    rank: 'Новичок',
    title: '',
    pets: [],
    items: [],
    achievements: [],
    quests: {},
    stats: { pets_summoned: 0, items_collected: 0, blackjack_games: 0, slot_games: 0, dice_games: 0, roulette_games: 0, clicker_games: 0, treasure_hunts: 0, game_wins: 0, quests_completed: 0 },
    last_earn: 0,
    earn_boost: 0
};

function showProfile() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Профиль 👤</h2>
        <p>Имя: ${profile.username}</p>
        <p>Монеты: ${profile.coins} 💰</p>
        <p>Ранг: ${profile.rank}</p>
        <p>Титул: ${profile.title || 'Нет'}</p>
        <p>Опыт: ${profile.xp} XP</p>
    `;
    if (!historyStack.includes('showProfile')) {
        historyStack.push('showProfile');
    }
    window.Telegram.WebApp.BackButton.show();
    updateProfile();
}

function showPets() {
    const petList = profile.pets.length ? profile.pets.map(pet => `<p>${pet.name} (Уровень ${pet.level})</p>`).join('') : '<p>Нет питомцев</p>';
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Питомцы 🐾</h2>
        ${petList}
        <button class="action" onclick="summonPet()">Призвать питомца (50 монет)</button>
    `;
    if (!historyStack.includes('showPets')) {
        historyStack.push('showPets');
    }
    window.Telegram.WebApp.BackButton.show();
    updateProfile();
}

function showCollections() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Коллекции 🧺</h2>
        <p>Твои коллекции: ${profile.items.length ? profile.items.join(', ') : 'Нет предметов'}</p>
    `;
    if (!historyStack.includes('showCollections')) {
        historyStack.push('showCollections');
    }
    window.Telegram.WebApp.BackButton.show();
    updateProfile();
}

function showInventory() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Инвентарь 🎒</h2>
        <p>Предметы: ${profile.items.length ? profile.items.join(', ') : 'Инвентарь пуст'}</p>
    `;
    if (!historyStack.includes('showInventory')) {
        historyStack.push('showInventory');
    }
    window.Telegram.WebApp.BackButton.show();
    updateProfile();
}

function showShop() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Магазин 🏪</h2>
        <p>Доступные товары:</p>
        <p>Питомец - 100 монет</p>
        <p>Предмет - 50 монет</p>
        <p>Буст XP (+50%) - 200 монет</p>
        <button class="action" onclick="buyItem('Питомец')">Купить питомца</button>
        <button class="action" onclick="buyItem('Предмет')">Купить предмет</button>
        <button class="action" onclick="buyItem('Буст XP')">Купить буст XP</button>
    `;
    if (!historyStack.includes('showShop')) {
        historyStack.push('showShop');
    }
    window.Telegram.WebApp.BackButton.show();
    updateProfile();
}

function showGames() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Игры 🎲</h2>
        <button class="action" onclick="playBlackjack()">Блекджек</button>
        <button class="action" onclick="playSlots()">Слоты</button>
        <button class="action" onclick="playDice()">Кости</button>
        <button class="action" onclick="playRoulette()">Рулетка</button>
        <button class="action" onclick="playClicker()">Кликер</button>
    `;
    if (!historyStack.includes('showGames')) {
        historyStack.push('showGames');
    }
    window.Telegram.WebApp.BackButton.show();
    updateProfile();
}

function showRewards() {
    const achievements = profile.achievements.length ? profile.achievements.map(a => `<p>${a}</p>`).join('') : '<p>Нет достижений</p>';
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Награды 🎁</h2>
        ${achievements}
    `;
    if (!historyStack.includes('showRewards')) {
        historyStack.push('showRewards');
    }
    window.Telegram.WebApp.BackButton.show();
    updateProfile();
}

function showQuests() {
    const questList = Object.keys(profile.quests).length ? Object.entries(profile.quests).map(([id, q]) => `<p>${q.description} (${q.progress}/${q.goal})</p>`).join('') : '<p>Нет квестов</p>';
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Квесты 📜</h2>
        ${questList}
        <button class="action" onclick="startQuest()">Начать новый квест</button>
    `;
    if (!historyStack.includes('showQuests')) {
        historyStack.push('showQuests');
    }
    window.Telegram.WebApp.BackButton.show();
    updateProfile();
}

function showTreasureHunt() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Поиск сокровищ 🔍</h2>
        <p>Найди сокровище!</p>
        <button class="action" onclick="startTreasureHunt()">Начать поиск</button>
    `;
    if (!historyStack.includes('showTreasureHunt')) {
        historyStack.push('showTreasureHunt');
    }
    window.Telegram.WebApp.BackButton.show();
    updateProfile();
}

function showWheel() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Колесо фортуны 🎡</h2>
        <p>Крути колесо для наград!</p>
        <button class="action" onclick="spinWheel()">Крутить</button>
    `;
    if (!historyStack.includes('showWheel')) {
        historyStack.push('showWheel');
    }
    window.Telegram.WebApp.BackButton.show();
    updateProfile();
}

function showEarn() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Заработок 💸</h2>
        <p>Заработай монеты!</p>
        <button class="action" onclick="earnCoins()">Заработать</button>
    `;
    if (!historyStack.includes('showEarn')) {
        historyStack.push('showEarn');
    }
    window.Telegram.WebApp.BackButton.show();
    updateProfile();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}
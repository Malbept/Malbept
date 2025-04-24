// ui.js
let profile = {
    username: 'User',
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
    `;
    historyStack.push('showProfile');
    window.Telegram.WebApp.BackButton.show();
}

function showPets() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Питомцы 🐾</h2>
        <p>Твои питомцы: ${profile.pets.length ? profile.pets.join(', ') : 'Нет питомцев'}</p>
        <button class="action" onclick="summonPet()">Призвать питомца</button>
    `;
    historyStack.push('showPets');
    window.Telegram.WebApp.BackButton.show();
}

function showCollections() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Коллекции 🧺</h2>
        <p>Твои коллекции: ${profile.items.length ? profile.items.join(', ') : 'Нет предметов'}</p>
    `;
    historyStack.push('showCollections');
    window.Telegram.WebApp.BackButton.show();
}

function showInventory() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Инвентарь 🎒</h2>
        <p>Предметы: ${profile.items.length ? profile.items.join(', ') : 'Инвентарь пуст'}</p>
    `;
    historyStack.push('showInventory');
    window.Telegram.WebApp.BackButton.show();
}

function showShop() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Магазин 🏪</h2>
        <p>Доступные товары: Питомец (100 монет), Предмет (50 монет)</p>
        <button class="action" onclick="buyItem('Питомец')">Купить питомца</button>
        <button class="action" onclick="buyItem('Предмет')">Купить предмет</button>
    `;
    historyStack.push('showShop');
    window.Telegram.WebApp.BackButton.show();
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
    historyStack.push('showGames');
    window.Telegram.WebApp.BackButton.show();
}

function showRewards() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Награды 🎁</h2>
        <p>Твои достижения: ${profile.achievements.length ? profile.achievements.join(', ') : 'Нет достижений'}</p>
    `;
    historyStack.push('showRewards');
    window.Telegram.WebApp.BackButton.show();
}

function showQuests() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Квесты 📜</h2>
        <p>Активные квесты: ${Object.keys(profile.quests).length ? Object.keys(profile.quests).join(', ') : 'Нет квестов'}</p>
    `;
    historyStack.push('showQuests');
    window.Telegram.WebApp.BackButton.show();
}

function showTreasureHunt() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Поиск сокровищ 🔍</h2>
        <p>Найди сокровище!</p>
        <button class="action" onclick="startTreasureHunt()">Начать поиск</button>
    `;
    historyStack.push('showTreasureHunt');
    window.Telegram.WebApp.BackButton.show();
}

function showWheel() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Колесо фортуны 🎡</h2>
        <p>Крути колесо для наград!</p>
        <button class="action" onclick="spinWheel()">Крутить</button>
    `;
    historyStack.push('showWheel');
    window.Telegram.WebApp.BackButton.show();
}

function showEarn() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Заработок 💸</h2>
        <p>Заработай монеты!</p>
        <button class="action" onclick="earnCoins()">Заработать</button>
    `;
    historyStack.push('showEarn');
    window.Telegram.WebApp.BackButton.show();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}
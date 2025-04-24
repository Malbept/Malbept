// game.js
function summonPet() {
    profile.pets.push(`Питомец ${profile.pets.length + 1}`);
    profile.stats.pets_summoned++;
    showNotification('Новый питомец призван! 🐾');
    showPets();
}

function buyItem(item) {
    const costs = { 'Питомец': 100, 'Предмет': 50 };
    if (profile.coins >= costs[item]) {
        profile.coins -= costs[item];
        profile.items.push(item);
        profile.stats.items_collected++;
        showNotification(`Куплен ${item}! 🎉`);
        showShop();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function playBlackjack() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Блекджек 🎴</h2>
        <p>В разработке...</p>
    `;
    profile.stats.blackjack_games++;
    showNotification('Игра в блекджек начата!');
}

function playSlots() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Слоты 🎰</h2>
        <p>В разработке...</p>
    `;
    profile.stats.slot_games++;
    showNotification('Слоты запущены!');
}

function playDice() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Кости 🎲</h2>
        <p>В разработке...</p>
    `;
    profile.stats.dice_games++;
    showNotification('Кости брошены!');
}

function playRoulette() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Рулетка 🎡</h2>
        <p>В разработке...</p>
    `;
    profile.stats.roulette_games++;
    showNotification('Рулетка запущена!');
}

function playClicker() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Кликер 🖱️</h2>
        <p>Нажимай для монет!</p>
        <button class="action" onclick="profile.coins += 10; showNotification('+10 монет! 💰'); playClicker();">Клик!</button>
    `;
    profile.stats.clicker_games++;
}

function startTreasureHunt() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Поиск сокровищ 🔍</h2>
        <p>Сокровище найдено!</p>
    `;
    profile.stats.treasure_hunts++;
    showNotification('Сокровище найдено! 🪙');
}

function spinWheel() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Колесо фортуны 🎡</h2>
        <p>Колесо крутится...</p>
    `;
    profile.stats.roulette_games++;
    showNotification('Колесо закручено! 🎉');
}

function earnCoins() {
    profile.coins += 50;
    profile.stats.quests_completed++;
    showNotification('+50 монет! 💸');
    showEarn();
}
// game.js
function summonPet() {
    profile.pets.push(`Питомец ${profile.pets.length + 1}`);
    profile.stats.pets_summoned++;
    showNotification('Новый питомец призван! 🐾');
    showPets();
    updateProfile();
}

function buyItem(item) {
    const costs = { 'Питомец': 100, 'Предмет': 50 };
    if (profile.coins >= costs[item]) {
        profile.coins -= costs[item];
        profile.items.push(item);
        profile.stats.items_collected++;
        showNotification(`Куплен ${item}! 🎉`);
        showShop();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function playBlackjack() {
    let playerCards = [Math.floor(Math.random() * 10) + 2, Math.floor(Math.random() * 10) + 2];
    let dealerCards = [Math.floor(Math.random() * 10) + 2, Math.floor(Math.random() * 10) + 2];
    let playerScore = playerCards.reduce((a, b) => a + b, 0);
    let dealerScore = dealerCards.reduce((a, b) => a + b, 0);

    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Блекджек 🎴</h2>
        <p>Твои карты: ${playerCards.join(', ')} (Сумма: ${playerScore})</p>
        <p>Карты дилера: ${dealerCards[0]}, ?</p>
        <button class="action" onclick="hit()">Взять карту</button>
        <button class="action" onclick="stand()">Остановиться</button>
    `;
    historyStack.push('playBlackjack');
    window.Telegram.WebApp.BackButton.show();
    profile.stats.blackjack_games++;
    updateProfile();

    window.hit = function() {
        playerCards.push(Math.floor(Math.random() * 10) + 2);
        playerScore = playerCards.reduce((a, b) => a + b, 0);
        if (playerScore > 21) {
            showNotification('Перебор! Ты проиграл 😿');
            showGames();
            updateProfile();
        } else {
            document.getElementById('main-content').innerHTML = `
                <button class="back-button" onclick="goBack()">Назад ⬅️</button>
                <h2>Блекджек 🎴</h2>
                <p>Твои карты: ${playerCards.join(', ')} (Сумма: ${playerScore})</p>
                <p>Карты дилера: ${dealerCards[0]}, ?</p>
                <button class="action" onclick="hit()">Взять карту</button>
                <button class="action" onclick="stand()">Остановиться</button>
            `;
        }
    };

    window.stand = function() {
        while (dealerScore < 17) {
            dealerCards.push(Math.floor(Math.random() * 10) + 2);
            dealerScore = dealerCards.reduce((a, b) => a + b, 0);
        }
        document.getElementById('main-content').innerHTML = `
            <button class="back-button" onclick="goBack()">Назад ⬅️</button>
            <h2>Блекджек 🎴</h2>
            <p>Твои карты: ${playerCards.join(', ')} (Сумма: ${playerScore})</p>
            <p>Карты дилера: ${dealerCards.join(', ')} (Сумма: ${dealerScore})</p>
        `;
        if (dealerScore > 21 || playerScore > dealerScore) {
            profile.coins += 50;
            profile.stats.game_wins++;
            showNotification('Победа! +50 монет 🎉');
        } else if (playerScore === dealerScore) {
            showNotification('Ничья! 🤝');
        } else {
            showNotification('Дилер победил 😿');
        }
        updateProfile();
    };
}

function playSlots() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Слоты 🎰</h2>
        <p>В разработке...</p>
    `;
    historyStack.push('playSlots');
    window.Telegram.WebApp.BackButton.show();
    profile.stats.slot_games++;
    updateProfile();
}

function playDice() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Кости 🎲</h2>
        <p>В разработке...</p>
    `;
    historyStack.push('playDice');
    window.Telegram.WebApp.BackButton.show();
    profile.stats.dice_games++;
    updateProfile();
}

function playRoulette() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Рулетка 🎡</h2>
        <p>В разработке...</p>
    `;
    historyStack.push('playRoulette');
    window.Telegram.WebApp.BackButton.show();
    profile.stats.roulette_games++;
    updateProfile();
}

function playClicker() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Кликер 🖱️</h2>
        <p>Нажимай для монет!</p>
        <button class="action" onclick="profile.coins += 10; showNotification('+10 монет! 💰'); updateProfile(); playClicker();">Клик!</button>
    `;
    historyStack.push('playClicker');
    window.Telegram.WebApp.BackButton.show();
    profile.stats.clicker_games++;
    updateProfile();
}

function startTreasureHunt() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Поиск сокровищ 🔍</h2>
        <p>Сокровище найдено!</p>
    `;
    historyStack.push('startTreasureHunt');
    window.Telegram.WebApp.BackButton.show();
    profile.coins += 100;
    profile.stats.treasure_hunts++;
    showNotification('Сокровище найдено! +100 монет 🪙');
    updateProfile();
}

function spinWheel() {
    const rewards = [10, 50, 100, 0, 200];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Колесо фортуны 🎡</h2>
        <p>Ты выиграл: ${reward} монет!</p>
    `;
    historyStack.push('spinWheel');
    window.Telegram.WebApp.BackButton.show();
    profile.coins += reward;
    profile.stats.roulette_games++;
    showNotification(`+${reward} монет! 🎉`);
    updateProfile();
}

function earnCoins() {
    profile.coins += 50;
    profile.stats.quests_completed++;
    showNotification('+50 монет! 💸');
    showEarn();
    updateProfile();
}
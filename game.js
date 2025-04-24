// game.js
function summonPet() {
    if (profile.coins >= 50) {
        profile.coins -= 50;
        profile.pets.push({ name: `Питомец ${profile.pets.length + 1}`, level: 1 });
        profile.stats.pets_summoned++;
        profile.xp += 10;
        showNotification('Новый питомец призван! 🐾 +10 XP');
        checkAchievements();
        checkQuests('summon_pet');
        showPets();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function buyItem(item) {
    const costs = { 'Питомец': 100, 'Предмет': 50, 'Буст XP': 200 };
    if (profile.coins >= costs[item]) {
        profile.coins -= costs[item];
        if (item === 'Питомец') {
            profile.pets.push({ name: `Питомец ${profile.pets.length + 1}`, level: 1 });
            profile.stats.pets_summoned++;
        } else if (item === 'Предмет') {
            profile.items.push(`Предмет ${profile.items.length + 1}`);
            profile.stats.items_collected++;
        } else if (item === 'Буст XP') {
            profile.earn_boost += 0.5;
            setTimeout(() => profile.earn_boost -= 0.5, 3600000); // 1 час
        }
        profile.xp += 20;
        showNotification(`Куплен ${item}! 🎉 +20 XP`);
        checkAchievements();
        checkQuests('buy_item');
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
    if (!historyStack.includes('playBlackjack')) {
        historyStack.push('playBlackjack');
    }
    window.Telegram.WebApp.BackButton.show();
    profile.stats.blackjack_games++;
    checkQuests('play_blackjack');
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
            profile.xp += 30;
            showNotification('Победа! +50 монет 🎉 +30 XP');
            checkAchievements();
        } else if (playerScore === dealerScore) {
            showNotification('Ничья! 🤝');
        } else {
            showNotification('Дилер победил 😿');
        }
        updateProfile();
    };
}

function playSlots() {
    const symbols = ['🍒', '🍋', '🍊', '💎', '🔔'];
    const result = [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]];
    const win = result.every(s => s === result[0]);
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Слоты 🎰</h2>
        <p>Результат: ${result.join(' | ')}</p>
        ${win ? '<p>Победа! +100 монет 🎉</p>' : '<p>Попробуй снова!</p>'}
    `;
    if (!historyStack.includes('playSlots')) {
        historyStack.push('playSlots');
    }
    window.Telegram.WebApp.BackButton.show();
    if (win) {
        profile.coins += 100;
        profile.stats.game_wins++;
        profile.xp += 20;
        showNotification('Победа в слотах! +100 монет 🎉 +20 XP');
        checkAchievements();
    }
    profile.stats.slot_games++;
    checkQuests('play_slots');
    updateProfile();
}

function playDice() {
    const playerRoll = Math.floor(Math.random() * 6) + 1;
    const botRoll = Math.floor(Math.random() * 6) + 1;
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Кости 🎲</h2>
        <p>Твой бросок: ${playerRoll}</p>
        <p>Бросок бота: ${botRoll}</p>
        ${playerRoll > botRoll ? '<p>Победа! +50 монет 🎉</p>' : playerRoll === botRoll ? '<p>Ничья!</p>' : '<p>Бот победил 😿</p>'}
    `;
    if (!historyStack.includes('playDice')) {
        historyStack.push('playDice');
    }
    window.Telegram.WebApp.BackButton.show();
    if (playerRoll > botRoll) {
        profile.coins += 50;
        profile.stats.game_wins++;
        profile.xp += 15;
        showNotification('Победа в костях! +50 монет 🎉 +15 XP');
        checkAchievements();
    }
    profile.stats.dice_games++;
    checkQuests('play_dice');
    updateProfile();
}

function playRoulette() {
    const options = ['Красное', 'Чёрное', 'Зелёное'];
    const result = options[Math.floor(Math.random() * options.length)];
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Рулетка 🎡</h2>
        <p>Результат: ${result}</p>
        ${result === 'Красное' ? '<p>Победа! +75 монет 🎉</p>' : '<p>Попробуй снова!</p>'}
    `;
    if (!historyStack.includes('playRoulette')) {
        historyStack.push('playRoulette');
    }
    window.Telegram.WebApp.BackButton.show();
    if (result === 'Красное') {
        profile.coins += 75;
        profile.stats.game_wins++;
        profile.xp += 25;
        showNotification('Победа в рулетке! +75 монет 🎉 +25 XP');
        checkAchievements();
    }
    profile.stats.roulette_games++;
    checkQuests('play_roulette');
    updateProfile();
}

function playClicker() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Кликер 🖱️</h2>
        <p>Нажимай для монет!</p>
        <button class="action" onclick="profile.coins += 10; profile.xp += 5; showNotification('+10 монет! 💰 +5 XP'); checkQuests('play_clicker'); updateProfile(); playClicker();">Клик!</button>
    `;
    if (!historyStack.includes('playClicker')) {
        historyStack.push('playClicker');
    }
    window.Telegram.WebApp.BackButton.show();
    profile.stats.clicker_games++;
    updateProfile();
}

function startTreasureHunt() {
    const rewards = [50, 100, 150, 200];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Поиск сокровищ 🔍</h2>
        <p>Сокровище найдено! +${reward} монет</p>
    `;
    if (!historyStack.includes('startTreasureHunt')) {
        historyStack.push('startTreasureHunt');
    }
    window.Telegram.WebApp.BackButton.show();
    profile.coins += reward;
    profile.xp += 30;
    profile.stats.treasure_hunts++;
    showNotification(`Сокровище найдено! +${reward} монет 🪙 +30 XP`);
    checkAchievements();
    checkQuests('treasure_hunt');
    updateProfile();
}

function spinWheel() {
    const rewards = [10, 50, 100, 0, 200, 500];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Колесо фортуны 🎡</h2>
        <p>Ты выиграл: ${reward} монет!</p>
    `;
    if (!historyStack.includes('spinWheel')) {
        historyStack.push('spinWheel');
    }
    window.Telegram.WebApp.BackButton.show();
    profile.coins += reward;
    profile.xp += reward > 0 ? 20 : 5;
    profile.stats.roulette_games++;
    showNotification(`+${reward} монет! 🎉 +${reward > 0 ? 20 : 5} XP`);
    checkAchievements();
    checkQuests('spin_wheel');
    updateProfile();
}

function earnCoins() {
    const coins = Math.floor(50 * (1 + profile.earn_boost));
    profile.coins += coins;
    profile.xp += 10;
    profile.stats.quests_completed++;
    showNotification(`+${coins} монет! 💸 +10 XP`);
    checkQuests('earn_coins');
    showEarn();
    updateProfile();
}

function checkAchievements() {
    const achievements = [
        { id: 'first_pet', name: 'Первый питомец', condition: () => profile.stats.pets_summoned >= 1 },
        { id: 'game_master', name: 'Мастер игр', condition: () => profile.stats.game_wins >= 5 },
        { id: 'quest_hunter', name: 'Охотник за квестами', condition: () => profile.stats.quests_completed >= 3 }
    ];
    achievements.forEach(a => {
        if (a.condition() && !profile.achievements.includes(a.name)) {
            profile.achievements.push(a.name);
            profile.coins += 100;
            profile.xp += 50;
            showNotification(`Достижение: ${a.name}! +100 монет 🎉 +50 XP`);
        }
    });
    updateProfile();
}

function startQuest() {
    const quests = [
        { id: 'play_blackjack', description: 'Сыграй в блекджек 3 раза', goal: 3, reward: 100 },
        { id: 'play_slots', description: 'Сыграй в слоты 5 раз', goal: 5, reward: 150 },
        { id: 'summon_pet', description: 'Призови 2 питомцев', goal: 2, reward: 200 }
    ];
    const available = quests.filter(q => !profile.quests[q.id]);
    if (available.length) {
        const quest = available[Math.floor(Math.random() * available.length)];
        profile.quests[quest.id] = { description: quest.description, progress: 0, goal: quest.goal, reward: quest.reward };
        showNotification(`Новый квест: ${quest.description}!`);
        showQuests();
        updateProfile();
    } else {
        showNotification('Все квесты выполнены!');
    }
}

function checkQuests(type) {
    if (profile.quests[type]) {
        profile.quests[type].progress++;
        if (profile.quests[type].progress >= profile.quests[type].goal) {
            profile.coins += profile.quests[type].reward;
            profile.xp += 50;
            profile.stats.quests_completed++;
            showNotification(`Квест выполнен: ${profile.quests[type].description}! +${profile.quests[type].reward} монет 🎉 +50 XP`);
            delete profile.quests[type];
            checkAchievements();
        }
        updateProfile();
    }
}
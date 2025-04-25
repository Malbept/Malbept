// game.js
function summonPet() {
    const cost = profile.event && profile.event.effect === 'pet_discount' ? 25 : 50;
    if (profile.coins >= cost) {
        profile.coins -= cost;
        const rarities = ['обычный', 'редкий', 'легендарный'];
        const rarity = Math.random() < 0.1 ? (Math.random() < 0.5 ? 'редкий' : 'легендарный') : 'обычный';
        profile.pets.push({ name: `Питомец ${profile.pets.length + 1}`, level: 1, rarity: rarity });
        profile.stats.pets_summoned++;
        profile.xp += 10;
        showNotification(`Новый питомец призван (${rarity})! 🐾 +10 XP`);
        checkAchievements();
        checkQuests('summon_pet');
        checkLevelUp();
        showPets();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function buyItem(item) {
    const costs = { 'Питомец': profile.event && profile.event.effect === 'pet_discount' ? 50 : 100, 'Предмет': 50, 'Буст XP': 200, 'Сундук': 300 };
    const discount = Math.random() < 0.5 ? 'Питомец' : 'Предмет';
    if (discount === 'Питомец') costs['Питомец'] = Math.floor(costs['Питомец'] * 0.8);
    if (discount === 'Предмет') costs['Предмет'] = Math.floor(costs['Предмет'] * 0.8);
    if (profile.coins >= costs[item]) {
        profile.coins -= costs[item];
        if (item === 'Питомец') {
            const rarities = ['обычный', 'редкий', 'легендарный'];
            const rarity = Math.random() < 0.1 ? (Math.random() < 0.5 ? 'редкий' : 'легендарный') : 'обычный';
            profile.pets.push({ name: `Питомец ${profile.pets.length + 1}`, level: 1, rarity: rarity });
            profile.stats.pets_summoned++;
        } else if (item === 'Предмет') {
            profile.items.push(`Предмет ${profile.items.length + 1}`);
            profile.stats.items_collected++;
        } else if (item === 'Буст XP') {
            profile.earn_boost += 0.5;
            setTimeout(() => profile.earn_boost -= 0.5, 3600000);
        } else if (item === 'Сундук') {
            const rewards = ['100 монет', 'Редкий предмет', 'Питомец'];
            const reward = rewards[Math.floor(Math.random() * rewards.length)];
            if (reward === '100 монет') {
                profile.coins += 100;
            } else if (reward === 'Редкий предмет') {
                profile.items.push(`Редкий предмет ${profile.items.length + 1}`);
            } else {
                profile.pets.push({ name: `Питомец ${profile.pets.length + 1}`, level: 1, rarity: 'редкий' });
            }
            showNotification(`Из сундука выпало: ${reward}! 🎁`);
        }
        profile.xp += 20;
        showNotification(`Куплен ${item}! 🎉 +20 XP`);
        checkAchievements();
        checkQuests('buy_item');
        checkLevelUp();
        showShop();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function playBlackjack(isTournament = false) {
    updateEnergy();
    if (profile.energy < 1) {
        showNotification('Недостаточно энергии! ⚡');
        return;
    }
    profile.energy--;
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
    profile.stats.blackjack_games++;
    checkQuests('play_blackjack');
    updateProfile();

    window.hit = function() {
        playerCards.push(Math.floor(Math.random() * 10) + 2);
        playerScore = playerCards.reduce((a, b) => a + b, 0);
        if (playerScore > 21) {
            showNotification('Перебор! Ты проиграл 😿');
            if (isTournament) showTournaments();
            else showGames();
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
            const reward = Math.floor(50 * (1 + profile.level * 0.1));
            profile.coins += reward;
            profile.stats.game_wins++;
            let xp = profile.event && profile.event.effect === 'double_xp' ? 60 : 30;
            profile.xp += xp;
            showNotification(`Победа! +${reward} монет 🎉 +${xp} XP`);
            checkAchievements();
            checkLevelUp();
            if (isTournament) {
                const userScore = profile.tournament.scores.find(s => s.username === profile.username);
                userScore.score += 10;
                const now = Date.now();
                if (profile.tournament.end < now) {
                    const top3 = profile.tournament.scores.sort((a, b) => b.score - a.score).slice(0, 3);
                    if (top3[0].username === profile.username) profile.coins += 1000;
                    else if (top3[1]?.username === profile.username) profile.coins += 500;
                    else if (top3[2]?.username === profile.username) profile.coins += 200;
                    showNotification('Турнир завершён! Проверь награды 🏆');
                }
            }
        } else if (playerScore === dealerScore) {
            showNotification('Ничья! 🤝');
        } else {
            showNotification('Дилер победил 😿');
        }
        if (isTournament) showTournaments();
        else showGames();
        updateProfile();
    };
}

function playSlots() {
    updateEnergy();
    if (profile.energy < 1) {
        showNotification('Недостаточно энергии! ⚡');
        return;
    }
    profile.energy--;
    const symbols = ['🍒', '🍋', '🍊', '💎', '🔔'];
    let result = [];
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            result.push(symbols[Math.floor(Math.random() * symbols.length)]);
            document.getElementById('slotResult').innerHTML = result.join(' | ');
            if (result.length === 3) {
                const win = result.every(s => s === result[0]);
                document.getElementById('slotOutcome').innerHTML = win ? '<p>Победа! +100 монет 🎉</p>' : '<p>Попробуй снова!</p>';
                if (win) {
                    const reward = Math.floor(100 * (1 + profile.level * 0.1));
                    profile.coins += reward;
                    profile.stats.game_wins++;
                    let xp = profile.event && profile.event.effect === 'double_xp' ? 40 : 20;
                    profile.xp += xp;
                    showNotification(`Победа в слотах! +${reward} монет 🎉 +${xp} XP`);
                    checkAchievements();
                    checkLevelUp();
                }
                profile.stats.slot_games++;
                checkQuests('play_slots');
                updateProfile();
            }
        }, i * 1000);
    }
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Слоты 🎰</h2>
        <p id="slotResult">⏳ | ⏳ | ⏳</p>
        <p id="slotOutcome">Крутим...</p>
    `;
    if (!historyStack.includes('playSlots')) {
        historyStack.push('playSlots');
    }
}

function playDice() {
    updateEnergy();
    if (profile.energy < 1) {
        showNotification('Недостаточно энергии! ⚡');
        return;
    }
    profile.energy--;
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
    if (playerRoll > botRoll) {
        const reward = Math.floor(50 * (1 + profile.level * 0.1));
        profile.coins += reward;
        profile.stats.game_wins++;
        let xp = profile.event && profile.event.effect === 'double_xp' ? 30 : 15;
        profile.xp += xp;
        showNotification(`Победа в костях! +${reward} монет 🎉 +${xp} XP`);
        checkAchievements();
        checkLevelUp();
    }
    profile.stats.dice_games++;
    checkQuests('play_dice');
    updateProfile();
}

function playRoulette() {
    updateEnergy();
    if (profile.energy < 1) {
        showNotification('Недостаточно энергии! ⚡');
        return;
    }
    profile.energy--;
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
    if (result === 'Красное') {
        const reward = Math.floor(75 * (1 + profile.level * 0.1));
        profile.coins += reward;
        profile.stats.game_wins++;
        let xp = profile.event && profile.event.effect === 'double_xp' ? 50 : 25;
        profile.xp += xp;
        showNotification(`Победа в рулетке! +${reward} монет 🎉 +${xp} XP`);
        checkAchievements();
        checkLevelUp();
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
        <button class="action" onclick="clickForCoins()">Клик!</button>
    `;
    if (!historyStack.includes('playClicker')) {
        historyStack.push('playClicker');
    }
    profile.stats.clicker_games++;
    updateProfile();
}

function clickForCoins() {
    updateEnergy();
    if (profile.energy < 1) {
        showNotification('Недостаточно энергии! ⚡');
        playClicker();
        return;
    }
    profile.energy--;
    const reward = Math.floor(10 * (1 + profile.level * 0.1));
    profile.coins += reward;
    let xp = profile.event && profile.event.effect === 'double_xp' ? 10 : 5;
    profile.xp += xp;
    showNotification(`+${reward} монет! 💰 +${xp} XP`);
    checkQuests('play_clicker');
    checkLevelUp();
    playClicker();
    updateProfile();
}

function playRockPaperScissors() {
    updateEnergy();
    if (profile.energy < 1) {
        showNotification('Недостаточно энергии! ⚡');
        return;
    }
    profile.energy--;
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Камень-Ножницы-Бумага ✊✂️📜</h2>
        <button class="action" onclick="playRPS('камень')">Камень ✊</button>
        <button class="action" onclick="playRPS('ножницы')">Ножницы ✂️</button>
        <button class="action" onclick="playRPS('бумага')">Бумага 📜</button>
    `;
    historyStack.push('playRockPaperScissors');
}

function playRPS(playerChoice) {
    const choices = ['камень', 'ножницы', 'бумага'];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    let result = '';
    if (playerChoice === botChoice) {
        result = 'Ничья! 🤝';
    } else if (
        (playerChoice === 'камень' && botChoice === 'ножницы') ||
        (playerChoice === 'ножницы' && botChoice === 'бумага') ||
        (playerChoice === 'бумага' && botChoice === 'камень')
    ) {
        result = 'Победа! +50 монет 🎉';
        const reward = Math.floor(50 * (1 + profile.level * 0.1));
        profile.coins += reward;
        let xp = profile.event && profile.event.effect === 'double_xp' ? 30 : 15;
        profile.xp += xp;
        showNotification(`Победа! +${reward} монет 🎉 +${xp} XP`);
        checkLevelUp();
    } else {
        result = 'Проигрыш! 😿';
    }
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Камень-Ножницы-Бумага ✊✂️📜</h2>
        <p>Твой выбор: ${playerChoice}</p>
        <p>Выбор бота: ${botChoice}</p>
        <p>${result}</p>
    `;
    updateProfile();
}

function playGuessNumber() {
    updateEnergy();
    if (profile.energy < 1) {
        showNotification('Недостаточно энергии! ⚡');
        return;
    }
    profile.energy--;
    const number = Math.floor(Math.random() * 10) + 1;
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Угадай число 🔢</h2>
        <p>Угадай число от 1 до 10:</p>
        <input id="guessInput" type="number" min="1" max="10">
        <button class="action" onclick="guessNumber(${number})">Угадать</button>
    `;
    historyStack.push('playGuessNumber');
}

function guessNumber(correctNumber) {
    const guess = parseInt(document.getElementById('guessInput').value);
    if (guess === correctNumber) {
        const reward = Math.floor(75 * (1 + profile.level * 0.1));
        profile.coins += reward;
        let xp = profile.event && profile.event.effect === 'double_xp' ? 50 : 25;
        profile.xp += xp;
        showNotification(`Правильно! +${reward} монет 🎉 +${xp} XP`);
        checkLevelUp();
        showGames();
    } else {
        document.getElementById('main-content').innerHTML = `
            <button class="back-button" onclick="goBack()">Назад ⬅️</button>
            <h2>Угадай число 🔢</h2>
            <p>Неправильно! Число было: ${correctNumber}</p>
        `;
    }
    updateProfile();
}

function startTreasureHunt() {
    updateEnergy();
    if (profile.energy < 1) {
        showNotification('Недостаточно энергии! ⚡');
        return;
    }
    profile.energy--;
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
    const finalReward = Math.floor(reward * (1 + profile.level * 0.1));
    profile.coins += finalReward;
    let xp = profile.event && profile.event.effect === 'double_xp' ? 60 : 30;
    profile.xp += xp;
    profile.stats.treasure_hunts++;
    showNotification(`Сокровище найдено! +${finalReward} монет 🪙 +${xp} XP`);
    checkAchievements();
    checkQuests('treasure_hunt');
    checkLevelUp();
    updateProfile();
}

function spinWheel() {
    updateEnergy();
    if (profile.energy < 1) {
        showNotification('Недостаточно энергии! ⚡');
        return;
    }
    profile.energy--;
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
    const finalReward = Math.floor(reward * (1 + profile.level * 0.1));
    profile.coins += finalReward;
    let xp = reward > 0 ? (profile.event && profile.event.effect === 'double_xp' ? 40 : 20) : 5;
    profile.xp += xp;
    profile.stats.roulette_games++;
    showNotification(`+${finalReward} монет! 🎉 +${xp} XP`);
    checkAchievements();
    checkQuests('spin_wheel');
    checkLevelUp();
    updateProfile();
}

function earnCoins() {
    updateEnergy();
    if (profile.energy < 1) {
        showNotification('Недостаточно энергии! ⚡');
        return;
    }
    profile.energy--;
    const coins = Math.floor(50 * (1 + profile.earn_boost) * (1 + profile.level * 0.1));
    profile.coins += coins;
    let xp = profile.event && profile.event.effect === 'double_xp' ? 20 : 10;
    profile.xp += xp;
    profile.stats.quests_completed++;
    showNotification(`+${coins} монет! 💸 +${xp} XP`);
    checkQuests('earn_coins');
    checkLevelUp();
    showEarn();
    updateProfile();
}

function checkAchievements() {
    const achievements = [
        { id: 'first_pet', name: 'Первый питомец', condition: () => profile.stats.pets_summoned >= 1 },
        { id: 'game_master', name: 'Мастер игр', condition: () => profile.stats.game_wins >= 5 },
        { id: 'quest_hunter', name: 'Охотник за квестами', condition: () => profile.stats.quests_completed >= 3 },
        { id: 'rich', name: 'Богач', condition: () => profile.coins >= 1000 },
        { id: 'treasure_seeker', name: 'Искатель сокровищ', condition: () => profile.stats.treasure_hunts >= 10 }
    ];
    achievements.forEach(a => {
        if (a.condition() && !profile.achievements.includes(a.name)) {
            profile.achievements.push(a.name);
            profile.coins += 100;
            profile.xp += 50;
            showNotification(`Достижение: ${a.name}! +100 монет 🎉 +50 XP`);
            checkLevelUp();
        }
    });
    updateProfile();
}

function startQuest() {
    const quests = [
        { id: 'play_blackjack', description: 'Сыграй в блекджек 3 раза', goal: 3, reward: 100 },
        { id: 'play_slots', description: 'Сыграй в слоты 5 раз', goal: 5, reward: 150 },
        { id: 'summon_pet', description: 'Призови 2 питомцев', goal: 2, reward: 200 },
        { id: 'collect_items', description: 'Собери 5 предметов', goal: 5, reward: 100 },
        { id: 'win_games', description: 'Выиграй 3 игры подряд', goal: 3, reward: 200 }
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
        if (profile.quests[type].prog
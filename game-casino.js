// game-casino.js
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

// Конец файла game-casino.js
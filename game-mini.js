// game-mini.js
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

// Конец файла game-mini.js
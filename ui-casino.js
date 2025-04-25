// ui-casino.js

// Казино
function showGames() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Казино 🎲</h2>
        <p>Выбери игру:</p>
        <button class="action glass-button" onclick="playCoinFlip()">Орёл или решка (5 энергии)</button>
        <button class="action glass-button" onclick="playSlots()">Слоты (10 энергии)</button>
        <button class="action glass-button" onclick="startBlackjack()">Блэкджек (10 энергии)</button>
        <button class="action glass-button" onclick="playRoulette()">Рулетка (5 энергии)</button>
        <button class="action glass-button" onclick="playPoker()">Покер (15 энергии)</button>
        <button class="action glass-button" onclick="showDepim()">Депим 🎰</button>
    `;
    if (!historyStack.includes('showGames')) {
        historyStack.push('showGames');
    }
    updateProfile();
    applyTheme();
}

// Орёл или решка
function playCoinFlip() {
    if (profile.energy >= 5) {
        profile.energy -= 5;
        const winChance = profile.casinoRig?.coinflip || 0.5; // Подкрутка из админ-панели
        const result = Math.random() < winChance ? 'win' : 'lose';
        if (result === 'win') {
            profile.coins += 20;
            showNotification('Ты выиграл! +20 монет 🎉');
        } else {
            showNotification('Ты проиграл... Попробуй снова! 😿');
        }
        showGames();
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

// Слоты
function playSlots() {
    if (profile.energy >= 10) {
        profile.energy -= 10;
        const winChance = profile.casinoRig?.slots || 0.5; // Подкрутка из админ-панели
        const result = Math.random();
        if (result < (winChance * 0.4)) { // Увеличиваем шанс джекпота
            profile.coins += 100;
            showNotification('Джекпот! +100 монет 🎰');
        } else if (result < winChance) {
            profile.coins += 30;
            showNotification('Неплохо! +30 монет 🎉');
        } else {
            showNotification('Не повезло... Попробуй снова! 😿');
        }
        showGames();
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

// Блэкджек
function startBlackjack() {
    if (profile.energy >= 10) {
        profile.energy -= 10;
        profile.blackjack = {
            playerCards: [],
            dealerCards: [],
            bet: 0,
            hasInsurance: false,
            playerTurn: true,
            doubled: false
        };
        showBlackjackBet();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

function showBlackjackBet() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Блэкджек 🎴</h2>
        <p>Сделай ставку (макс. 1,000,000):</p>
        <input type="number" id="blackjackBet" min="10" max="1000000" value="10">
        <button class="action glass-button" onclick="placeBlackjackBet()">Начать игру</button>
    `;
    applyTheme();
}

function placeBlackjackBet() {
    const betInput = document.getElementById('blackjackBet').value;
    const bet = Math.min(parseInt(betInput), 1000000);
    if (bet < 10) {
        showNotification('Минимальная ставка — 10 монет! 💰');
        return;
    }
    if (profile.coins < bet) {
        showNotification('Недостаточно монет! 💰');
        return;
    }
    profile.coins -= bet;
    profile.blackjack.bet = bet;

    // Выдаём начальные карты
    profile.blackjack.playerCards = [drawCard(), drawCard()];
    profile.blackjack.dealerCards = [drawCard(), drawCard()];
    profile.blackjack.playerTurn = true;

    showBlackjackGame();
}

function drawCard() {
    const value = Math.floor(Math.random() * 10) + 2; // Карты от 2 до 11 (туз как 11)
    return value;
}

function calculateScore(cards) {
    let score = cards.reduce((sum, card) => sum + card, 0);
    let aces = cards.filter(card => card === 11).length;
    while (score > 21 && aces > 0) {
        score -= 10; // Туз становится 1 вместо 11
        aces--;
    }
    return score;
}

function showBlackjackGame() {
    const playerScore = calculateScore(profile.blackjack.playerCards);
    const dealerVisibleCard = profile.blackjack.dealerCards[0];
    const canBuyInsurance = dealerVisibleCard === 11 && !profile.blackjack.hasInsurance && profile.blackjack.bet <= profile.coins;

    if (playerScore > 21) {
        endBlackjackGame('Ты перебрал! Дилер выиграл. 😿');
        return;
    }

    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Блэкджек 🎴</h2>
        <p>Твоя ставка: ${profile.blackjack.bet} 💰</p>
        <p>Твои карты: ${profile.blackjack.playerCards.join(', ')} (Очки: ${playerScore})</p>
        <p>Карта дилера: ${dealerVisibleCard} (вторая карта скрыта)</p>
        ${profile.blackjack.playerTurn ? `
            <button class="action glass-button" onclick="hitCard()">Взять карту 🃏</button>
            <button class="action glass-button" onclick="doubleDown()" ${profile.coins < profile.blackjack.bet || profile.blackjack.doubled ? 'disabled' : ''}>Удвоить ставку (ещё ${profile.blackjack.bet} монет)</button>
            ${canBuyInsurance ? `<button class="action glass-button" onclick="buyInsurance()">Купить страховку (${Math.floor(profile.blackjack.bet * 0.05)} монет)</button>` : ''}
            <button class="action glass-button" onclick="stand()">Остановиться ⏹️</button>
        ` : `
            <p>Раунд завершён. Ожидай результата...</p>
        `}
    `;
    applyTheme();
}

function hitCard() {
    profile.blackjack.playerCards.push(drawCard());
    showBlackjackGame();
}

function doubleDown() {
    if (profile.coins >= profile.blackjack.bet) {
        profile.coins -= profile.blackjack.bet;
        profile.blackjack.bet *= 2;
        profile.blackjack.doubled = true;
        profile.blackjack.playerCards.push(drawCard());
        stand(); // После удвоения игрок сразу останавливается
    } else {
        showNotification('Недостаточно монет для удвоения! 💰');
    }
}

function buyInsurance() {
    const insuranceCost = Math.floor(profile.blackjack.bet * 0.05);
    if (profile.coins >= insuranceCost) {
        profile.coins -= insuranceCost;
        profile.blackjack.hasInsurance = true;
        showNotification(`Страховка куплена за ${insuranceCost} монет! 🛡️`);
        showBlackjackGame();
    } else {
        showNotification('Недостаточно монет для страховки! 💰');
    }
}

function stand() {
    profile.blackjack.playerTurn = false;
    const playerScore = calculateScore(profile.blackjack.playerCards);
    let dealerScore = calculateScore(profile.blackjack.dealerCards);

    // Дилер добирает карты, пока его счёт меньше 17
    while (dealerScore < 17) {
        profile.blackjack.dealerCards.push(drawCard());
        dealerScore = calculateScore(profile.blackjack.dealerCards);
    }

    const winChance = profile.casinoRig?.blackjack || 0.5;
    if (Math.random() < winChance && dealerScore <= 21) {
        dealerScore = Math.min(dealerScore + 2, 21); // Подкрутка для игрока
    }

    let resultMessage = '';
    if (playerScore > 21) {
        resultMessage = 'Ты перебрал! Дилер выиграл. 😿';
    } else if (dealerScore > 21) {
        profile.coins += profile.blackjack.bet * 2;
        resultMessage = `Дилер перебрал (Очки: ${dealerScore})! Ты выиграл +${profile.blackjack.bet * 2} монет! 🎉`;
    } else if (dealerScore === 21 && profile.blackjack.hasInsurance) {
        profile.coins += profile.blackjack.bet * 2;
        resultMessage = `Дилер набрал 21, но у тебя есть страховка! Ты выиграл +${profile.blackjack.bet * 2} монет! 🛡️`;
    } else if (playerScore > dealerScore) {
        profile.coins += profile.blackjack.bet * 2;
        resultMessage = `Ты выиграл! Твои очки: ${playerScore}, дилера: ${dealerScore}. +${profile.blackjack.bet * 2} монет! 🎉`;
    } else if (playerScore === dealerScore) {
        profile.coins += profile.blackjack.bet;
        resultMessage = `Ничья! Твои очки: ${playerScore}, дилера: ${dealerScore}. Ставка возвращена. 🤝`;
    } else {
        resultMessage = `Дилер выиграл... Твои очки: ${playerScore}, дилера: ${dealerScore}. 😿`;
    }

    endBlackjackGame(resultMessage);
}

function endBlackjackGame(resultMessage) {
    const dealerScore = calculateScore(profile.blackjack.dealerCards);
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Блэкджек 🎴</h2>
        <p>Твои карты: ${profile.blackjack.playerCards.join(', ')} (Очки: ${calculateScore(profile.blackjack.playerCards)})</p>
        <p>Карты дилера: ${profile.blackjack.dealerCards.join(', ')} (Очки: ${dealerScore})</p>
        <p>${resultMessage}</p>
        <button class="action glass-button" onclick="startBlackjack()">Играть снова (10 энергии)</button>
    `;
    profile.blackjack = null;
    updateProfile();
    applyTheme();
}

// Рулетка
function playRoulette() {
    if (profile.energy >= 5) {
        profile.energy -= 5;
        const color = Math.random() > 0.5 ? 'red' : 'black';
        const playerBet = Math.random() > 0.5 ? 'red' : 'black'; // Упрощённая ставка
        const winChance = profile.casinoRig?.roulette || 0.5; // Подкрутка из админ-панели
        const isWin = Math.random() < winChance ? (color === playerBet) : (color !== playerBet);
        if (isWin) {
            profile.coins += 30;
            showNotification(`Выпало ${color}! Ты выиграл! +30 монет 🎉`);
        } else {
            showNotification(`Выпало ${color}! Ты проиграл... 😿`);
        }
        showGames();
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

// Покер
function playPoker() {
    if (profile.energy >= 15) {
        profile.energy -= 15;
        const winChance = profile.casinoRig?.poker || 0.5; // Подкрутка из админ-панели
        const playerHand = Math.random() < winChance ? Math.floor(Math.random() * 5) + 6 : Math.floor(Math.random() * 10) + 1; // Увеличиваем шанс игрока
        const dealerHand = Math.floor(Math.random() * 10) + 1;
        if (playerHand > dealerHand) {
            profile.coins += 70;
            showNotification(`Твоя рука: ${playerHand}, дилера: ${dealerHand}. Ты выиграл! +70 монет 🎉`);
        } else if (playerHand === dealerHand) {
            showNotification(`Твоя рука: ${playerHand}, дилера: ${dealerHand}. Ничья! 🤝`);
        } else {
            showNotification(`Твоя рука: ${playerHand}, дилера: ${dealerHand}. Ты проиграл... 😿`);
        }
        showGames();
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

// Депим (ставка недвижимости в казино)
function showDepim() {
    const properties = profile.items.filter(item => item.includes('Дом') || item.includes('Машина') || item.includes('Бизнес') || item.includes('Яхта') || item.includes('Самолёт') || item.includes('Вилла') || item.includes('Завод') || item.includes('Ранчо'));
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Депим 🎰</h2>
        <p>Поставь свою недвижимость и выиграй x2, x3, x5 или x10!</p>
        ${properties.length > 0 ? `
            <p>Твоя недвижимость:</p>
            ${properties.map((item, index) => `
                <button class="action glass-button" onclick="depimProperty('${item}', ${index})">${item} (Ставка)</button>
            `).join('')}
        ` : '<p>У тебя нет недвижимости для ставки. Купи её в разделе "Недвижимость"!</p>'}
    `;
    if (!historyStack.includes('showDepim')) {
        historyStack.push('showDepim');
    }
    updateProfile();
    applyTheme();
}

function depimProperty(property, index) {
    const propertyValues = {
        'Дом': 500,
        'Машина': 1000,
        'Бизнес': 2000,
        'Яхта': 3000,
        'Самолёт': 5000,
        'Вилла': 7000,
        'Завод': 10000,
        'Ранчо': 12000
    };
    const baseValue = propertyValues[property.split(' ')[0]] || 500;
    const winChance = profile.casinoRig?.depim || 0.6; // Подкрутка из админ-панели
    const result = Math.random();

    if (result < winChance) {
        if (result > 0.99) { // 1% шанс на x10
            const multiplier = 10;
            const winnings = baseValue * multiplier;
            profile.coins += winnings;
            showNotification(`Удача! Ты выиграл x${multiplier}! +${winnings} монет 🎉`);
        } else if (result > 0.94) { // 5% шанс на x5
            const multiplier = 5;
            const winnings = baseValue * multiplier;
            profile.coins += winnings;
            showNotification(`Круто! Ты выиграл x${multiplier}! +${winnings} монет 🎉`);
        } else if (result > 0.7) { // 24% шанс на x3
            const multiplier = 3;
            const winnings = baseValue * multiplier;
            profile.coins += winnings;
            showNotification(`Поздравляем! Ты выиграл x${multiplier}! +${winnings} монет 🎉`);
        } else { // 30% шанс на x2
            const multiplier = 2;
            const winnings = baseValue * multiplier;
            profile.coins += winnings;
            showNotification(`Неплохо! Ты выиграл x${multiplier}! +${winnings} монет 🎉`);
        }
    } else { // Проигрыш
        profile.items.splice(index, 1); // Удаляем недвижимость только при проигрыше
        showNotification(`Ты проиграл... Недвижимость (${property}) потеряна 😿`);
    }
    showDepim();
    updateProfile();
}
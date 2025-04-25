// ui-casino.js

// Казино
function showGames() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Казино 🎲</h2>
        <p>Выбери игру:</p>
        <button class="action glass-button" onclick="playCoinFlip()">Орёл или решка (5 энергии)</button>
        <button class="action glass-button" onclick="playSlots()">Слоты (10 энергии)</button>
        <button class="action glass-button" onclick="playBlackjack()">Блэкджек (10 энергии)</button>
        <button class="action glass-button" onclick="playRoulette()">Рулетка (5 энергии)</button>
        <button class="action glass-button" onclick="playPoker()">Покер (15 энергии)</button>
        <button class="action glass-button" onclick="showDepim()">Депим 🎰</button>
    `;
    if (!historyStack.includes('showGames')) {
        historyStack.push('showGames');
    }
    updateProfile();
}

// Орёл или решка
function playCoinFlip() {
    if (profile.energy >= 5) {
        profile.energy -= 5;
        const result = Math.random() > 0.5 ? 'win' : 'lose';
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
        const result = Math.random();
        if (result > 0.8) {
            profile.coins += 100;
            showNotification('Джекпот! +100 монет 🎰');
        } else if (result > 0.5) {
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
function playBlackjack() {
    if (profile.energy >= 10) {
        profile.energy -= 10;
        let playerScore = Math.floor(Math.random() * 11) + 10; // Игрок получает от 10 до 21
        let dealerScore = Math.floor(Math.random() * 11) + 10; // Дилер получает от 10 до 21

        document.getElementById('main-content').innerHTML = `
            <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
            <h2>Блэкджек 🎴</h2>
            <p>Твои очки: ${playerScore}</p>
            <p>Очки дилера: ${dealerScore}</p>
            <p>${playerScore > 21 ? 'Ты перебрал! 😿' : dealerScore > 21 || playerScore > dealerScore ? 'Ты выиграл! +50 монет 🎉' : playerScore === dealerScore ? 'Ничья! 🤝' : 'Дилер выиграл... 😿'}</p>
            <button class="action glass-button" onclick="playBlackjack()">Играть снова (10 энергии)</button>
        `;
        if (playerScore <= 21 && (dealerScore > 21 || playerScore > dealerScore)) {
            profile.coins += 50;
        }
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

// Рулетка
function playRoulette() {
    if (profile.energy >= 5) {
        profile.energy -= 5;
        const color = Math.random() > 0.5 ? 'red' : 'black';
        const playerBet = Math.random() > 0.5 ? 'red' : 'black'; // Упрощённая ставка
        if (color === playerBet) {
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
        const playerHand = Math.floor(Math.random() * 10) + 1; // Упрощённая рука (1-10)
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
        <p>Поставь свою недвижимость и выиграй x2 или x3!</p>
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
    const result = Math.random();
    profile.items.splice(index, 1); // Удаляем недвижимость из инвентаря

    if (result > 0.7) {
        const multiplier = 3;
        const winnings = baseValue * multiplier;
        profile.coins += winnings;
        showNotification(`Поздравляем! Ты выиграл x${multiplier}! +${winnings} монет 🎉`);
    } else if (result > 0.4) {
        const multiplier = 2;
        const winnings = baseValue * multiplier;
        profile.coins += winnings;
        showNotification(`Неплохо! Ты выиграл x${multiplier}! +${winnings} монет 🎉`);
    } else {
        showNotification(`Ты проиграл... Недвижимость (${property}) потеряна 😿`);
    }
    showDepim();
    updateProfile();
}
profile.casinoLossStreak = profile.casinoLossStreak || 0;

function showGames() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Казино 🎲</h2>
        <p>Попробуй удачу!</p>
        <button class="action glass-button" onclick="playCoinFlip()">Орёл или Решка (10 монет)</button>
        <button class="action glass-button" onclick="playSlots()">Слоты (20 монет)</button>
        <button class="action glass-button" onclick="playBlackjack()">Блэкджек (30 монет)</button>
        <button class="action glass-button" onclick="playRoulette()">Рулетка (40 монет)</button>
        <button class="action glass-button" onclick="playPoker()">Покер (50 монет)</button>
        <button class="action glass-button" onclick="playDepim()">Депим (60 монет)</button>
    `;
    if (!historyStack.includes('showGames')) {
        historyStack.push('showGames');
    }
    updateProfile();
    applyTheme();
}

function updateLossStreak(result) {
    if (result) {
        profile.casinoLossStreak = 0; // Сбрасываем стрик при победе
    } else {
        profile.casinoLossStreak++;
        if (profile.casinoLossStreak >= 3) {
            checkSecret('casino_loss_3');
        }
    }
}

function playCoinFlip() {
    if (profile.coins >= 10) {
        profile.coins -= 10;
        const winChance = profile.casinoRig?.coinflip || 0.5;
        const result = Math.random() < winChance;
        updateLossStreak(result);
        if (result) {
            profile.coins += 20;
            showNotification('Победа! +20 монет 🪙');
        } else {
            showNotification('Проигрыш! Попробуй снова. 🪙');
        }
        showGames();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function playSlots() {
    if (profile.coins >= 20) {
        profile.coins -= 20;
        const winChance = profile.casinoRig?.slots || 0.5;
        const result = Math.random() < winChance;
        updateLossStreak(result);
        if (result) {
            profile.coins += 40;
            showNotification('Джекпот! +40 монет 🎰');
        } else {
            showNotification('Проигрыш! Попробуй снова. 🎰');
        }
        showGames();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function playBlackjack() {
    if (profile.coins >= 30) {
        profile.coins -= 30;
        const winChance = profile.casinoRig?.blackjack || 0.5;
        const result = Math.random() < winChance;
        updateLossStreak(result);
        if (result) {
            profile.coins += 60;
            showNotification('Победа! +60 монет 🃏');
        } else {
            showNotification('Проигрыш! Попробуй снова. 🃏');
        }
        showGames();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function playRoulette() {
    if (profile.coins >= 40) {
        profile.coins -= 40;
        const winChance = profile.casinoRig?.roulette || 0.5;
        const result = Math.random() < winChance;
        updateLossStreak(result);
        if (result) {
            profile.coins += 80;
            showNotification('Победа! +80 монет 🎡');
        } else {
            showNotification('Проигрыш! Попробуй снова. 🎡');
        }
        showGames();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function playPoker() {
    if (profile.coins >= 50) {
        profile.coins -= 50;
        const winChance = profile.casinoRig?.poker || 0.5;
        const result = Math.random() < winChance;
        updateLossStreak(result);
        if (result) {
            profile.coins += 100;
            showNotification('Победа! +100 монет ♠️');
        } else {
            showNotification('Проигрыш! Попробуй снова. ♠️');
        }
        showGames();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function playDepim() {
    if (profile.coins >= 60) {
        profile.coins -= 60;
        const winChance = profile.casinoRig?.depim || 0.6;
        const result = Math.random() < winChance;
        updateLossStreak(result);
        if (result) {
            profile.coins += 120;
            showNotification('Победа! +120 монет 🎲');
        } else {
            showNotification('Проигрыш! Попробуй снова. 🎲');
        }
        showGames();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}
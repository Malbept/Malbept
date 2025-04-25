function showAdminPanel() {
    const password = prompt('Введите пароль для админ-панели:');
    if (password === '2720') {
        document.getElementById('main-content').innerHTML = `
            <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
            <h2>Админ-панель 🔧</h2>
            <p>Управление профилем:</p>
            <button class="action glass-button" onclick="adminAddCoins(1000)">Добавить 1000 монет 💰</button>
            <button class="action glass-button" onclick="adminAddEnergy(50)">Добавить 50 энергии ⚡</button>
            <button class="action glass-button" onclick="adminAddItem('Энергетик')">Добавить Энергетик ⚡</button>
            <button class="action glass-button" onclick="adminAddItem('Золотой ключ')">Добавить Золотой ключ 🔑</button>
            <h3>Подкрутка казино 🎰</h3>
            <p>Орёл/Решка:</p>
            <input type="number" id="coinflipChance" min="0" max="100" value="${(profile.casinoRig?.coinflip || 0.5) * 100}">
            <button class="action glass-button" onclick="setCasinoRig('coinflip')">Установить % победы</button>
            <p>Слоты:</p>
            <input type="number" id="slotsChance" min="0" max="100" value="${(profile.casinoRig?.slots || 0.5) * 100}">
            <button class="action glass-button" onclick="setCasinoRig('slots')">Установить % победы</button>
            <p>Блэкджек:</p>
            <input type="number" id="blackjackChance" min="0" max="100" value="${(profile.casinoRig?.blackjack || 0.5) * 100}">
            <button class="action glass-button" onclick="setCasinoRig('blackjack')">Установить % победы</button>
            <p>Рулетка:</p>
            <input type="number" id="rouletteChance" min="0" max="100" value="${(profile.casinoRig?.roulette || 0.5) * 100}">
            <button class="action glass-button" onclick="setCasinoRig('roulette')">Установить % победы</button>
            <p>Покер:</p>
            <input type="number" id="pokerChance" min="0" max="100" value="${(profile.casinoRig?.poker || 0.5) * 100}">
            <button class="action glass-button" onclick="setCasinoRig('poker')">Установить % победы</button>
            <p>Депим:</p>
            <input type="number" id="depimChance" min="0" max="100" value="${(profile.casinoRig?.depim || 0.6) * 100}">
            <button class="action glass-button" onclick="setCasinoRig('depim')">Установить % победы</button>
            <button class="action glass-button" onclick="resetCasinoRig()">Сбросить подкрутку</button>
        `;
        if (!historyStack.includes('showAdminPanel')) {
            historyStack.push('showAdminPanel');
        }
    } else {
        showNotification('Неверный пароль! 🚫');
    }
    applyTheme();
}

function setCasinoRig(game) {
    const chanceInput = document.getElementById(`${game}Chance`).value;
    const winChance = Math.min(Math.max(parseInt(chanceInput) / 100, 0), 1);
    profile.casinoRig = profile.casinoRig || {};
    profile.casinoRig[game] = winChance;
    showNotification(`Подкрутка для ${game} установлена на ${winChance * 100}% победы! 🎰`);
    showAdminPanel();
    updateProfile();
}

function resetCasinoRig() {
    profile.casinoRig = {};
    showNotification('Подкрутка казино сброшена! 🎰');
    showAdminPanel();
    updateProfile();
}

function adminAddCoins(amount) {
    profile.coins += amount;
    showNotification(`Добавлено ${amount} монет! 💰`);
    showAdminPanel();
    updateProfile();
}

function adminAddEnergy(amount) {
    profile.energy += amount;
    if (profile.energy > profile.maxEnergy) profile.energy = profile.maxEnergy;
    showNotification(`Добавлено ${amount} энергии! ⚡`);
    showAdminPanel();
    updateProfile();
}

function adminAddItem(item) {
    profile.items.push(item);
    showNotification(`Добавлен предмет: ${item}! 🧳`);
    showAdminPanel();
    updateProfile();
}
// ui-main.js

// Глобальная переменная для хранения истории навигации
let historyStack = ['main'];

// Функция для отображения уведомлений
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Функция для обновления профиля
function updateProfile() {
    const profileDiv = document.getElementById('profile');
    if (profile && profileDiv) {
        profileDiv.innerHTML = `
            <p>Монеты: ${profile.coins} 💰</p>
            <p>Энергия: ${profile.energy}/${profile.maxEnergy} ⚡</p>
            ${profile.event ? `<p>Событие: ${profile.event.progress}/${profile.event.goal} 🎯</p>` : ''}
        `;
    }
    if (typeof saveProfile === 'function') {
        saveProfile();
    }
}

// Применение темы
function applyTheme() {
    document.body.className = ''; // Сбрасываем все классы
    document.body.classList.add(`${profile.theme}-theme`);
}

// Основной экран
function showMain() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()" style="display: none;">Назад ⬅️</button>
        <h2>Добро пожаловать! 🚀</h2>
        <p>Выбери раздел, чтобы начать! 😺</p>
        <p>💡 Прокрути нижнюю панель, чтобы найти "Квесты" и "Заработок"!</p>
    `;
    historyStack = ['main'];
    updateProfile();
    applyTheme();
}

// Профиль
function showProfile() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Профиль 👤</h2>
        <p>Монеты: ${profile.coins} 💰</p>
        <p>Энергия: ${profile.energy}/${profile.maxEnergy} ⚡</p>
        <p>Предметы: ${profile.items.length} 🧳</p>
        ${profile.event ? `<p>Событие: ${profile.event.progress}/${profile.event.goal} 🎯</p>` : ''}
        <button class="action glass-button" onclick="increaseMaxEnergy()">Увеличить макс. энергию (500 монет)</button>
    `;
    if (!historyStack.includes('showProfile')) {
        historyStack.push('showProfile');
    }
    updateProfile();
    applyTheme();
}

function increaseMaxEnergy() {
    if (profile.coins >= 500) {
        profile.coins -= 500;
        profile.maxEnergy += 10;
        showNotification('Максимальная энергия увеличена на 10! ⚡');
        showProfile();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

// Инвентарь
function showInventory() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Инвентарь 🎒</h2>
        <p>Твои предметы:</p>
        <p>${profile.items.join(', ') || 'Инвентарь пуст.'}</p>
        ${profile.items.includes('Энергетик') ? `<button class="action glass-button" onclick="useEnergyDrink()">Использовать Энергетик ⚡</button>` : ''}
        ${profile.items.includes('Супер Энергетик') ? `<button class="action glass-button" onclick="useSuperEnergyDrink()">Использовать Супер Энергетик ⚡</button>` : ''}
        ${profile.items.includes('Счастливый талисман') ? `<button class="action glass-button" onclick="useLuckyCharm()">Использовать Счастливый талисман 🍀</button>` : ''}
    `;
    if (!historyStack.includes('showInventory')) {
        historyStack.push('showInventory');
    }
    updateProfile();
    applyTheme();
}

function useEnergyDrink() {
    const index = profile.items.indexOf('Энергетик');
    if (index !== -1) {
        profile.items.splice(index, 1);
        profile.energy = profile.maxEnergy;
        showNotification('Энергия полностью восстановлена! ⚡');
        showInventory();
        updateProfile();
    }
}

function useSuperEnergyDrink() {
    const index = profile.items.indexOf('Супер Энергетик');
    if (index !== -1) {
        profile.items.splice(index, 1);
        profile.energy = profile.maxEnergy;
        profile.maxEnergy += 5;
        showNotification('Энергия восстановлена и максимум увеличен на 5! ⚡');
        showInventory();
        updateProfile();
    }
}

function useLuckyCharm() {
    const index = profile.items.indexOf('Счастливый талисман');
    if (index !== -1) {
        profile.items.splice(index, 1);
        profile.luckyCharmActive = true;
        setTimeout(() => {
            profile.luckyCharmActive = false;
            showNotification('Эффект Счастливого талисмана закончился. 🍀');
        }, 300000);
        showNotification('Счастливый талисман активирован! Удача на вашей стороне (5 минут). 🍀');
        showInventory();
        updateProfile();
    }
}

// Другое
function showOther() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Другое ⚙️</h2>
        <p>Дополнительные функции</p>
        <button class="action glass-button" onclick="resetProgress()">Сбросить прогресс</button>
        <button class="action glass-button" onclick="showAdminPanel()" style="opacity: 0.1;">🔧</button>
        <h3>Смена темы 🎨</h3>
        <button class="action glass-button" onclick="changeTheme('default')">Стоковая тема</button>
        <button class="action glass-button" onclick="changeTheme('red')">Красная тема</button>
        <button class="action glass-button" onclick="changeTheme('blue')">Синяя тема</button>
        <button class="action glass-button" onclick="changeTheme('purple')">Фиолетовая тема</button>
        <button class="action glass-button" onclick="changeTheme('dark')">Тёмная тема</button>
        <button class="action glass-button" onclick="changeTheme('green')">Зелёная тема</button>
        <button class="action glass-button" onclick="changeTheme('orange')">Оранжевая тема</button>
        <button class="action glass-button" onclick="changeTheme('cyan')">Циановая тема</button>
        <button class="action glass-button" onclick="changeTheme('pink')">Розовая тема</button>
        <button class="action glass-button" onclick="changeTheme('teal')">Бирюзовая тема</button>
        <button class="action glass-button" onclick="changeTheme('gold')">Золотая тема</button>
    `;
    if (!historyStack.includes('showOther')) {
        historyStack.push('showOther');
    }
    updateProfile();
    applyTheme();
}

function changeTheme(theme) {
    profile.theme = theme;
    applyTheme();
    showNotification(`Тема изменена на ${theme === 'default' ? 'стоковую' : theme === 'red' ? 'красную' : theme === 'blue' ? 'синюю' : theme === 'purple' ? 'фиолетовую' : theme === 'dark' ? 'тёмную' : theme === 'green' ? 'зелёную' : theme === 'orange' ? 'оранжевую' : theme === 'cyan' ? 'циановую' : theme === 'pink' ? 'розовую' : theme === 'teal' ? 'бирюзовую' : 'золотую'}! 🎨`);
    showOther();
    updateProfile();
}

function resetProgress() {
    if (confirm('Вы уверены, что хотите сбросить прогресс? Это действие нельзя отменить!')) {
        localStorage.removeItem('lapulya_profile');
        showNotification('Прогресс сброшен! Перезагрузите страницу.');
        showOther();
    }
}

// Админ-панель
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
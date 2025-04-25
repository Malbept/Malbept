// ui.js

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

// Основной экран
function showMain() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()" style="display: none;">Назад ⬅️</button>
        <h2>Добро пожаловать! 🚀</h2>
        <p>Выбери раздел, чтобы начать! 😺</p>
    `;
    historyStack = ['main'];
    updateProfile();
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
    `;
    if (!historyStack.includes('showProfile')) {
        historyStack.push('showProfile');
    }
    updateProfile();
}

// Питомцы
function showPets() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Питомцы 🐾</h2>
        <p>Твои питомцы:</p>
        <p>${profile.items.filter(item => item.includes('Питомец')).join(', ') || 'У тебя пока нет питомцев.'}</p>
        <button class="action glass-button" onclick="adoptPet()">Приютить питомца (100 монет)</button>
    `;
    if (!historyStack.includes('showPets')) {
        historyStack.push('showPets');
    }
    updateProfile();
}

function adoptPet() {
    if (profile.coins >= 100) {
        profile.coins -= 100;
        profile.items.push(`Питомец ${profile.items.length + 1}`);
        showNotification('Новый питомец добавлен! 🐾');
        showPets();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

// Коллекции
function showCollections() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Коллекции 🧺</h2>
        <p>Собери коллекцию предметов!</p>
        <p>Предметы: ${profile.items.join(', ') || 'У тебя пока нет предметов.'}</p>
    `;
    if (!historyStack.includes('showCollections')) {
        historyStack.push('showCollections');
    }
    updateProfile();
}

// Инвентарь
function showInventory() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Инвентарь 🎒</h2>
        <p>Твои предметы:</p>
        <p>${profile.items.join(', ') || 'Инвентарь пуст.'}</p>
    `;
    if (!historyStack.includes('showInventory')) {
        historyStack.push('showInventory');
    }
    updateProfile();
}

// Магазин
function showShop() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Магазин 🏪</h2>
        <p>Купи что-нибудь интересное!</p>
        <button class="action glass-button" onclick="buyItem('Золотой ключ', 50)">Золотой ключ (50 монет) 🔑</button>
        <button class="action glass-button" onclick="buyItem('Энергетик', 20)">Энергетик (20 монет) ⚡</button>
    `;
    if (!historyStack.includes('showShop')) {
        historyStack.push('showShop');
    }
    updateProfile();
}

function buyItem(item, cost) {
    if (profile.coins >= cost) {
        profile.coins -= cost;
        profile.items.push(item);
        showNotification(`Куплен: ${item}! 🎉`);
        showShop();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

// Игры (Казино)
function showGames() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Казино 🎲</h2>
        <p>Выбери игру:</p>
        <button class="action glass-button" onclick="playCoinFlip()">Орёл или решка (5 энергии)</button>
        <button class="action glass-button" onclick="playSlots()">Слоты (10 энергии)</button>
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

// Депим (ставка недвижимости в казино)
function showDepim() {
    const properties = profile.items.filter(item => item.includes('Дом') || item.includes('Машина') || item.includes('Бизнес'));
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
        'Бизнес': 2000
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

// Награды
function showRewards() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Награды 🎁</h2>
        <p>Получи свои награды!</p>
        <button class="action glass-button" onclick="claimDailyReward()">Ежедневная награда</button>
    `;
    if (!historyStack.includes('showRewards')) {
        historyStack.push('showRewards');
    }
    updateProfile();
}

function claimDailyReward() {
    const lastClaim = localStorage.getItem('lastDailyReward');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastClaim || now - lastClaim > oneDay) {
        profile.coins += 50;
        localStorage.setItem('lastDailyReward', now);
        showNotification('Ежедневная награда получена! +50 монет 🎉');
        showRewards();
        updateProfile();
    } else {
        showNotification('Награда уже получена! Попробуй завтра. ⏳');
    }
}

// Недвижимость
function showRealEstate() {
    const properties = profile.items.filter(item => item.includes('Дом') || item.includes('Машина') || item.includes('Бизнес'));
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Недвижимость 🏡</h2>
        <p>Покупай недвижимость и получай пассивный доход!</p>
        <button class="action glass-button" onclick="buyProperty('Дом', 500)">Купить Дом (500 монет)</button>
        <button class="action glass-button" onclick="buyProperty('Машина', 1000)">Купить Машину (1000 монет)</button>
        <button class="action glass-button" onclick="buyProperty('Бизнес', 2000)">Купить Бизнес (2000 монет)</button>
        <h3>Твоя недвижимость:</h3>
        ${properties.length > 0 ? properties.map((item, index) => `
            <p>${item} <button class="action glass-button" onclick="sellProperty('${item}', ${index})">Продать за ${(item.includes('Дом') ? 250 : item.includes('Машина') ? 500 : 1000)} монет</button></p>
        `).join('') : '<p>У тебя пока нет недвижимости.</p>'}
    `;
    if (!historyStack.includes('showRealEstate')) {
        historyStack.push('showRealEstate');
    }
    updateProfile();
}

function buyProperty(type, cost) {
    if (profile.coins >= cost) {
        profile.coins -= cost;
        const propertyName = `${type} ${profile.items.filter(item => item.includes(type)).length + 1}`;
        profile.items.push(propertyName);
        showNotification(`Куплено: ${propertyName}! 🏡`);
        // Добавляем пассивный доход
        setInterval(() => {
            if (profile.items.includes(propertyName)) {
                const income = type === 'Дом' ? 10 : type === 'Машина' ? 20 : 50;
                profile.coins += income;
                showNotification(`Пассивный доход от ${propertyName}: +${income} монет 💸`);
                updateProfile();
            }
        }, 600000); // 10 минут
        showRealEstate();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function sellProperty(property, index) {
    const propertyValues = {
        'Дом': 250,
        'Машина': 500,
        'Бизнес': 1000
    };
    const baseValue = propertyValues[property.split(' ')[0]] || 250;
    profile.coins += baseValue;
    profile.items.splice(index, 1);
    showNotification(`Продано: ${property} за ${baseValue} монет 💸`);
    showRealEstate();
    updateProfile();
}

// Квесты
function showQuests() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Квесты 📜</h2>
        <p>Выполняй квесты и получай награды!</p>
        <button class="action glass-button" onclick="startQuest()">Начать квест (5 энергии)</button>
    `;
    if (!historyStack.includes('showQuests')) {
        historyStack.push('showQuests');
    }
    updateProfile();
}

function startQuest() {
    if (profile.energy >= 5) {
        profile.energy -= 5;
        setTimeout(() => {
            profile.coins += 30;
            showNotification('Квест завершён! +30 монет 🏆');
            updateProfile();
        }, 3000);
        showNotification('Квест начат! Ожидайте 3 секунды... ⏳');
        showQuests();
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

// Поиск сокровищ
function showTreasureHunt() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Поиск сокровищ 🔍</h2>
        <p>Найди сокровища!</p>
        <button class="action glass-button" onclick="startTreasureHunt()">Искать (10 энергии)</button>
    `;
    if (!historyStack.includes('showTreasureHunt')) {
        historyStack.push('showTreasureHunt');
    }
    updateProfile();
}

function startTreasureHunt() {
    if (profile.energy >= 10) {
        profile.energy -= 10;
        const reward = Math.random() > 0.5 ? 'Сокровище' : 'Ничего';
        if (reward === 'Сокровище') {
            profile.coins += 100;
            profile.items.push('Сокровище');
            showNotification('Сокровище найдено! +100 монет 💎');
        } else {
            showNotification('Ничего не найдено... Попробуй снова! 😿');
        }
        showTreasureHunt();
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

// Колесо фортуны
function showWheel() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Колесо фортуны 🎡</h2>
        <p>Испытай удачу!</p>
        <button class="action glass-button" onclick="spinWheel()">Крутить (5 энергии)</button>
    `;
    if (!historyStack.includes('showWheel')) {
        historyStack.push('showWheel');
    }
    updateProfile();
}

function spinWheel() {
    if (profile.energy >= 5) {
        profile.energy -= 5;
        const prizes = [10, 20, 50, 100, 'Питомец'];
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        if (typeof prize === 'number') {
            profile.coins += prize;
            showNotification(`Вы выиграли ${prize} монет! 🎉`);
        } else {
            profile.items.push(`Питомец ${profile.items.length + 1}`);
            showNotification(`Вы выиграли питомца! 🐾`);
        }
        showWheel();
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

// Заработок
function showEarn() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Заработок 💸</h2>
        <p>Зарабатывай монеты!</p>
        <button class="action glass-button" onclick="earnCoins()">Заработать (5 энергии)</button>
    `;
    if (!historyStack.includes('showEarn')) {
        historyStack.push('showEarn');
    }
    updateProfile();
}

function earnCoins() {
    if (profile.energy >= 5) {
        profile.energy -= 5;
        const earned = Math.floor(Math.random() * 20) + 10;
        profile.coins += earned;
        showNotification(`Заработано ${earned} монет! 💸`);
        showEarn();
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

// Друзья
function showFriends() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Друзья 👥</h2>
        <p>Пригласи друга и получи бонус!</p>
        <input type="text" id="friendCode" placeholder="Введите код друга">
        <button class="action glass-button" onclick="inviteFriend()">Пригласить</button>
    `;
    if (!historyStack.includes('showFriends')) {
        historyStack.push('showFriends');
    }
    updateProfile();
}

function inviteFriend() {
    const friendCode = document.getElementById('friendCode').value;
    if (friendCode) {
        profile.coins += 20;
        showNotification('Друг приглашён! +20 монет 🎉');
        showFriends();
        updateProfile();
    } else {
        showNotification('Введите код друга! 📝');
    }
}

// Турниры
function showTournaments() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Турниры 🏆</h2>
        <p>Соревнуйся с другими игроками!</p>
        <button class="action glass-button" onclick="joinTournament()">Участвовать (10 энергии)</button>
    `;
    if (!historyStack.includes('showTournaments')) {
        historyStack.push('showTournaments');
    }
    updateProfile();
}

function joinTournament() {
    if (profile.energy >= 10) {
        profile.energy -= 10;
        const place = Math.floor(Math.random() * 3) + 1;
        const rewards = { 1: 100, 2: 50, 3: 20 };
        profile.coins += rewards[place];
        showNotification(`Ты занял ${place} место! +${rewards[place]} монет 🏆`);
        showTournaments();
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

// Сезонный пропуск
function showSeasonPass() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Сезонный пропуск 🎟️</h2>
        <p>Получай награды за прогресс!</p>
        <p>Твой уровень: ${profile.level || 1}</p>
        <button class="action glass-button" onclick="levelUp()">Повысить уровень (50 монет)</button>
    `;
    if (!historyStack.includes('showSeasonPass')) {
        historyStack.push('showSeasonPass');
    }
    updateProfile();
}

function levelUp() {
    if (profile.coins >= 50) {
        profile.coins -= 50;
        profile.level = (profile.level || 1) + 1;
        showNotification(`Уровень повышен! Твой уровень: ${profile.level} 🎉`);
        showSeasonPass();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

// Другое
function showOther() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Другое ⚙️</h2>
        <p>Дополнительные функции</p>
        <button class="action glass-button" onclick="resetProgress()">Сбросить прогресс</button>
    `;
    if (!historyStack.includes('showOther')) {
        historyStack.push('showOther');
    }
    updateProfile();
}

function resetProgress() {
    if (confirm('Вы уверены, что хотите сбросить прогресс? Это действие нельзя отменить!')) {
        localStorage.removeItem('lapulya_profile');
        showNotification('Прогресс сброшен! Перезагрузите страницу.');
        showOther();
    }
}
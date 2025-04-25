// ui-social.js

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

// Квесты
function showQuests() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Квесты 📜</h2>
        <p>Выполняй квесты и получай награды!</p>
        <button class="action glass-button" onclick="startQuest()">Начать квест (5 энергии)</button>
        <button class="action glass-button" onclick="startDailyQuest()">Ежедневный квест (10 энергии)</button>
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

function startDailyQuest() {
    const lastQuest = localStorage.getItem('lastDailyQuest');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastQuest || now - lastQuest > oneDay) {
        if (profile.energy >= 10) {
            profile.energy -= 10;
            profile.coins += 100;
            localStorage.setItem('lastDailyQuest', now);
            showNotification('Ежедневный квест завершён! +100 монет 🏆');
            showQuests();
            updateProfile();
        } else {
            showNotification('Недостаточно энергии! ⚡');
        }
    } else {
        showNotification('Ежедневный квест уже выполнен! Попробуй завтра. ⏳');
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
        <button class="action glass-button" onclick="showClans()">Кланы 🏰</button>
        <button class="action glass-button" onclick="showChat()">Чат 💬</button>
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

// Кланы
function showClans() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Кланы 🏰</h2>
        <p>Создай или вступи в клан!</p>
        <button class="action glass-button" onclick="createClan()">Создать клан (500 монет)</button>
        <button class="action glass-button" onclick="joinClan()">Вступить в клан (100 монет)</button>
    `;
    if (!historyStack.includes('showClans')) {
        historyStack.push('showClans');
    }
    updateProfile();
}

function createClan() {
    if (profile.coins >= 500) {
        profile.coins -= 500;
        profile.clan = `Клан ${Math.floor(Math.random() * 1000)}`;
        showNotification(`Клан ${profile.clan} создан! 🏰`);
        showClans();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function joinClan() {
    if (profile.coins >= 100) {
        profile.coins -= 100;
        profile.clan = `Клан ${Math.floor(Math.random() * 1000)}`;
        showNotification(`Ты вступил в ${profile.clan}! 🏰`);
        showClans();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

// Чат
function showChat() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Чат 💬</h2>
        <p>Общайся с другими игроками!</p>
        <input type="text" id="chatMessage" placeholder="Напиши сообщение">
        <button class="action glass-button" onclick="sendMessage()">Отправить</button>
        <div id="chatMessages"></div>
    `;
    if (!historyStack.includes('showChat')) {
        historyStack.push('showChat');
    }
    updateProfile();
}

function sendMessage() {
    const message = document.getElementById('chatMessage').value;
    if (message) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML += `<p>Ты: ${message}</p>`;
        document.getElementById('chatMessage').value = '';
        setTimeout(() => {
            chatMessages.innerHTML += `<p>Бот: Привет! Классное сообщение! 😺</p>`;
        }, 1000);
    } else {
        showNotification('Напиши сообщение! 📝');
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
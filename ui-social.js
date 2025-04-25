profile.quests = profile.quests || [];
profile.seasonProgress = profile.seasonProgress || 0;

// Квесты
function showQuests() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Квесты 📜</h2>
        <p>Выполняй квесты и получай награды!</p>
        <button class="action glass-button" onclick="startQuest()">Начать квест (5 энергии)</button>
        <button class="action glass-button" onclick="startDailyQuest()">Ежедневный квест (10 энергии)</button>
        <h3>Активные квесты:</h3>
        ${profile.quests.length > 0 ? profile.quests.map((quest, index) => `
            <p>${quest.name}: ${quest.progress}/${quest.goal} 
            <button class="action glass-button" onclick="completeQuest(${index})">Завершить</button></p>
        `).join('') : '<p>Нет активных квестов.</p>'}
    `;
    if (!historyStack.includes('showQuests')) {
        historyStack.push('showQuests');
    }
    updateProfile();
    applyTheme();
}

function startQuest() {
    if (profile.energy >= 5) {
        profile.energy -= 5;
        const quest = { name: `Квест ${profile.quests.length + 1}`, progress: 0, goal: 3 };
        profile.quests.push(quest);
        showNotification('Новый квест начат! Выполните 3 действия. 📜');
        showQuests();
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

function completeQuest(index) {
    const quest = profile.quests[index];
    quest.progress++;
    if (quest.progress >= quest.goal) {
        profile.coins += 30;
        profile.seasonProgress += 10;
        showNotification(`Квест завершён! +30 монет 🏆`);
        profile.quests.splice(index, 1);
    }
    showQuests();
    updateProfile();
}

function startDailyQuest() {
    const lastQuest = localStorage.getItem('lastDailyQuest');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastQuest || now - lastQuest > oneDay) {
        if (profile.energy >= 10) {
            profile.energy -= 10;
            const quest = { name: 'Ежедневный квест', progress: 0, goal: 5 };
            profile.quests.push(quest);
            localStorage.setItem('lastDailyQuest', now);
            showNotification('Ежедневный квест начат! Выполните 5 действий. 📜');
            showQuests();
            updateProfile();
        } else {
            showNotification('Недостаточно энергии! ⚡');
        }
    } else {
        showNotification('Ежедневный квест уже выполнен! Попробуй завтра. ⏳');
    }
}

// Заработок
function showEarn() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Заработок 💸</h2>
        <p>Зарабатывай монеты!</p>
        <button class="action glass-button" onclick="earnCoins('Работа', 10)">Работа (5 энергии, +10 монет)</button>
        <button class="action glass-button" onclick="earnCoins('Проект', 20)">Проект (10 энергии, +20 монет)</button>
        <button class="action glass-button" onclick="earnCoins('Инвестиция', 50)">Инвестиция (20 энергии, +50 монет)</button>
    `;
    if (!historyStack.includes('showEarn')) {
        historyStack.push('showEarn');
    }
    updateProfile();
    applyTheme();
}

function earnCoins(type, reward) {
    const energyCost = type === 'Работа' ? 5 : type === 'Проект' ? 10 : 20;
    if (profile.energy >= energyCost) {
        profile.energy -= energyCost;
        profile.coins += reward;
        showNotification(`Ты заработал ${reward} монет за ${type}! 💸`);
        showEarn();
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

// Магазин
function showShop() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Магазин 🏪</h2>
        <p>Купи что-нибудь интересное!</p>
        <button class="action glass-button" onclick="buyItem('Золотой ключ', 50)">Золотой ключ (50 монет) 🔑</button>
        <button class="action glass-button" onclick="buyItem('Энергетик', 20)">Энергетик (20 монет) ⚡</button>
        <button class="action glass-button" onclick="buyItem('Супер Энергетик', 100)">Супер Энергетик (100 монет) ⚡</button>
        <button class="action glass-button" onclick="buyItem('Счастливый талисман', 200)">Счастливый талисман (200 монет) 🍀</button>
    `;
    if (!historyStack.includes('showShop')) {
        historyStack.push('showShop');
    }
    updateProfile();
    applyTheme();
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

// Друзья
function showFriends() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Друзья 👥</h2>
        <p>Пригласи друга и получи бонус!</p>
        <input type="text" id="friendCode" placeholder="Введите код друга">
        <button class="action glass-button" onclick="inviteFriend()">Пригласить</button>
        <button class="action glass-button" onclick="sendGift()">Отправить подарок другу 🎁</button>
        <button class="action glass-button" onclick="showClans()">Кланы 🏰</button>
        <button class="action glass-button" onclick="showChat()">Чат 💬</button>
    `;
    if (!historyStack.includes('showFriends')) {
        historyStack.push('showFriends');
    }
    updateProfile();
    applyTheme();
}

function inviteFriend() {
    const code = document.getElementById('friendCode').value;
    if (code) {
        profile.coins += 50;
        showNotification('Друг приглашён! +50 монет 🎉');
        showFriends();
        updateProfile();
    } else {
        showNotification('Введите код друга! 📩');
    }
}

function sendGift() {
    if (profile.coins >= 50) {
        profile.coins -= 50;
        showNotification('Подарок отправлен другу! +10 дружеских очков 👥');
        showFriends();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function showClans() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Кланы 🏰</h2>
        <p>Создай или присоединись к клану!</p>
        <button class="action glass-button" onclick="createClan()">Создать клан (500 монет)</button>
        <button class="action glass-button" onclick="joinClan()">Присоединиться к клану</button>
    `;
    if (!historyStack.includes('showClans')) {
        historyStack.push('showClans');
    }
    updateProfile();
    applyTheme();
}

function createClan() {
    if (profile.coins >= 500) {
        profile.coins -= 500;
        showNotification('Клан создан! 🏰');
        showClans();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function joinClan() {
    showNotification('Ты присоединился к клану! 🏰');
    showClans();
    updateProfile();
}

function showChat() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Чат 💬</h2>
        <p>Общайся с друзьями!</p>
        <p>Чат пока в разработке...</p>
    `;
    if (!historyStack.includes('showChat')) {
        historyStack.push('showChat');
    }
    updateProfile();
    applyTheme();
}

// Награды
function showRewards() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Награды 🎁</h2>
        <p>Получи свои награды!</p>
        <button class="action glass-button" onclick="claimDailyReward()">Ежедневная награда</button>
        <button class="action glass-button" onclick="claimEventReward()">Событие: Весенний марафон 🎉</button>
    `;
    if (!historyStack.includes('showRewards')) {
        historyStack.push('showRewards');
    }
    updateProfile();
    applyTheme();
}

function claimDailyReward() {
    const lastClaim = localStorage.getItem('lastDailyReward');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastClaim || now - lastClaim > oneDay) {
        profile.coins += 50;
        localStorage.setItem('lastDailyReward', now);
        showNotification('Ежедневная награда получена! +50 монет 🎁');
        showRewards();
        updateProfile();
    } else {
        showNotification('Ежедневная награда уже получена! Попробуй завтра. ⏳');
    }
}

function claimEventReward() {
    const lastEventClaim = localStorage.getItem('lastEventReward');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastEventClaim || now - lastEventClaim > oneDay) {
        profile.coins += 200;
        profile.items.push('Событийный предмет');
        localStorage.setItem('lastEventReward', now);
        showNotification('Награда за событие получена! +200 монет и Событийный предмет 🎉');
        showRewards();
        updateProfile();
    } else {
        showNotification('Награда за событие уже получена! Попробуй завтра. ⏳');
    }
}

// Сезонный пропуск
function showSeasonPass() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Сезонный пропуск 🎟️</h2>
        <p>Получай награды за прогресс!</p>
        <p>Твой уровень: ${profile.level || 1}</p>
        <p>Прогресс: ${profile.seasonProgress}/100</p>
        <button class="action glass-button" onclick="levelUp()">Повысить уровень (50 монет)</button>
    `;
    if (!historyStack.includes('showSeasonPass')) {
        historyStack.push('showSeasonPass');
    }
    updateProfile();
    applyTheme();
}

function levelUp() {
    if (profile.coins >= 50 && profile.seasonProgress >= 100) {
        profile.coins -= 50;
        profile.level = (profile.level || 1) + 1;
        profile.seasonProgress = 0;
        showNotification(`Уровень повышен! Твой уровень: ${profile.level} 🎉`);
        showSeasonPass();
        updateProfile();
    } else if (profile.seasonProgress < 100) {
        showNotification('Недостаточно прогресса! Выполняй квесты. 📜');
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

// Турниры
function showTournaments() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Турниры 🏆</h2>
        <p>Соревнуйся с другими игроками!</p>
        <button class="action glass-button" onclick="joinTournament()">Присоединиться к турниру (100 монет)</button>
    `;
    if (!historyStack.includes('showTournaments')) {
        historyStack.push('showTournaments');
    }
    updateProfile();
    applyTheme();
}

function joinTournament() {
    if (profile.coins >= 100) {
        profile.coins -= 100;
        showNotification('Ты присоединился к турниру! Соревнуйся и побеждай! 🏆');
        showTournaments();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}
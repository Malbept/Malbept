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
        <h3>Квесты 📜</h3>
        <button class="action glass-button" onclick="startQuest()">Начать квест (5 энергии)</button>
        <button class="action glass-button" onclick="startDailyQuest()">Ежедневный квест (10 энергии)</button>
        ${profile.quests.length > 0 ? profile.quests.map((quest, index) => `
            <p>${quest.name}: ${quest.progress}/${quest.goal} 
            <button class="action glass-button" onclick="completeQuest(${index})">Завершить</button></p>
        `).join('') : '<p>Нет активных квестов.</p>'}
        <h3>Заработок 💸</h3>
        <button class="action glass-button" onclick="earnCoins('Работа', 10)">Работа (5 энергии, +10 монет)</button>
        <button class="action glass-button" onclick="earnCoins('Проект', 20)">Проект (10 энергии, +20 монет)</button>
        <button class="action glass-button" onclick="earnCoins('Инвестиция', 50)">Инвестиция (20 энергии, +50 монет)</button>
    `;
    historyStack = ['main'];
    updateProfile();
    applyTheme();
}
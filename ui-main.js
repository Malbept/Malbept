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
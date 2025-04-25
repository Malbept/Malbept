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
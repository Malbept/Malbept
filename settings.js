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
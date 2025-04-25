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
profile.seasonProgress = profile.seasonProgress || 0;

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
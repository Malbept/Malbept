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
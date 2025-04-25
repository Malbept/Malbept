function showProfile() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Профиль 👤</h2>
        <p>Монеты: ${profile.coins} 💰</p>
        <p>Энергия: ${profile.energy}/${profile.maxEnergy} ⚡</p>
        <p>Предметы: ${profile.items.length} 🧳</p>
        ${profile.event ? `<p>Событие: ${profile.event.progress}/${profile.event.goal} 🎯</p>` : ''}
        <button class="action glass-button" onclick="increaseMaxEnergy()">Увеличить макс. энергию (500 монет)</button>
    `;
    if (!historyStack.includes('showProfile')) {
        historyStack.push('showProfile');
    }
    updateProfile();
    applyTheme();
}

function increaseMaxEnergy() {
    if (profile.coins >= 500) {
        profile.coins -= 500;
        profile.maxEnergy += 10;
        showNotification('Максимальная энергия увеличена на 10! ⚡');
        showProfile();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}
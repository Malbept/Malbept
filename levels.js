
// Функция для отображения окна с уровнями
window.showLevels = function() {
    const xpNeeded = window.profile.level * 100;
    const remainingXP = xpNeeded - window.profile.xp;

    // Формируем список уровней
    let levelsHTML = '';
    for (let i = 1; i <= window.profile.maxLevel; i++) {
        const bonus = window.levelBonuses[i - 1];
        const isClaimed = window.profile.claimedLevelBonuses.includes(i);
        const isCurrent = i === window.profile.level;
        levelsHTML += `
            <div class="level-item ${isClaimed ? 'claimed' : ''} ${isCurrent ? 'current' : ''}">
                <p>Уровень ${i} ${isCurrent ? '(Текущий)' : ''}</p>
                <p>Награда: ${bonus.coins} монет 💰, ${bonus.energy} энергии ⚡, ${bonus.xp} XP 📈</p>
                ${isCurrent ? `<p>До следующего уровня: ${remainingXP} XP</p>` : ''}
                ${isClaimed ? '<p>Получено ✅</p>' : i < window.profile.level ? '<p>Пропущено</p>' : ''}
            </div>
        `;
    }

    document.getElementById('main-content').innerHTML = `
        <button class="back-button hk-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Уровни 🎖️</h2>
        <div class="levels-container">
            ${levelsHTML}
        </div>
    `;
    window.historyStack.push('showLevels');
};

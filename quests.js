profile.quests = profile.quests || [];

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
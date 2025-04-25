function showTreasureHunt() {
    if (!profile.currentEvent) {
        profile.currentEvent = {
            name: "Охота за сокровищами",
            progress: 0,
            goal: 10,
            rewards: [
                { type: "coins", value: 100 },
                { type: "item", value: "Сокровище" },
                { type: "item", value: "Редкий артефакт" }
            ]
        };
    }

    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Охота за сокровищами 🔍</h2>
        <p>Копай и находи сокровища!</p>
        <p>Прогресс: ${profile.currentEvent.progress}/${profile.currentEvent.goal}</p>
        <button class="action glass-button" onclick="digForTreasure()">Копать (5 энергии)</button>
        ${profile.currentEvent.progress >= profile.currentEvent.goal ? `
            <button class="action glass-button" onclick="claimEventReward()">Забрать награду 🏆</button>
        ` : ''}
    `;
    if (!historyStack.includes('showTreasureHunt')) {
        historyStack.push('showTreasureHunt');
    }
    updateProfile();
    applyTheme();
}

function digForTreasure() {
    if (profile.energy >= 5) {
        profile.energy -= 5;
        profile.currentEvent.progress += 1;

        const chance = Math.random();
        if (chance > 0.9) {
            profile.coins += 50;
            showNotification('Ты нашёл клад! +50 монет! 💰');
        } else if (chance > 0.6) {
            profile.items.push('Маленькое сокровище');
            showNotification('Ты нашёл Маленькое сокровище! 🧳');
        } else {
            showNotification('Ничего не нашёл... Продолжай копать! 🔍');
        }

        if (profile.currentEvent.progress >= profile.currentEvent.goal) {
            showNotification('Событие завершено! Забери награду! 🏆');
        }

        showTreasureHunt();
        updateProfile();
    } else {
        showNotification('Недостаточно энергии! ⚡');
    }
}

function claimEventReward() {
    profile.currentEvent.rewards.forEach(reward => {
        if (reward.type === "coins") {
            profile.coins += reward.value;
            showNotification(`Награда: +${reward.value} монет! 💰`);
        } else if (reward.type === "item") {
            profile.items.push(reward.value);
            showNotification(`Награда: ${reward.value}! 🧳`);
        }
    });
    profile.currentEvent = null;
    showTreasureHunt();
    updateProfile();
}
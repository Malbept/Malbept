
// Список достижений
window.achievements = [
    { id: 'coins_5000', name: 'Миллионер', description: 'Собери 5000 монет', condition: () => window.profile.coins >= 5000, reward: 500, completed: false },
    { id: 'clicks_500', name: 'Мастер тапов', description: 'Сделай 500 кликов', condition: () => window.profile.clicks >= 500, reward: 300, completed: false },
    { id: 'level_10', name: 'Ветеран', description: 'Достигни 10 уровня', condition: () => window.profile.level >= 10, reward: 1000, completed: false },
    { id: 'energy_1000', name: 'Энергичный', description: 'Имей 1000 энергии', condition: () => window.profile.energy >= 1000, reward: 400, completed: false },
    { id: 'multitap_5', name: 'Мультитапер', description: 'Достигни мультитапа 5', condition: () => window.profile.multitapLevel >= 5, reward: 600, completed: false }
];

// Функция для отображения достижений
window.showAchievements = function() {
    let achievementsHTML = '';
    window.achievements.forEach(achievement => {
        const isCompleted = window.profile.completedAchievements.includes(achievement.id);
        achievementsHTML += `
            <div class="achievement-item ${isCompleted ? 'completed' : ''}">
                <p>${achievement.name}</p>
                <p>${achievement.description}</p>
                <p>Награда: ${achievement.reward} монет 💰</p>
                ${isCompleted ? '<p>Получено ✅</p>' : '<p>В процессе...</p>'}
            </div>
        `;
    });

    document.getElementById('main-content').innerHTML = `
        <button class="back-button hk-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Достижения 🏆</h2>
        <div class="achievements-container">
            ${achievementsHTML}
        </div>
    `;
    window.historyStack.push('showAchievements');
};

// Проверка достижений
window.checkAchievements = function() {
    window.achievements.forEach(achievement => {
        if (!window.profile.completedAchievements.includes(achievement.id) && achievement.condition()) {
            window.profile.completedAchievements.push(achievement.id);
            window.profile.coins += achievement.reward;
            window.showNotification(`Достижение "${achievement.name}" разблокировано! +${achievement.reward} монет 🏆`);
            window.updateProfile();
            window.saveProfile();
        }
    });
};

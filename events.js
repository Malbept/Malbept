function startEvent() {
    if (!profile.event) {
        profile.event = {
            description: 'Весенний марафон',
            progress: 0,
            goal: 100,
            endTime: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 дней
        };
        showNotification('Новое событие начато: Весенний марафон! 🎉');
        updateProfile();
    }
}

// Проверка окончания события
function checkEventEnd() {
    if (profile.event && Date.now() > profile.event.endTime) {
        if (profile.event.progress >= profile.event.goal) {
            profile.coins += 500;
            profile.items.push('Событийный трофей');
            showNotification('Событие завершено! +500 монет и Событийный трофей 🏆');
        } else {
            showNotification('Событие закончилось, но ты не выполнил цель. 😔');
        }
        profile.event = null;
        updateProfile();
    }
}

// Проверяем каждую минуту
setInterval(checkEventEnd, 60000);

// Начинаем событие при загрузке, если его нет
document.addEventListener('DOMContentLoaded', () => {
    if (!profile.event) {
        startEvent();
    }
});
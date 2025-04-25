profile.secrets = profile.secrets || { found: [], total: 5 }; // 5 секретов всего

function showSecrets() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Секреты 🔒</h2>
        <p>Найди все секреты, чтобы получить бонусы!</p>
        <p>Найдено: ${profile.secrets.found.length}/${profile.secrets.total}</p>
        ${profile.secrets.found.length === profile.secrets.total ? `
            <p>Ты нашёл все секреты! Получи награду!</p>
            <button class="action glass-button" onclick="claimSecretsReward()">Забрать награду 🎁</button>
        ` : `
            <p>Подсказка: попробуй нажимать на разные элементы или выполнять необычные действия!</p>
        `}
    `;
    if (!historyStack.includes('showSecrets')) {
        historyStack.push('showSecrets');
    }
    updateProfile();
    applyTheme();
}

function checkSecret(action) {
    const secrets = [
        { id: 'banner_clicks', description: 'Нажми на баннер 10 раз', reward: 100 },
        { id: 'play_with_pet_5', description: 'Поиграй с питомцем 5 раз', reward: 150 },
        { id: 'use_energy_drink', description: 'Используй Энергетик', reward: 50 },
        { id: 'casino_loss_3', description: 'Проиграй в казино 3 раза подряд', reward: 200 },
        { id: 'change_theme_3', description: 'Смени тему 3 раза', reward: 100 }
    ];

    const secret = secrets.find(s => s.id === action);
    if (secret && !profile.secrets.found.includes(secret.id)) {
        profile.secrets.found.push(secret.id);
        showNotification(`Секрет найден: ${secret.description}! +${secret.reward} монет 🔓`);
        profile.coins += secret.reward;
        updateProfile();
    }
}

function claimSecretsReward() {
    if (profile.secrets.found.length === profile.secrets.total) {
        profile.coins += 500;
        profile.items.push('Секретный талисман');
        showNotification('Все секреты найдены! +500 монет и Секретный талисман 🎉');
        profile.secrets = { found: [], total: 5 }; // Сбрасываем секреты
        showSecrets();
        updateProfile();
    }
}
function showFriends() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Друзья 👥</h2>
        <p>Пригласи друга и получи бонус!</p>
        <input type="text" id="friendCode" placeholder="Введите код друга">
        <button class="action glass-button" onclick="inviteFriend()">Пригласить</button>
        <button class="action glass-button" onclick="sendGift()">Отправить подарок другу 🎁</button>
        <button class="action glass-button" onclick="showClans()">Кланы 🏰</button>
        <button class="action glass-button" onclick="showChat()">Чат 💬</button>
    `;
    if (!historyStack.includes('showFriends')) {
        historyStack.push('showFriends');
    }
    updateProfile();
    applyTheme();
}

function inviteFriend() {
    const code = document.getElementById('friendCode').value;
    if (code) {
        profile.coins += 50;
        showNotification('Друг приглашён! +50 монет 🎉');
        showFriends();
        updateProfile();
    } else {
        showNotification('Введите код друга! 📩');
    }
}

function sendGift() {
    if (profile.coins >= 50) {
        profile.coins -= 50;
        showNotification('Подарок отправлен другу! +10 дружеских очков 👥');
        showFriends();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function showClans() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Кланы 🏰</h2>
        <p>Создай или присоединись к клану!</p>
        <button class="action glass-button" onclick="createClan()">Создать клан (500 монет)</button>
        <button class="action glass-button" onclick="joinClan()">Присоединиться к клану</button>
    `;
    if (!historyStack.includes('showClans')) {
        historyStack.push('showClans');
    }
    updateProfile();
    applyTheme();
}

function createClan() {
    if (profile.coins >= 500) {
        profile.coins -= 500;
        showNotification('Клан создан! 🏰');
        showClans();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function joinClan() {
    showNotification('Ты присоединился к клану! 🏰');
    showClans();
    updateProfile();
}

function showChat() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Чат 💬</h2>
        <p>Общайся с друзьями!</p>
        <p>Чат пока в разработке...</p>
    `;
    if (!historyStack.includes('showChat')) {
        historyStack.push('showChat');
    }
    updateProfile();
    applyTheme();
}
function showTournaments() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Турниры 🏆</h2>
        <p>Соревнуйся с другими игроками!</p>
        <button class="action glass-button" onclick="joinTournament()">Присоединиться к турниру (100 монет)</button>
    `;
    if (!historyStack.includes('showTournaments')) {
        historyStack.push('showTournaments');
    }
    updateProfile();
    applyTheme();
}

function joinTournament() {
    if (profile.coins >= 100) {
        profile.coins -= 100;
        showNotification('Ты присоединился к турниру! Соревнуйся и побеждай! 🏆');
        showTournaments();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}
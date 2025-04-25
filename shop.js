function showShop() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Магазин 🏪</h2>
        <p>Купи что-нибудь интересное!</p>
        <button class="action glass-button" onclick="buyItem('Золотой ключ', 50)">Золотой ключ (50 монет) 🔑</button>
        <button class="action glass-button" onclick="buyItem('Энергетик', 20)">Энергетик (20 монет) ⚡</button>
        <button class="action glass-button" onclick="buyItem('Супер Энергетик', 100)">Супер Энергетик (100 монет) ⚡</button>
        <button class="action glass-button" onclick="buyItem('Счастливый талисман', 200)">Счастливый талисман (200 монет) 🍀</button>
    `;
    if (!historyStack.includes('showShop')) {
        historyStack.push('showShop');
    }
    updateProfile();
    applyTheme();
}

function buyItem(item, cost) {
    if (profile.coins >= cost) {
        profile.coins -= cost;
        profile.items.push(item);
        showNotification(`Куплен: ${item}! 🎉`);
        showShop();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}
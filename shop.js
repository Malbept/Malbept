
// Функция для отображения магазина
window.showShop = function() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button hk-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Магазин 🛒</h2>
        <div id="shop-tabs" class="nav-bar">
            <button class="tab-button active" onclick="showShopTab('boosts')">Бусты</button>
            <button class="tab-button" onclick="showShopTab('pets')">Питомцы</button>
            <button class="tab-button" onclick="showShopTab('realEstate')">Недвижимость</button>
            <button class="tab-button" onclick="showShopTab('mobility')">Движимость</button>
            <button class="tab-button" onclick="showShopTab('business')">Бизнес</button>
            <button class="tab-button" onclick="showShopTab('investments')">Инвестиции</button>
        </div>
        <div id="shop-content"></div>
    `;
    window.historyStack.push('showShop');
    showShopTab('boosts'); // По умолчанию открываем Бусты
};

// Функция для отображения вкладки магазина
window.showShopTab = function(tabName) {
    if (tabName === 'boosts') {
        window.showBoostsShop();
        return;
    }

    const upgrades = window.profile.upgrades[tabName] || [];
    document.getElementById('shop-content').innerHTML = `
        <h3>${tabName === 'mobility' ? 'Движимость' : tabName === 'realEstate' ? 'Недвижимость' : tabName === 'pets' ? 'Питомцы' : tabName === 'business' ? 'Бизнес' : 'Инвестиции'}</h3>
        ${upgrades.map((upgrade, index) => `
            <div class="upgrade">
                <div class="upgrade-icon">📈</div>
                <div class="upgrade-info">
                    <p>${upgrade.name} (Lv ${upgrade.level})</p>
                    <p>Прибыль/ч: +${upgrade.profitPerHour.toLocaleString()}</p>
                </div>
                <button class="upgrade-button hk-button ${window.profile.coins < upgrade.cost ? 'disabled' : ''}" onclick="buyUpgrade('${tabName}', ${index})">Купить за ${upgrade.cost.toLocaleString()}</button>
            </div>
        `).join('')}
    `;

    document.querySelectorAll('#shop-tabs .tab-button').forEach(button => {
        button.classList.remove('active');
        if (button.textContent === (tabName === 'mobility' ? 'Движимость' : tabName === 'realEstate' ? 'Недвижимость' : tabName === 'pets' ? 'Питомцы' : tabName === 'business' ? 'Бизнес' : 'Инвестиции')) {
            button.classList.add('active');
        }
    });
};

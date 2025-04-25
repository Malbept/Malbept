function showInventory() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Инвентарь 🎒</h2>
        <p>Твои предметы:</p>
        <p>${profile.items.join(', ') || 'Инвентарь пуст.'}</p>
        ${profile.items.includes('Энергетик') ? `<button class="action glass-button" onclick="useEnergyDrink()">Использовать Энергетик ⚡</button>` : ''}
        ${profile.items.includes('Супер Энергетик') ? `<button class="action glass-button" onclick="useSuperEnergyDrink()">Использовать Супер Энергетик ⚡</button>` : ''}
        ${profile.items.includes('Счастливый талисман') ? `<button class="action glass-button" onclick="useLuckyCharm()">Использовать Счастливый талисман 🍀</button>` : ''}
    `;
    if (!historyStack.includes('showInventory')) {
        historyStack.push('showInventory');
    }
    updateProfile();
    applyTheme();
}

function useEnergyDrink() {
    const index = profile.items.indexOf('Энергетик');
    if (index !== -1) {
        profile.items.splice(index, 1);
        profile.energy = profile.maxEnergy;
        checkSecret('use_energy_drink'); // Проверяем секрет
        showNotification('Энергия полностью восстановлена! ⚡');
        showInventory();
        updateProfile();
    }
}

function useSuperEnergyDrink() {
    const index = profile.items.indexOf('Супер Энергетик');
    if (index !== -1) {
        profile.items.splice(index, 1);
        profile.energy = profile.maxEnergy;
        profile.maxEnergy += 5;
        showNotification('Энергия восстановлена и максимум увеличен на 5! ⚡');
        showInventory();
        updateProfile();
    }
}

function useLuckyCharm() {
    const index = profile.items.indexOf('Счастливый талисман');
    if (index !== -1) {
        profile.items.splice(index, 1);
        profile.luckyCharmActive = true;
        setTimeout(() => {
            profile.luckyCharmActive = false;
            showNotification('Эффект Счастливого талисмана закончился. 🍀');
        }, 300000);
        showNotification('Счастливый талисман активирован! Удача на вашей стороне (5 минут). 🍀');
        showInventory();
        updateProfile();
    }
}
function showPets() {
    // Добавляем питомца, если у игрока их ещё нет
    if (!profile.pets || profile.pets.length === 0) {
        profile.pets = [
            { name: "Котик", level: 1 },
            { name: "Щенок", level: 1 }
        ];
    }

    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Питомцы 🐾</h2>
        <p>Твои питомцы приносят доход каждые 5 минут!</p>
        ${profile.pets.map((pet, index) => `
            <p>${pet.name} (Уровень: ${pet.level})</p>
            <p>Доход: ${pet.level * 5} монет каждые 5 минут 🐾</p>
            <button class="action glass-button" onclick="upgradePet(${index})">Улучшить за ${getUpgradeCost(pet.level)} монет</button>
        `).join('')}
        <button class="action glass-button" onclick="addPet()">Добавить питомца (1000 монет)</button>
    `;
    if (!historyStack.includes('showPets')) {
        historyStack.push('showPets');
    }
    updateProfile();
    applyTheme();
}

function getUpgradeCost(level) {
    return 100 * Math.pow(2, level - 1); // Цена удваивается с каждым уровнем
}

function upgradePet(index) {
    const pet = profile.pets[index];
    const cost = getUpgradeCost(pet.level);
    if (profile.coins >= cost) {
        profile.coins -= cost;
        pet.level += 1;
        showNotification(`Питомец ${pet.name} улучшен до уровня ${pet.level}! 🐾`);
        showPets();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function addPet() {
    if (profile.coins >= 1000) {
        profile.coins -= 1000;
        const petNames = ['Котик', 'Щенок', 'Хомяк', 'Попугай', 'Зайчик'];
        const newPetName = petNames[Math.floor(Math.random() * petNames.length)];
        profile.pets.push({ name: `${newPetName} ${profile.pets.length + 1}`, level: 1 });
        showNotification(`Новый питомец добавлен: ${newPetName}! 🐾`);
        showPets();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}
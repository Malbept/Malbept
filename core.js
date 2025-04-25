let profile = {
    coins: 100,
    energy: 20,
    maxEnergy: 20,
    items: [],
    theme: 'default',
    casinoRig: {},
    quests: [],
    seasonProgress: 0,
    level: 1,
    pets: [], // Массив питомцев
    username: 'Аноним'
};

function loadProfile() {
    const savedProfile = localStorage.getItem('lapulya_profile');
    if (savedProfile) {
        profile = JSON.parse(savedProfile);
        applyTheme();
    }
}

function saveProfile() {
    localStorage.setItem('lapulya_profile', JSON.stringify(profile));
}

function updateEnergy() {
    if (profile.energy < profile.maxEnergy) {
        profile.energy += 1;
        if (profile.energy > profile.maxEnergy) {
            profile.energy = profile.maxEnergy;
        }
        updateProfile();
    }
}

// Пассивный доход от питомцев
function updatePetIncome() {
    profile.pets.forEach(pet => {
        if (pet.level > 0) {
            const income = pet.level * 5; // 5 монет за уровень каждые 5 минут
            profile.coins += income;
            showNotification(`Питомец ${pet.name} принёс ${income} монет! 🐾`);
        }
    });
    updateProfile();
}

setInterval(updatePetIncome, 300000); // Каждые 5 минут
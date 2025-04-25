let profile = {
    username: 'Аноним',
    coins: 100,
    energy: 50,
    maxEnergy: 50,
    items: [],
    level: 1,
    seasonProgress: 0,
    luckyCharmActive: false,
    quests: [],
    pets: [],
    petPlayCount: 0,
    casinoLossStreak: 0,
    theme: 'dark',
    themeChangeCount: 0,
    secrets: { found: [], total: 5 },
    casinoRig: {}
};

function loadProfile() {
    const saved = localStorage.getItem('lapulya_profile');
    if (saved) {
        profile = JSON.parse(saved);
        // Устанавливаем дефолтные значения для новых полей
        profile.pets = profile.pets || [];
        profile.petPlayCount = profile.petPlayCount || 0;
        profile.casinoLossStreak = profile.casinoLossStreak || 0;
        profile.themeChangeCount = profile.themeChangeCount || 0;
        profile.secrets = profile.secrets || { found: [], total: 5 };
        profile.casinoRig = profile.casinoRig || {};
    }
}

function saveProfile() {
    localStorage.setItem('lapulya_profile', JSON.stringify(profile));
}

function updateEnergy() {
    if (profile.energy < profile.maxEnergy) {
        profile.energy = Math.min(profile.maxEnergy, profile.energy + 1);
        updateProfile();
    }
}

// Восстановление энергии оффлайн
function calculateOfflineEnergy() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    if (lastVisit) {
        const secondsPassed = Math.floor((now - lastVisit) / 1000); // Сколько секунд прошло
        const energyToAdd = Math.floor(secondsPassed / 10); // 1 энергия каждые 10 секунд
        profile.energy = Math.min(profile.maxEnergy, profile.energy + energyToAdd);
        if (energyToAdd > 0) {
            showNotification(`Энергия восстановлена на ${energyToAdd} ⚡`);
        }
        updateProfile();
    }
}

// Вызываем при загрузке
document.addEventListener('DOMContentLoaded', calculateOfflineEnergy);
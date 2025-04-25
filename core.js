let profile = {
    coins: 100,
    energy: 20,
    maxEnergy: 20,
    items: [],
    theme: 'default', // Добавляем тему по умолчанию
    casinoRig: {}, // Для подкрутки казино
    quests: [],
    seasonProgress: 0,
    level: 1
};

function loadProfile() {
    const savedProfile = localStorage.getItem('lapulya_profile');
    if (savedProfile) {
        profile = JSON.parse(savedProfile);
        // Устанавливаем тему при загрузке
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
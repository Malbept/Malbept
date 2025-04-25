// core.js
let profile = {
    username: 'ошибка',
    coins: 100,
    xp: 0,
    level: 1,
    energy: 10,
    maxEnergy: 10,
    lastEnergyUpdate: Date.now(),
    rank: 'Новичок',
    title: '',
    pets: [],
    items: [],
    achievements: [],
    quests: {},
    stats: { pets_summoned: 0, items_collected: 0, blackjack_games: 0, slot_games: 0, dice_games: 0, roulette_games: 0, clicker_games: 0, treasure_hunts: 0, game_wins: 0, quests_completed: 0 },
    last_earn: 0,
    earn_boost: 0,
    lastLogin: 0,
    loginStreak: 0,
    avatar: 'default',
    background: 'default',
    status: '',
    friends: [],
    lastGiftSent: 0,
    marketItems: [],
    seasonPass: { level: 1, progress: 0 },
    event: null,
    eventEnd: 0,
    theme: 'dark'
};

function loadProfile() {
    const savedProfile = localStorage.getItem('lapulya_profile');
    if (savedProfile) {
        profile = JSON.parse(savedProfile);
        profile.stats = profile.stats || { pets_summoned: 0, items_collected: 0, blackjack_games: 0, slot_games: 0, dice_games: 0, roulette_games: 0, clicker_games: 0, treasure_hunts: 0, game_wins: 0, quests_completed: 0 };
        profile.quests = profile.quests || {};
        profile.achievements = profile.achievements || [];
        profile.items = profile.items || [];
        profile.pets = profile.pets || [];
        profile.level = profile.level || 1;
        profile.energy = profile.energy || 10;
        profile.maxEnergy = profile.maxEnergy || 10;
        profile.lastEnergyUpdate = profile.lastEnergyUpdate || Date.now();
        profile.lastLogin = profile.lastLogin || 0;
        profile.loginStreak = profile.loginStreak || 0;
        profile.avatar = profile.avatar || 'default';
        profile.background = profile.background || 'default';
        profile.status = profile.status || '';
        profile.friends = profile.friends || [];
        profile.lastGiftSent = profile.lastGiftSent || 0;
        profile.marketItems = profile.marketItems || [];
        profile.seasonPass = profile.seasonPass || { level: 1, progress: 0 };
        profile.event = profile.event || null;
        profile.eventEnd = profile.eventEnd || 0;
        profile.theme = profile.theme || 'dark';
    }
    updateEnergy();
    checkDailyBonus();
    checkEvent();
    applyTheme();
}

function saveProfile() {
    localStorage.setItem('lapulya_profile', JSON.stringify(profile));
}

function updateProfile() {
    const profileDiv = document.getElementById('profile');
    if (profileDiv) {
        profileDiv.innerHTML = `
            <p>Имя: ${profile.username}</p>
            <p>Монеты: ${profile.coins} 💰</p>
            <p>Энергия: ${profile.energy}/${profile.maxEnergy} ⚡</p>
        `;
    }
    saveProfile();
}

function updateEnergy() {
    const now = Date.now();
    const secondsPassed = Math.floor((now - profile.lastEnergyUpdate) / 1000);
    if (secondsPassed >= 3) {
        const energyToAdd = Math.floor(secondsPassed / 3);
        profile.energy = Math.min(profile.maxEnergy, profile.energy + energyToAdd);
        profile.lastEnergyUpdate = now - (secondsPassed % 3) * 1000;
    }
    saveProfile();
}

function checkDailyBonus() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const lastLoginDate = new Date(profile.lastLogin).setHours(0, 0, 0, 0);
    const today = new Date(now).setHours(0, 0, 0, 0);

    if (today > lastLoginDate) {
        if (today - lastLoginDate <= oneDay * 2) {
            profile.loginStreak++;
        } else {
            profile.loginStreak = 1;
        }
        const bonus = profile.loginStreak * 50;
        profile.coins += bonus;
        profile.lastLogin = now;
        showNotification(`Ежедневный бонус! +${bonus} монет за ${profile.loginStreak}-й день подряд! 🎉`);
    }
    saveProfile();
}

function checkEvent() {
    const now = Date.now();
    if (profile.eventEnd < now || !profile.event) {
        const events = [
            { name: 'Фестиваль питомцев', effect: 'pet_discount', description: 'Питомцы дешевле на 50%! 🐾' },
            { name: 'Игровой марафон', effect: 'double_xp', description: 'Двойной XP за игры! 🎮' }
        ];
        profile.event = events[Math.floor(Math.random() * events.length)];
        profile.eventEnd = now + 3 * 24 * 60 * 60 * 1000;
        showNotification(`Новое событие: ${profile.event.description}`);
    }
    saveProfile();
}

function applyTheme() {
    document.body.className = profile.theme;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Конец файла core.js
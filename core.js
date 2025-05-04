
// core.js
let profile = {
    // ... существующие поля ...
    shopItems: {
        movables: [], // Движимость
        realEstate: [], // Недвижимость
        boosts: [], // Купленные бусты
    },
    levelRewards: [], // Хранит полученные награды за уровни
    maxLevel: 27, // Обновляем до 27 уровней
};

// Список наград за уровни
const levelRewards = Array.from({ length: 27 }, (_, i) => {
    const level = i + 1;
    return {
        level,
        reward: level % 5 === 0 ? { type: 'pet', name: `Питомец Lv${level}`, cost: 0 } :
                level % 3 === 0 ? { type: 'item', name: `Секрет ${level}`, cost: 0 } :
                { type: 'coins', amount: level * 100 },
        claimed: false,
    };
});

function loadProfile() {
    const saved = localStorage.getItem('lapulya_profile');
    if (saved) {
        profile = JSON.parse(saved);
        profile.pets = profile.pets || [];
        profile.petPlayCount = profile.petPlayCount || 0;
        profile.casinoLossStreak = profile.casinoLossStreak || 0;
        profile.themeChangeCount = profile.themeChangeCount || 0;
        profile.secrets = profile.secrets || { found: [], total: 5 };
        profile.casinoRig = profile.casinoRig || {};
        profile.maxLevel = profile.maxLevel || 27;
        profile.profitPerHour = profile.profitPerHour || 0;
        profile.multitapLevel = profile.multitapLevel || 1;
        profile.maxMultitap = profile.maxMultitap || 10;
        profile.shopItems = profile.shopItems || { movables: [], realEstate: [], boosts: [] };
        profile.levelRewards = profile.levelRewards || [];
        profile.upgrades = profile.upgrades || {
            'exchange': [
                { name: 'Binance', level: 0, cost: 1000, profitPerHour: 207 },
                { name: 'Kraken', level: 0, cost: 2000, profitPerHour: 240 },
                { name: 'Coinbase', level: 0, cost: 750, profitPerHour: 70 }
            ],
            'mine': [
                { name: 'Bitcoin Miner', level: 0, cost: 1000, profitPerHour: 70 }
            ],
            'friends': [],
            'earn': [
                { name: 'Referral Bonus', level: 0, cost: 500, profitPerHour: 70 },
                { name: 'Daily Tasks', level: 0, cost: 500, profitPerHour: 90 }
            ],
            'airdrop': [
                { name: 'Token Airdrop', level: 0, cost: 350, profitPerHour: 40 }
            ]
        };
    }
    calculateProfitPerHour();
}

function buyShopItem(category, itemIndex) {
    const items = {
        movables: [
            { name: 'Спорткар', cost: 5000, profitPerHour: 500 },
            { name: 'Яхта', cost: 10000, profitPerHour: 1000 },
            { name: 'Частный самолет', cost: 15000, profitPerHour: 1500 },
        ],
        realEstate: [
            { name: 'Квартира', cost: 8000, profitPerHour: 800 },
            { name: 'Вилла', cost: 12000, profitPerHour: 1200 },
            { name: 'Офисный центр', cost: 20000, profitPerHour: 2000 },
        ],
        boosts: [
            { name: 'Полная энергия', cost: 50, effect: 'full_energy' },
            { name: 'Удвоение прибыли', cost: 100, effect: 'double_profit', duration: 300000 },
            { name: 'Быстрая энергия', cost: 75, effect: 'fast_energy', duration: 300000 },
        ],
        upgrades: [
            { name: 'Мультитап', level: profile.multitapLevel, cost: 1000 * (1 + profile.multitapLevel * 0.5), profitPerHour: 0 },
            { name: 'Энергия', level: profile.energyUpgradeLevel || 0, cost: 1500 * (1 + (profile.energyUpgradeLevel || 0) * 0.5), profitPerHour: 0 },
        ],
        pets: [
            { name: 'Котик 😺', cost: 100, profitPerHour: 10 },
            { name: 'Собачка 🐶', cost: 150, profitPerHour: 15 },
            { name: 'Дракончик 🐉', cost: 200, profitPerHour: 20 },
        ],
    };
    const item = items[category][itemIndex];
    if (!item) {
        showNotification('Предмет не найден! 😿');
        return;
    }

    if (profile.coins >= item.cost) {
        profile.coins -= item.cost;
        if (category === 'upgrades') {
            if (item.name === 'Мультитап') {
                profile.multitapLevel++;
                item.level = profile.multitapLevel;
                item.cost = Math.floor(1000 * (1 + profile.multitapLevel * 0.5));
            } else if (item.name === 'Энергия') {
                profile.energyUpgradeLevel = (profile.energyUpgradeLevel || 0) + 1;
                profile.maxEnergyUpgraded = 100000 + profile.energyUpgradeLevel * 10000;
                item.level = profile.energyUpgradeLevel;
                item.cost = Math.floor(1500 * (1 + profile.energyUpgradeLevel * 0.5));
            }
        } else if (category === 'boosts') {
            if (item.effect === 'full_energy') {
                profile.energy = profile.maxEnergyUpgraded || profile.maxEnergy;
                showNotification('Энергия полностью восстановлена! ⚡');
            } else if (item.effect === 'double_profit') {
                const originalProfit = profile.profitPerHour;
                profile.profitPerHour *= 2;
                setTimeout(() => {
                    profile.profitPerHour = originalProfit;
                    showNotification('Эффект удвоения прибыли закончился! 📉');
                    updateProfile();
                }, item.duration);
                showNotification('Прибыль удвоена на 5 минут! 📈');
            } else if (item.effect === 'fast_energy') {
                const originalInterval = 3000;
                const fastInterval = setInterval(updateEnergy, 1000);
                setTimeout(() => {
                    clearInterval(fastInterval);
                    setInterval(updateEnergy, originalInterval);
                    showNotification('Эффект быстрой энергии закончился! ⚡');
                    updateProfile();
                }, item.duration);
                showNotification('Энергия восстанавливается быстрее на 5 минут! ⚡');
            }
            profile.shopItems.boosts.push(item);
        } else if (category === 'pets') {
            profile.pets.push({ name: item.name, type: item.name, level: 1 });
            item.cost = Math.floor(item.cost * 1.5);
            showNotification(`Ты приютил питомца: ${item.name}! 🐾`);
        } else {
            profile.shopItems[category].push(item);
            item.cost = Math.floor(item.cost * 2);
            showNotification(`Куплено: ${item.name}! 🎉`);
        }
        calculateProfitPerHour();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function claimLevelReward(level) {
    const reward = levelRewards.find(r => r.level === level);
    if (!reward || reward.claimed || profile.level < level) {
        showNotification('Награда недоступна! 😿');
        return;
    }
    reward.claimed = true;
    if (reward.reward.type === 'coins') {
        profile.coins += reward.reward.amount;
        showNotification(`Получено: ${reward.reward.amount} монет! 💰`);
    } else if (reward.reward.type === 'item') {
        profile.items.push(reward.reward.name);
        showNotification(`Получено: ${reward.reward.name}! 🎁`);
    } else if (reward.reward.type === 'pet') {
        profile.pets.push({ name: reward.reward.name, type: reward.reward.name, level: 1 });
        showNotification(`Получено: ${reward.reward.name}! 🐾`);
    }
    profile.levelRewards.push(level);
    calculateProfitPerHour();
    updateProfile();
}

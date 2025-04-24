const tg = window.Telegram.WebApp;
tg.ready();

const user = tg.initDataUnsafe.user;
if (!user) {
    document.getElementById('profile').innerText = 'Ошибка авторизации!';
}

// Токен бота (в продакшене лучше использовать сервер)
const BOT_TOKEN = '7234958924:AAHCz8bNVMTWzoDF0DEeUhXr6eoF57Vpcl0';

// Данные игры
const RANKS = [
    { name: "Новичок", xp_required: 0, bonus: { earn_boost: 0.0, treasure_boost: 0.0, wheel_boost: 0.0 }, reward: { coins: 50 } },
    { name: "Искры", xp_required: 500, bonus: { earn_boost: 0.05, treasure_boost: 0.05, wheel_boost: 0.05 }, reward: { coins: 100 } },
    { name: "Мастер", xp_required: 1500, bonus: { earn_boost: 0.1, treasure_boost: 0.1, wheel_boost: 0.1 }, reward: { coins: 200, item: "Корона 👑" } },
    { name: "Герой", xp_required: 3000, bonus: { earn_boost: 0.15, treasure_boost: 0.15, wheel_boost: 0.15 }, reward: { coins: 300 } },
    { name: "Легенда", xp_required: 5000, bonus: { earn_boost: 0.2, treasure_boost: 0.2, wheel_boost: 0.2 }, reward: { coins: 500, item: "Звезда 🌟" } },
    { name: "Титан", xp_required: 10000, bonus: { earn_boost: 0.25, treasure_boost: 0.25, wheel_boost: 0.25 }, reward: { coins: 1000 } },
    { name: "Бог", xp_required: 20000, bonus: { earn_boost: 0.3, treasure_boost: 0.3, wheel_boost: 0.3 }, reward: { coins: 2000, pet: "Квазарный Единорог 🌟" } },
    { name: "Властелин", xp_required: 35000, bonus: { earn_boost: 0.35, treasure_boost: 0.35, wheel_boost: 0.35 }, reward: { coins: 3000 } },
    { name: "Космический Владыка", xp_required: 50000, bonus: { earn_boost: 0.4, treasure_boost: 0.4, wheel_boost: 0.4 }, reward: { coins: 5000, item: "Комета ☄️" } },
    { name: "Абсолют", xp_required: 100000, bonus: { earn_boost: 0.5, treasure_boost: 0.5, wheel_boost: 0.5 }, reward: { coins: 10000, pet: "Чёрная Дыра 🕳️" } }
];

const PETS = [
    { name: "Котик 😺", rarity: "Обычный", price: 100, earn: 5, bonus: { game_boost: 0.05, xp_boost: 0.05 } },
    { name: "Пёсик 🐶", rarity: "Обычный", price: 100, earn: 5, bonus: { earn_boost: 0.1, xp_boost: 0.05 } },
    { name: "Единорог 🦄", rarity: "Редкий", price: 300, earn: 15, bonus: { game_boost: 0.1, xp_boost: 0.1 } },
    FRONTEND_QUESTION: { name: "Дракончик 🐉", rarity: "Эпический", price: 500, earn: 30, bonus: { game_boost: 0.15, xp_boost: 0.15 } },
    { name: "Феникс 🔥", rarity: "Легендарный", price: 1000, earn: 50, bonus: { game_boost: 0.2, xp_boost: 0.2 } },
    { name: "Чёрная Дыра 🕳️", rarity: "Космический", price: 1500, earn: 75, bonus: { wheel_boost: 0.2, xp_boost: 0.3 } }
];

const ITEMS = ["Звёздочка ✨", "Сердечко 💖", "Радуга 🌈", "Корона 👑", "Кристалл 💎", "Звезда 🌟"];

const CHARACTERS = [
    { name: "Админ", hints: ["Управляет чатом", "Любит банить", "Всегда онлайн"] },
    { name: "Мемный Тролль", hints: ["Спамит мемами", "Пишет КАПСОМ", "Любит провокации"] }
];

const ACHIEVEMENTS = [
    { name: "Богач", condition: { coins: 1000 }, reward: { coins: 100 }, description: "Накопить 1000 монет" },
    { name: "Коллекционер", condition: { items: 10 }, reward: { coins: 50 }, description: "Собрать 10 предметов" }
];

const QUESTS = [
    { name: "Игрок дня", task: { blackjack_games: 3 }, reward: 50, xp: 50, description: "Сыграть в блекджек 3 раза" },
    { name: "Охотник за сокровищами", task: { treasure_hunts: 2 }, reward: 30, xp: 30, description: "Провести 2 поиска сокровищ" }
];

// Глобальный профиль
let profile = {};

// Отправка команд боту
async function sendCommand(command) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: user.id,
                text: command
            })
        });
        const data = await response.json();
        if (data.ok) {
            return data.result.text;
        }
        throw new Error(data.description);
    } catch (error) {
        console.error('Ошибка:', error);
        return null;
    }
}

// Загрузка профиля
async function loadProfile() {
    const profileText = await sendCommand('/get_profile');
    if (profileText) {
        try {
            profile = JSON.parse(profileText);
            localStorage.setItem('profile', JSON.stringify(profile));
            document.getElementById('profile').innerText = 
                `Имя: ${profile.username}\nМонеты: ${profile.coins} 💰\nРанг: ${profile.rank}\nТитул: ${profile.title}`;
        } catch (error) {
            document.getElementById('profile').innerText = 'Ошибка загрузки профиля!';
        }
    } else {
        document.getElementById('profile').innerText = 'Ошибка связи с ботом!';
    }
}

// Проверка ранга
async function checkRank() {
    let currentRank = profile.rank;
    let newRank = currentRank;
    for (const rank of RANKS) {
        if (profile.xp >= rank.xp_required && rank.name !== currentRank) {
            newRank = rank.name;
        }
    }
    if (newRank !== currentRank) {
        profile.rank = newRank;
        const rankData = RANKS.find(r => r.name === newRank);
        profile.coins += rankData.reward.coins || 0;
        if (rankData.reward.item) {
            profile.items.push(rankData.reward.item);
            await sendCommand(`/add_item ${rankData.reward.item}`);
        }
        if (rankData.reward.pet) {
            profile.pets.push(PETS.find(p => p.name === rankData.reward.pet));
            await sendCommand(`/add_pet ${rankData.reward.pet}`);
        }
        await sendCommand(`/update_rank ${newRank}`);
        await sendCommand(`/update_coins ${profile.coins}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`🎉 Поздравляем! Ты достиг ранга ${newRank}! Награда: ${rankData.reward.coins} монет`);
    }
}

// Пассивный заработок
async function passiveEarn() {
    const currentTime = Date.now() / 1000;
    if (!profile.last_earn) profile.last_earn = 0;
    if (currentTime - profile.last_earn >= 3600) {
        let totalEarn = 0;
        const earnBoost = profile.pets.reduce((sum, pet) => sum + (pet.bonus.earn_boost || 0), 0);
        const rankBoost = RANKS.find(r => r.name === profile.rank).bonus.earn_boost;
        for (const pet of profile.pets) {
            totalEarn += pet.earn || 0;
        }
        totalEarn = Math.floor(totalEarn * (1 + earnBoost + rankBoost + (profile.earn_boost || 0)));
        profile.coins += totalEarn;
        profile.last_earn = currentTime;
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_earn_time ${profile.last_earn}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        return totalEarn;
    }
    return 0;
}

// Проверка достижений
async function checkAchievements() {
    const newAchievements = [];
    for (const achievement of ACHIEVEMENTS) {
        if (!profile.achievements.includes(achievement.name)) {
            const condition = achievement.condition;
            if (
                (condition.coins && profile.coins >= condition.coins) ||
                (condition.items && profile.items.length >= condition.items)
            ) {
                profile.achievements.push(achievement.name);
                if (achievement.reward.coins) {
                    profile.coins += achievement.reward.coins;
                }
                if (achievement.reward.item) {
                    profile.items.push(achievement.reward.item);
                    await sendCommand(`/add_item ${achievement.reward.item}`);
                }
                await sendCommand(`/add_achievement ${achievement.name}`);
                await sendCommand(`/update_coins ${profile.coins}`);
                newAchievements.push(`${achievement.name}: ${achievement.description} (+${achievement.reward.coins} монет)`);
            }
        }
    }
    localStorage.setItem('profile', JSON.stringify(profile));
    return newAchievements;
}

// Проверка квестов
async function checkQuests() {
    const currentTime = Date.now() / 1000;
    const questBoost = profile.pets.reduce((sum, pet) => sum + (pet.bonus.quest_reward || 0), 0);
    const xpBoost = profile.pets.reduce((sum, pet) => sum + (pet.bonus.xp_boost || 0), 0);
    const completedQuests = [];
    for (const quest of QUESTS) {
        const questKey = quest.name;
        if (!profile.quests[questKey] || currentTime - profile.quests[questKey] >= 86400) {
            if (Object.entries(quest.task).every(([task, value]) => profile.stats[task] >= value)) {
                profile.quests[questKey] = currentTime;
                const reward = Math.floor(quest.reward * (1 + questBoost));
                const xp = Math.floor(quest.xp * (1 + xpBoost));
                profile.coins += reward;
                profile.xp += xp;
                profile.stats.quests_completed += 1;
                await sendCommand(`/complete_quest ${questKey}`);
                await sendCommand(`/update_coins ${profile.coins}`);
                await sendCommand(`/update_xp ${profile.xp}`);
                await sendCommand(`/update_stats quests_completed ${profile.stats.quests_completed}`);
                completedQuests.push(`${quest.name}: ${quest.description} (+${reward} монет, +${xp} XP)`);
                for (const task in quest.task) {
                    profile.stats[task] = 0;
                    await sendCommand(`/update_stats ${task} 0`);
                }
            }
        }
    }
    localStorage.setItem('profile', JSON.stringify(profile));
    return completedQuests;
}

// Инициализация
async function init() {
    await loadProfile();
    const newAchievements = await checkAchievements();
    if (newAchievements.length) {
        alert('Новые достижения:\n' + newAchievements.join('\n'));
    }
    await checkRank();
    showProfile();
}

init();
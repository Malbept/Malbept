const tg = window.Telegram.WebApp;
tg.ready();

const user = tg.initDataUnsafe.user;
if (!user) {
    document.getElementById('profile').innerText = 'Ошибка авторизации!';
}

// Токен бота (в продакшене лучше использовать прокси или сервер для безопасности)
const BOT_TOKEN = '7234958924:AAHCz8bNVMTWzoDF0DEeUhXr6eoF57Vpcl0';

// Данные игры (перенесены из бота)
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
    { name: "Дракончик 🐉", rarity: "Эпический", price: 500, earn: 30, bonus: { game_boost: 0.15, xp_boost: 0.15 } },
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
let profile = {};
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

// Отображение разделов
async function showPets() {
    const earn = await passiveEarn();
    if (earn > 0) alert(`Твои питомцы принесли ${earn} монет! 💰`);
    document.getElementById('content').innerHTML = `
        <h2>Питомцы 🐾</h2>
        ${profile.pets.length ? profile.pets.map(p => `<p>${p.name} (${p.rarity}, +${p.earn} монет/ч)</p>`).join('') : '<p>Нет питомцев!</p>'}
        <button class="action" onclick="summonPet()">Призвать питомца (50 монет)</button>
    `;
}

function showCollections() {
    document.getElementById('content').innerHTML = `
        <h2>Коллекции 🧺</h2>
        ${profile.items.length ? profile.items.join(', ') : 'Коллекция пуста!'}
        <button class="action" onclick="collectItem()">Собрать предмет (30 монет)</button>
    `;
}

function showInventory() {
    const pets = profile.pets.length ? profile.pets.map(p => `${p.name} (${p.rarity})`).join(', ') : 'Пусто';
    const items = profile.items.length ? profile.items.join(', ') : 'Пусто';
    document.getElementById('content').innerHTML = `
        <h2>Инвентарь 🎒</h2>
        <p>Монеты: ${profile.coins} 💰</p>
        <p>Питомцы: ${pets} 🐾</p>
        <p>Предметы: ${items} 🧺</p>
    `;
}

function showShop() {
    document.getElementById('content').innerHTML = `
        <h2>Магазин 🏪</h2>
        ${PETS.map(p => `<button class="action" onclick="buyPet('${p.name}')">${p.name} (${p.rarity}) - ${p.price} 💰</button>`).join('')}
        <button class="action" onclick="buyItem()">Купить предмет (50 монет)</button>
        <button class="action" onclick="buyTitle()">Купить титул (200 монет)</button>
    `;
}

function showGames() {
    document.getElementById('content').innerHTML = `
        <h2>Игры 🎲</h2>
        <button class="action" onclick="startBlackjack()">Блекджек 🎴</button>
        <button class="action" onclick="startSlots()">Слоты 🎰</button>
        <button class="action" onclick="startDice()">Кости 🎲</button>
        <button class="action" onclick="startRoulette()">Рулетка 🎡</button>
        <button class="action" onclick="startClicker()">Кликер 💰</button>
        <button class="action" onclick="startGuessCharacter()">Угадай персонажа 🧠</button>
        <button class="action" onclick="startGuessThought()">Угадай, что я думаю ❓</button>
    `;
}

function showProfile() {
    const achievements = profile.achievements.length ? profile.achievements.join(', ') : 'Нет достижений';
    document.getElementById('content').innerHTML = `
        <h2>Профиль 👤</h2>
        <p>Имя: ${profile.username}</p>
        <p>Ранг: ${profile.rank} (XP: ${profile.xp})</p>
        <p>Титул: ${profile.title}</p>
        <p>Монеты: ${profile.coins} 💰</p>
        <p>Питомцев: ${profile.pets.length} 🐾</p>
        <p>Предметов: ${profile.items.length} 🧺</p>
        <p>Достижения: ${achievements} 🏅</p>
    `;
}

async function showRewards() {
    const currentTime = Date.now() / 1000;
    if (!profile.last_reward) profile.last_reward = 0;
    if (currentTime - profile.last_reward >= 86400) {
        const reward = Math.floor(Math.random() * 151) + 50;
        const xp = Math.floor(Math.random() * 31) + 20;
        profile.coins += reward;
        profile.xp += xp;
        profile.last_reward = currentTime;
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_reward_time ${profile.last_reward}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Ура! Ты получил награду: ${reward} монет и ${xp} XP! 💰`);
        await checkRank();
    } else {
        const remaining = Math.floor(86400 - (currentTime - profile.last_reward));
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        alert(`Награда доступна через ${hours} ч ${minutes} мин! 🕒`);
    }
    document.getElementById('content').innerHTML = `
        <h2>Награды 🎁</h2>
        <p>Ежедневная награда: 50-200 монет и 20-50 XP</p>
        <button class="action" onclick="showRewards()">Получить награду</button>
    `;
}

async function showQuests() {
    const completed = await checkQuests();
    if (completed.length) alert(completed.join('\n'));
    document.getElementById('content').innerHTML = `
        <h2>Квесты 📜</h2>
        ${QUESTS.map(q => `<p>${q.name}: ${q.description} (+${q.reward} монет, +${q.xp} XP)</p>`).join('')}
    `;
}

function showTreasureHunt() {
    document.getElementById('content').innerHTML = `
        <h2>Поиск сокровищ 🔍</h2>
        <button class="action" onclick="treasureHunt()">Начать поиск (20 монет)</button>
    `;
}

function showWheel() {
    document.getElementById('content').innerHTML = `
        <h2>Колесо фортуны 🎡</h2>
        <button class="action" onclick="spinWheel()">Крутить колесо (10 монет)</button>
    `;
}

async function showEarn() {
    const earn = await passiveEarn();
    if (earn > 0) alert(`Твои питомцы принесли ${earn} монет! 💰`);
    const totalEarn = profile.pets.reduce((sum, pet) => sum + (pet.earn || 0), 0);
    const earnBoost = profile.pets.reduce((sum, pet) => sum + (pet.bonus.earn_boost || 0), 0);
    const rankBoost = RANKS.find(r => r.name === profile.rank).bonus.earn_boost;
    const boostedEarn = Math.floor(totalEarn * (1 + earnBoost + rankBoost + (profile.earn_boost || 0)));
    document.getElementById('content').innerHTML = `
        <h2>Заработок 💸</h2>
        <p>Питомцы приносят: ${totalEarn} монет/ч</p>
        <p>С бонусами: ${boostedEarn} монет/ч</p>
        <p>Всего питомцев: ${profile.pets.length} 🐾</p>
        <button class="action" onclick="boostEarn()">Ускорить заработок (50 монет)</button>
    `;
}

// Действия
async function summonPet() {
    if (profile.coins >= 50) {
        const weights = [0.5, 0.3, 0.1, 0.05, 0.03, 0.02];
        let random = Math.random(), sum = 0;
        let index = 0;
        for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (random <= sum) {
                index = i;
                break;
            }
        }
        const newPet = PETS[index];
        profile.coins -= 50;
        profile.pets.push(newPet);
        profile.stats.pets_summoned += 1;
        profile.xp += 20;
        await sendCommand(`/add_pet ${newPet.name}`);
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats pets_summoned ${profile.stats.pets_summoned}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Ты призвал ${newPet.name} (${newPet.rarity})! 🐾 +20 XP`);
        await checkAchievements();
        await checkRank();
        showPets();
    } else {
        alert('Недостаточно монет! 🥺');
    }
}

async function collectItem() {
    if (profile.coins >= 30) {
        const newItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        profile.coins -= 30;
        profile.items.push(newItem);
        profile.stats.items_collected += 1;
        profile.xp += 10;
        await sendCommand(`/add_item ${newItem}`);
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats items_collected ${profile.stats.items_collected}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Ты собрал ${newItem}! 🧺 +10 XP`);
        await checkAchievements();
        await checkRank();
        showCollections();
    } else {
        alert('Недостаточно монет! 🥺');
    }
}

async function buyPet(petName) {
    const pet = PETS.find(p => p.name === petName);
    if (pet && profile.coins >= pet.price) {
        profile.coins -= pet.price;
        profile.pets.push(pet);
        profile.stats.pets_summoned += 1;
        profile.xp += 50;
        await sendCommand(`/add_pet ${pet.name}`);
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats pets_summoned ${profile.stats.pets_summoned}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Ты купил ${pet.name} (${pet.rarity})! 🐾 +50 XP`);
        await checkAchievements();
        await checkRank();
        showShop();
    } else {
        alert('Недостаточно монет или питомец не найден! 🥺');
    }
}

async function buyItem() {
    if (profile.coins >= 50) {
        const newItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        profile.coins -= 50;
        profile.items.push(newItem);
        profile.stats.items_collected += 1;
        profile.xp += 15;
        await sendCommand(`/add_item ${newItem}`);
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats items_collected ${profile.stats.items_collected}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Ты купил ${newItem}! 🧺 +15 XP`);
        await checkAchievements();
        await checkRank();
        showShop();
    } else {
        alert('Недостаточно монет! 🥺');
    }
}

async function buyTitle() {
    const titles = ["Мастер казино 🎰", "Король питомцев 🐾", "Легенда чата 🌟"];
    if (profile.coins >= 200) {
        const newTitle = titles[Math.floor(Math.random() * titles.length)];
        profile.title = newTitle;
        profile.coins -= 200;
        profile.xp += 30;
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Ты получил титул: ${newTitle}! 😎 +30 XP`);
        await checkRank();
        showShop();
    } else {
        alert('Недостаточно монет! 🥺');
    }
}

function startBlackjack() {
    document.getElementById('content').innerHTML = `
        <h2>Блекджек 🎴</h2>
        <button class="action" onclick="playBlackjack(10)">Ставка: 10 💰</button>
        <button class="action" onclick="playBlackjack(50)">Ставка: 50 💰</button>
        <button class="action" onclick="playBlackjack(100)">Ставка: 100 💰</button>
    `;
}

async function playBlackjack(bet) {
    if (profile.coins >= bet) {
        const cards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
      
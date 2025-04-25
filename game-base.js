// game-base.js
function summonPet() {
    const cost = profile.event && profile.event.effect === 'pet_discount' ? 25 : 50;
    if (profile.coins >= cost) {
        profile.coins -= cost;
        const rarities = ['обычный', 'редкий', 'легендарный'];
        const rarity = Math.random() < 0.1 ? (Math.random() < 0.5 ? 'редкий' : 'легендарный') : 'обычный';
        profile.pets.push({ name: `Питомец ${profile.pets.length + 1}`, level: 1, rarity: rarity });
        profile.stats.pets_summoned++;
        profile.xp += 10;
        showNotification(`Новый питомец призван (${rarity})! 🐾 +10 XP`);
        checkAchievements();
        checkQuests('summon_pet');
        checkLevelUp();
        showPets();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function trainPet(index) {
    if (profile.coins >= 50) {
        profile.coins -= 50;
        profile.pets[index].level++;
        showNotification(`${profile.pets[index].name} повышен до уровня ${profile.pets[index].level}! 🐾`);
        showPets();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function startPetRace(index) {
    updateEnergy();
    if (profile.energy < 1) {
        showNotification('Недостаточно энергии! ⚡');
        return;
    }
    profile.energy--;
    const petLevel = profile.pets[index].level;
    const chance = petLevel * 10;
    const win = Math.random() * 100 < chance;
    document.getElementById('main-content').innerHTML = `
        <button class="back-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Гонки питомцев 🏁</h2>
        <p>${profile.pets[index].name} участвует в гонке!</p>
        <p>${win ? 'Победа! +50 монет 🏆' : 'Проигрыш! Попробуй снова 🏁'}</p>
    `;
    if (win) {
        const reward = Math.floor(50 * (1 + profile.level * 0.1));
        profile.coins += reward;
        profile.xp += 20;
        showNotification(`Победа в гонке! +${reward} монет 🎉 +20 XP`);
        checkLevelUp();
    }
    updateProfile();
}

function buyItem(item) {
    const costs = { 'Питомец': profile.event && profile.event.effect === 'pet_discount' ? 50 : 100, 'Предмет': 50, 'Буст XP': 200, 'Сундук': 300 };
    const discount = Math.random() < 0.5 ? 'Питомец' : 'Предмет';
    if (discount === 'Питомец') costs['Питомец'] = Math.floor(costs['Питомец'] * 0.8);
    if (discount === 'Предмет') costs['Предмет'] = Math.floor(costs['Предмет'] * 0.8);
    if (profile.coins >= costs[item]) {
        profile.coins -= costs[item];
        if (item === 'Питомец') {
            const rarities = ['обычный', 'редкий', 'легендарный'];
            const rarity = Math.random() < 0.1 ? (Math.random() < 0.5 ? 'редкий' : 'легендарный') : 'обычный';
            profile.pets.push({ name: `Питомец ${profile.pets.length + 1}`, level: 1, rarity: rarity });
            profile.stats.pets_summoned++;
        } else if (item === 'Предмет') {
            profile.items.push(`Предмет ${profile.items.length + 1}`);
            profile.stats.items_collected++;
        } else if (item === 'Буст XP') {
            profile.earn_boost += 0.5;
            setTimeout(() => profile.earn_boost -= 0.5, 3600000);
        } else if (item === 'Сундук') {
            const rewards = ['100 монет', 'Редкий предмет', 'Питомец'];
            const reward = rewards[Math.floor(Math.random() * rewards.length)];
            if (reward === '100 монет') {
                profile.coins += 100;
            } else if (reward === 'Редкий предмет') {
                profile.items.push(`Редкий предмет ${profile.items.length + 1}`);
            } else {
                profile.pets.push({ name: `Питомец ${profile.pets.length + 1}`, level: 1, rarity: 'редкий' });
            }
            showNotification(`Из сундука выпало: ${reward}! 🎁`);
        }
        profile.xp += 20;
        showNotification(`Куплен ${item}! 🎉 +20 XP`);
        checkAchievements();
        checkQuests('buy_item');
        checkLevelUp();
        showShop();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function sellItem(index) {
    const item = profile.items[index];
    profile.items.splice(index, 1);
    profile.marketItems.push({ item: item, price: 50, seller: profile.username });
    showNotification(`${item} выставлен на рынок! 📦`);
    showInventory();
    updateProfile();
}

function buyMarketItem(index) {
    const marketItem = profile.marketItems[index];
    if (profile.coins >= marketItem.price) {
        profile.coins -= marketItem.price;
        profile.items.push(marketItem.item);
        profile.marketItems.splice(index, 1);
        showNotification(`Куплен ${marketItem.item}! 🎉`);
        showMarket();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function checkLevelUp() {
    const requiredXP = profile.level * 100;
    while (profile.xp >= requiredXP) {
        profile.xp -= requiredXP;
        profile.level++;
        profile.coins += 50;
        showNotification(`Новый уровень ${profile.level}! 🎉 +50 монет`);
        if (Math.random() < 0.1) {
            profile.items.push(`Редкий предмет ${profile.items.length + 1}`);
            showNotification('Получен редкий предмет! ✨');
        }
        if (profile.level % 5 === 0) {
            profile.background = `background${profile.level / 5}`;
            showNotification(`Новый фон профиля! 🌟`);
        }
    }
    saveProfile();
}

function checkAchievements() {
    const achievements = [
        { id: 'first_pet', name: 'Первый питомец', condition: () => profile.stats.pets_summoned >= 1 },
        { id: 'game_master', name: 'Мастер игр', condition: () => profile.stats.game_wins >= 5 },
        { id: 'quest_hunter', name: 'Охотник за квестами', condition: () => profile.stats.quests_completed >= 3 },
        { id: 'rich', name: 'Богач', condition: () => profile.coins >= 1000 },
        { id: 'treasure_seeker', name: 'Искатель сокровищ', condition: () => profile.stats.treasure_hunts >= 10 }
    ];
    achievements.forEach(a => {
        if (a.condition() && !profile.achievements.includes(a.name)) {
            profile.achievements.push(a.name);
            profile.coins += 100;
            profile.xp += 50;
            showNotification(`Достижение: ${a.name}! +100 монет 🎉 +50 XP`);
            checkLevelUp();
        }
    });
    updateProfile();
}

function startQuest() {
    const quests = [
        { id: 'play_blackjack', description: 'Сыграй в блекджек 3 раза', goal: 3, reward: 100 },
        { id: 'play_slots', description: 'Сыграй в слоты 5 раз', goal: 5, reward: 150 },
        { id: 'summon_pet', description: 'Призови 2 питомцев', goal: 2, reward: 200 },
        { id: 'collect_items', description: 'Собери 5 предметов', goal: 5, reward: 100 },
        { id: 'win_games', description: 'Выиграй 3 игры подряд', goal: 3, reward: 200 }
    ];
    const available = quests.filter(q => !profile.quests[q.id]);
    if (available.length) {
        const quest = available[Math.floor(Math.random() * available.length)];
        profile.quests[quest.id] = { description: quest.description, progress: 0, goal: quest.goal, reward: quest.reward };
        showNotification(`Новый квест: ${quest.description}!`);
        showQuests();
        updateProfile();
    } else {
        showNotification('Все квесты выполнены!');
    }
}

function checkQuests(type) {
    if (profile.quests[type]) {
        profile.quests[type].progress++;
        if (profile.quests[type].progress >= profile.quests[type].goal) {
            const reward = Math.floor(profile.quests[type].reward * (1 + profile.level * 0.1));
            profile.coins += reward;
            let xp = profile.event && profile.event.effect === 'double_xp' ? 100 : 50;
            profile.xp += xp;
            profile.stats.quests_completed++;
            showNotification(`Квест выполнен: ${profile.quests[type].description}! +${reward} монет 🎉 +${xp} XP`);
            delete profile.quests[type];
            checkAchievements();
            checkLevelUp();
        }
        updateProfile();
    }
}

// Конец файла game-base.js
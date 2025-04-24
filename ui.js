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
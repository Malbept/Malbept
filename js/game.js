console.log("game.js loaded");

let coins = 0;
let level = 1;
let xp = 0;
let xpToNext = 100;
let clickPower = 1;
let energy = 100;
let maxEnergy = 100;
let shield = 0;
let battlePassLevel = 1;
let battlePassXP = 0;
let battlePassXPToNext = 1000;
let comboCount = 0;
let comboMultiplier = 1;
let comboTimeout = null;
let doubleCoinsActive = false;
let isPremium = false;
let telegramID = null;
let referralCode = btoa(Math.random().toString()).slice(0, 8);
let currentSkin = "Молот";

const shopItemsData = [
    { id: 1, name: "Супер-клік", cost: 100, power: 2 },
    { id: 2, name: "Енерго-ферма", cost: 500, passive: 10 },
    { id: 3, name: "Буст x2", cost: 1000, boost: 2, duration: 30 },
    { id: 4, name: "Мега-клік", cost: 2000, power: 5 },
    { id: 5, name: "Гіпер-ферма", cost: 5000, passive: 50 },
    { id: 6, name: "Турбо-клік", cost: 10000, power: 10 },
    { id: 7, name: "Квант-ферма", cost: 20000, passive: 100 },
    { id: 8, name: "Енерго-Щит", cost: 1500, shield: 10 }
];

let promoCodes = {
    "POWER100": { reward: 100, used: false },
    "ENERGY500": { reward: 500, used: false },
    "ADMIN9999": { reward: 9999, used: false }
};

let quests = [
    { id: 1, name: "Зроби 50 кліків", goal: 50, progress: 0, reward: 300, type: "clicks", daily: true },
    { id: 2, name: "Виграй у міні-грі", goal: 1, progress: 0, reward: 500, type: "minigame", daily: true },
    { id: 3, name: "Збери 1000 монет", goal: 1000, progress: 0, reward: 400, type: "coins", daily: true },
    { id: 4, name: "Купи 1 предмет", goal: 1, progress: 0, reward: 600, type: "purchases", daily: true },
    { id: 5, name: "Досягни комбо x3", goal: 3, progress: 0, reward: 700, type: "combo", daily: true },
    { id: 6, name: "Запроси друга", goal: 1, progress: 0, reward: 1000, type: "referral", daily: true },
    { id: 7, name: "Виконай 2 завдання батл-пасу", goal: 2, progress: 0, reward: 800, type: "battlePassTasks", daily: true },
    { id: 8, name: "Віднови енергію", goal: 1, progress: 0, reward: 300, type: "energyBoost", daily: true },
    { id: 9, name: "Поділися грою", goal: 1, progress: 0, reward: 500, type: "share", daily: true },
    { id: 10, name: "Виконай досягнення", goal: 1, progress: 0, reward: 600, type: "achievement", daily: true },
    { id: 11, name: "Досліди Слабкість (Рівень 5)", goal: 5, progress: 0, reward: 3000, type: "level" },
    { id: 12, name: "Переможи Слабкість (Рівень 10)", goal: 10, progress: 0, reward: 5000, type: "level" },
    { id: 13, name: "Стань Легендою (Рівень 20)", goal: 20, progress: 0, reward: 10000, type: "level" },
    { id: 14, name: "Збери 50000 монет", goal: 50000, progress: 0, reward: 15000, type: "coins" },
    { id: 15, name: "Отримай батл-пасс 5 рівня", goal: 5, progress: 0, reward: 7000, type: "battlePassLevel" },
    { id: 16, name: "Виграй 3 Потужних Удари", goal: 3, progress: 0, reward: 2000, type: "powerStrike" },
    { id: 17, name: "Знайди 2 великих скарби", goal: 2, progress: 0, reward: 2500, type: "treasureHunt" },
    { id: 18, name: "Переможи Слабкість 2 рази", goal: 2, progress: 0, reward: 3000, type: "weaknessBattle" },
    { id: 19, name: "Зарядити Енерго-Спалах на 2000+ монет", goal: 2000, progress: 0, reward: 2500, type: "energyBurst" },
    { id: 20, name: "Влучи в 10 цілей у Реакції Героя", goal: 10, progress: 0, reward: 2000, type: "heroReaction" },
    { id: 21, name: "Знищ 5 астероїдів у Космічному Захисті", goal: 5, progress: 0, reward: 1800, type: "spaceDefense" },
    { id: 22, name: "Збери пазл у Енерго-Пазлі", goal: 1, progress: 0, reward: 1500, type: "energyPuzzle" },
    { id: 23, name: "Пройди рівень 5 у Пошуку Предметів", goal: 5, progress: 0, reward: 2000, type: "hiddenObject" },
    { id: 24, name: "Збери 10 частинок у Космічному Штормі", goal: 10, progress: 0, reward: 2200, type: "cosmicStorm" },
    { id: 25, name: "Розбий 3 куби в Енерго-Кубі", goal: 3, progress: 0, reward: 1900, type: "energyCube" },
    { id: 26, name: "Влучи в 15 цілей у Реакції Титана", goal: 15, progress: 0, reward: 2300, type: "titanReaction" },
    { id: 27, name: "Пройди Лабіринт Сили", goal: 1, progress: 0, reward: 2500, type: "powerMaze" },
    { id: 28, name: "Збий 10 цілей у Галактичному Тирі", goal: 10, progress: 0, reward: 2100, type: "galacticShooter" }
];

let battlePassTasks = [
    { id: 1, name: "Виконай 2 квести", goal: 2, progress: 0, reward: 1000, type: "quests", premium: false },
    { id: 2, name: "Використай промокод", goal: 1, progress: 0, reward: 500, type: "promo", premium: false },
    { id: 3, name: "Виграй 2 міні-ігри", goal: 2, progress: 0, reward: 1500, type: "minigame", premium: false },
    { id: 4, name: "Запроси друга", goal: 1, progress: 0, reward: 2000, type: "referral", premium: false },
    { id: 5, name: "Досягни комбо x5", goal: 5, progress: 0, reward: 1000, type: "combo", premium: false },
    { id: 6, name: "Собери пазл у Енерго-Пазлі", goal: 1, progress: 0, reward: 1200, type: "energyPuzzle", premium: false },
    { id: 7, name: "Підпишись на канал @PotuzhnoChannel", goal: 1, progress: 0, reward: 800, type: "telegramSubscribe", premium: false, channel: "@PotuzhnoChannel" },
    { id: 8, name: "Пройди рівень 5 у Пошуку Предметів", goal: 5, progress: 0, reward: 2000, type: "hiddenObject", premium: true },
    { id: 9, name: "Збери 10000 монет", goal: 10000, progress: 0, reward: 3000, type: "coins", premium: true },
    { id: 10, name: "Купи 3 предмети", goal: 3, progress: 0, reward: 2500, type: "purchases", premium: true },
    { id: 11, name: "Збери 5 частинок у Космічному Штормі", goal: 5, progress: 0, reward: 1800, type: "cosmicStorm", premium: false },
    { id: 12, name: "Розбий куб в Енерго-Кубі", goal: 1, progress: 0, reward: 1500, type: "energyCube", premium: false },
    { id: 13, name: "Влучи в 10 цілей у Реакції Титана", goal: 10, progress: 0, reward: 2000, type: "titanReaction", premium: true },
    { id: 14, name: "Пройди Лабіринт Сили 2 рази", goal: 2, progress: 0, reward: 2200, type: "powerMaze", premium: true },
    { id: 15, name: "Збий 5 цілей у Галактичному Тирі", goal: 5, progress: 0, reward: 1700, type: "galacticShooter", premium: false }
];

const achievements = [
    { id: 1, name: "Клік-майстер", goal: 1000, progress: 0, type: "clicks", reward: 1000, completed: false },
    { id: 2, name: "Герой 10 рівня", goal: 10, progress: 0, type: "level", reward: 2000, completed: false },
    { id: 3, name: "Багатій", goal: 10000, progress: 0, type: "coins", reward: 3000, completed: false },
    { id: 4, name: "Міні-ігровий гуру", goal: 5, progress: 0, type: "minigame", reward: 2500, completed: false },
    { id: 5, name: "Комбо-король", goal: 5, progress: 0, type: "combo", reward: 1500, completed: false }
];

function updateStats() {
    coinsDisplay.textContent = Math.floor(coins);
    levelDisplay.textContent = level;
    xpDisplay.textContent = xp;
    xpToNextDisplay.textContent = xpToNext;
    energyDisplay.textContent = Math.floor(energy);
    shieldDisplay.textContent = shield;
    battlePassLevelDisplay.textContent = battlePassLevel;
    battlePassXPDisplay.textContent = battlePassXP;
    battlePassXPToNextDisplay.textContent = battlePassXPToNext;
    premiumStatus.textContent = isPremium ? "Преміум" : "Звичайний";
}

function checkLevelUp() {
    if (xp >= xpToNext) {
        level++;
        xp = 0;
        xpToNext = Math.round(xpToNext * 1.5);
        updateQuests("level", 1);
        updateAchievements("level", 1);
        updateStats();
        levelUpAnimation();
        saveGame();
        showNotification(`Вітаємо! Ви досягли рівня ${level}!`);
    }
}

function renderShop() {
    const shopItemsElement = document.getElementById("shopItems");
    shopItemsElement.innerHTML = "";
    shopItemsData.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `${item.name} (Ціна: ${item.cost}) <button onclick="buyItem(${item.id})">Купити</button>`;
        shopItemsElement.appendChild(itemDiv);
    });
}

function buyItem(id) {
    const item = shopItemsData.find(i => i.id === id);
    if (coins >= item.cost) {
        coins -= item.cost;
        item.cost = Math.round(item.cost * 1.1);
        if (item.power) clickPower += item.power;
        if (item.passive) startPassiveIncome(item.passive);
        if (item.boost) applyBoost(item.boost, item.duration);
        if (item.shield) shield += item.shield;
        updateStats();
        updateQuests("purchases", 1);
        updateBattlePassTasks("purchases", 1);
        updateAchievements("purchases", 1);
        renderShop();
        saveGame();
        showNotification(`Куплено: ${item.name}!`);
        anime({
            targets: itemDiv,
            backgroundColor: "#00ffcc",
            duration: 500,
            easing: "easeOutQuad",
            complete: () => itemDiv.style.backgroundColor = ""
        });
    } else {
        showNotification("Недостатньо монет!");
    }
}

function startPassiveIncome(amount) {
    setInterval(() => {
        coins += amount * (doubleCoinsActive ? 2 : 1);
        updateStats();
        updateQuests("coins", amount);
        updateBattlePassTasks("coins", amount);
        updateAchievements("coins", amount);
        saveGame();
    }, 60000);
}

function applyBoost(multiplier, duration) {
    clickPower *= multiplier;
    updateStats();
    setTimeout(() => {
        clickPower /= multiplier;
        updateStats();
        saveGame();
    }, duration * 1000);
    showNotification(`Буст x${multiplier} активовано на ${duration} секунд!`);
}

function renderQuests() {
    const questListElement = document.getElementById("questList");
    questListElement.innerHTML = "";
    quests.forEach(quest => {
        const questDiv = document.createElement("div");
        const progressPercent = (quest.progress / quest.goal) * 100;
        questDiv.innerHTML = `
            <div style="font-size: 0.8em; margin-bottom: 4px;">${quest.name}</div>
            <div style="font-size: 0.7em;">Прогрес: ${quest.progress}/${quest.goal} | Нагорода: ${quest.reward} монет</div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${progressPercent}%"></div></div>
        `;
        if (quest.progress >= quest.goal) {
            questDiv.innerHTML += `<button onclick="claimQuest(${quest.id})">Забрати</button>`;
        }
        questListElement.appendChild(questDiv);
    });
}

function updateQuests(type, value) {
    let questsCompleted = 0;
    quests.forEach(quest => {
        if (quest.type === type) {
            quest.progress += value;
            if (quest.progress > quest.goal) quest.progress = quest.goal;
            if (quest.progress >= quest.goal) questsCompleted++;
        }
    });
    if (questsCompleted > 0) {
        updateBattlePassTasks("quests", questsCompleted);
    }
    renderQuests();
    saveGame();
}

function claimQuest(id) {
    const quest = quests.find(q => q.id === id);
    if (quest.progress >= quest.goal) {
        coins += quest.reward;
        if (quest.daily || quest.type !== "level") {
            quest.progress = 0;
        }
        updateStats();
        renderQuests();
        saveGame();
        showNotification(`Квест виконано! Ви отримали ${quest.reward} монет!`);
        anime({
            targets: questDiv,
            backgroundColor: "#00ffcc",
            duration: 500,
            easing: "easeOutQuad",
            complete: () => questDiv.style.backgroundColor = ""
        });
    }
}

function checkDailyQuests() {
    const lastReset = localStorage.getItem("lastQuestReset");
    const today = new Date().toDateString();
    if (lastReset !== today) {
        quests.forEach(quest => {
            if (quest.daily) {
                quest.progress = 0;
            }
        });
        localStorage.setItem("lastQuestReset", today);
        renderQuests();
        saveGame();
    }
}

function renderBattlePassTasks() {
    const battlePassTasksElement = document.getElementById("battlePassTasks");
    battlePassTasksElement.innerHTML = "";
    battlePassTasks.forEach(task => {
        if (task.premium && !isPremium) return;
        const taskDiv = document.createElement("div");
        const progressPercent = (task.progress / task.goal) * 100;
        taskDiv.innerHTML = `
            <div style="font-size: 0.8em; margin-bottom: 4px;">${task.name}${task.premium ? ' (Преміум)' : ''}</div>
            <div style="font-size: 0.7em;">Прогрес: ${task.progress}/${task.goal} | Нагорода: ${task.reward} монет</div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${progressPercent}%"></div></div>
        `;
        if (task.progress >= task.goal) {
            taskDiv.innerHTML += `<button onclick="claimBattlePassTask(${task.id})">Забрати</button>`;
        }
        if (task.type === "telegramSubscribe") {
            taskDiv.innerHTML += `<button onclick="checkTelegramSubscription('${task.channel}')">Перевірити підписку</button>`;
        }
        battlePassTasksElement.appendChild(taskDiv);
    });
}

function updateBattlePassTasks(type, value) {
    let tasksCompleted = 0;
    battlePassTasks.forEach(task => {
        if (task.type === type) {
            task.progress += value;
            if (task.progress > task.goal) task.progress = task.goal;
            if (task.progress >= task.goal) tasksCompleted++;
        }
    });
    if (tasksCompleted > 0) {
        updateQuests("battlePassTasks", tasksCompleted);
    }
    renderBattlePassTasks();
    saveGame();
}

function claimBattlePassTask(id) {
    const task = battlePassTasks.find(t => t.id === id);
    if (task.progress >= task.goal) {
        coins += task.reward;
        task.progress = 0;
        updateStats();
        renderBattlePassTasks();
        saveGame();
        showNotification(`Завдання батл-пасу виконано! Ви отримали ${task.reward} монет!`);
        anime({
            targets: taskDiv,
            backgroundColor: "#00ffcc",
            duration: 500,
            easing: "easeOutQuad",
            complete: () => taskDiv.style.backgroundColor = ""
        });
    }
}

function updateBattlePass(xpGain) {
    battlePassXP += xpGain;
    if (battlePassXP >= battlePassXPToNext) {
        battlePassLevel++;
        battlePassXP = 0;
        battlePassXPToNext = Math.round(battlePassXPToNext * 1.2);
        updateQuests("battlePassLevel", 1);
        updateStats();
        saveGame();
        showNotification(`Батл-пасс: рівень ${battlePassLevel} досягнуто!`);
    }
}

function updateAchievements(type, value) {
    let achievementsCompleted = 0;
    achievements.forEach(ach => {
        if (ach.type === type && !ach.completed) {
            ach.progress += value;
            if (ach.progress >= ach.goal) {
                ach.completed = true;
                coins += ach.reward;
                achievementsCompleted++;
                showNotification(`Досягнення "${ach.name}" виконано! Нагорода: ${ach.reward} монет!`);
            }
        }
    });
    if (achievementsCompleted > 0) {
        updateQuests("achievement", achievementsCompleted);
    }
    saveGame();
}
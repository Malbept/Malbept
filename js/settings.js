console.log("settings.js loaded");

const backgroundTheme = document.getElementById("backgroundTheme");
const clickerSkin = document.getElementById("clickerSkin");
const promoInput = document.getElementById("promoInput");
const adminPanel = document.getElementById("adminPanel");
const ALLOWED_ADMINS = [5678878569];

backgroundTheme.addEventListener("change", () => {
    document.body.className = `theme-${backgroundTheme.value}`;
    saveGame();
});

clickerSkin.addEventListener("change", () => {
    currentSkin = clickerSkin.value;
    clicker.textContent = currentSkin;
    saveGame();
});

function redeemCode() {
    const code = promoInput.value.trim();
    if (promoCodes[code] && !promoCodes[code].used) {
        coins += promoCodes[code].reward;
        promoCodes[code].used = true;
        updateStats();
        updateBattlePassTasks("promo", 1);
        saveGame();
        showNotification(`Промокод активовано! Ви отримали ${promoCodes[code].reward} монет!`);
    } else {
        showNotification("Невірний або вже використаний промокод!");
    }
    promoInput.value = "";
}

function shareGame() {
    coins += 200;
    updateStats();
    updateQuests("share", 1);
    saveGame();
    showNotification("Дякуємо за поширення! Ви отримали 200 монет!");
}

function addTask() {
    const taskName = document.getElementById("taskName").value;
    const taskGoal = parseInt(document.getElementById("taskGoal").value);
    const taskReward = parseInt(document.getElementById("taskReward").value);
    const taskType = document.getElementById("taskType").value;
    const taskChannel = document.getElementById("taskChannel").value;
    if (taskName && taskGoal > 0 && taskReward > 0) {
        const newTask = {
            id: quests.length + 1,
            name: taskName,
            goal: taskGoal,
            progress: 0,
            reward: taskReward,
            type: taskType,
            daily: false
        };
        if (taskType === "telegramSubscribe" && taskChannel) {
            newTask.channel = taskChannel;
        }
        quests.push(newTask);
        renderQuests();
        saveGame();
        showNotification("Завдання додано!");
    } else {
        showNotification("Заповніть усі поля!");
    }
}

function addPromo() {
    const promoCode = document.getElementById("promoCode").value;
    const promoReward = parseInt(document.getElementById("promoReward").value);
    if (promoCode && promoReward > 0) {
        promoCodes[promoCode] = { reward: promoReward, used: false };
        saveGame();
        showNotification("Промокод додано!");
    } else {
        showNotification("Заповніть усі поля!");
    }
}
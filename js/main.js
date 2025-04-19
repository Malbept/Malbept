console.log("main.js loaded");

const coinsDisplay = document.getElementById("coins");
const levelDisplay = document.getElementById("level");
const xpDisplay = document.getElementById("xp");
const xpToNextDisplay = document.getElementById("xpToNext");
const energyDisplay = document.getElementById("energy");
const shieldDisplay = document.getElementById("shield");
const premiumStatus = document.getElementById("premiumStatus");
const battlePassLevelDisplay = document.getElementById("battlePassLevel");
const battlePassXPDisplay = document.getElementById("battlePassXP");
const battlePassXPToNextDisplay = document.getElementById("battlePassXPToNext");
const referralLink = document.getElementById("referralLink");

function loadGame() {
    console.log("loadGame called");
    const savedState = JSON.parse(localStorage.getItem("gameState"));
    if (savedState) {
        coins = savedState.coins || 0;
        level = savedState.level || 1;
        xp = savedState.xp || 0;
        xpToNext = savedState.xpToNext || 100;
        clickPower = savedState.clickPower || 1;
        energy = savedState.energy || 100;
        shield = savedState.shield || 0;
        battlePassLevel = savedState.battlePassLevel || 1;
        battlePassXP = savedState.battlePassXP || 0;
        battlePassXPToNext = savedState.battlePassXPToNext || 1000;
        doubleCoinsActive = savedState.doubleCoinsActive || false;
        isPremium = savedState.isPremium || false;
        telegramID = savedState.telegramID || null;
        referralCode = savedState.referralCode || btoa(Math.random().toString()).slice(0, 8);
        currentSkin = savedState.currentSkin || "Молот";
        powerStrikeWins = savedState.powerStrikeWins || 0;
        treasureHuntBigWins = savedState.treasureHuntBigWins || 0;
        hiddenObjectLevel = savedState.hiddenObjectLevel || 1;
        hiddenObjectScore = savedState.hiddenObjectScore || 0;

        quests.forEach((quest, index) => {
            quest.progress = savedState.quests?.[index]?.progress || 0;
        });
        battlePassTasks.forEach((task, index) => {
            task.progress = savedState.battlePassTasks?.[index]?.progress || 0;
            task.channel = savedState.battlePassTasks?.[index]?.channel || task.channel;
        });
        achievements.forEach((ach, index) => {
            ach.progress = savedState.achievements?.[index]?.progress || 0;
            ach.completed = savedState.achievements?.[index]?.completed || false;
        });

        shopItemsData.forEach((item, index) => {
            item.cost = savedState.shopItems?.[index]?.cost || item.cost;
        });
        for (let code in promoCodes) {
            promoCodes[code].used = savedState.promoCodes?.[code]?.used || false;
        }
    }

    referralLink.textContent = `potuzhnoklik.example.com/ref/${referralCode}`;

    document.body.className = `theme-${savedState.backgroundTheme || "default"}`;
    clicker.textContent = currentSkin;
    backgroundTheme.value = savedState.backgroundTheme || "default";
    clickerSkin.value = currentSkin;
    if (ALLOWED_ADMINS.includes(telegramID)) {
        adminPanel.style.display = "block";
    }

    updateStats();
    renderShop();
    renderQuests();
    renderBattlePassTasks();
    renderMinigames();
    checkDailyQuests();
}

function saveGame() {
    console.log("saveGame called");
    const gameState = {
        coins,
        level,
        xp,
        xpToNext,
        clickPower,
        energy,
        shield,
        battlePassLevel,
        battlePassXP,
        battlePassXPToNext,
        doubleCoinsActive,
        isPremium,
        telegramID,
        referralCode,
        currentSkin,
        powerStrikeWins,
        treasureHuntBigWins,
        hiddenObjectLevel,
        hiddenObjectScore,
        backgroundTheme: backgroundTheme.value,
        quests: quests.map(q => ({ progress: q.progress })),
        battlePassTasks: battlePassTasks.map(t => ({ progress: t.progress, channel: t.channel })),
        achievements: achievements.map(a => ({ progress: a.progress, completed: a.completed })),
        shopItems: shopItemsData.map(i => ({ cost: i.cost })),
        promoCodes
    };
    localStorage.setItem("gameState", JSON.stringify(gameState));
}

function triggerRandomEvent() {
    if (Math.random() < 0.05) {
        const events = [
            () => {
                coins += 500;
                showNotification("Знайдено скарб! +500 монет!");
            },
            () => {
                energy = maxEnergy;
                showNotification("Енергія повністю відновлена!");
            },
            () => {
                doubleCoinsActive = true;
                setTimeout(() => {
                    doubleCoinsActive = false;
                    saveGame();
                    showNotification("Подвійні монети закінчилися!");
                }, 30000);
                showNotification("Подвійні монети активовано на 30 секунд!");
            }
        ];
        events[Math.floor(Math.random() * events.length)]();
        updateStats();
        saveGame();
    }
}

setInterval(() => {
    if (energy < maxEnergy) {
        energy += 1;
        updateStats();
        saveGame();
    }
}, 60000);

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");
    loadGame();

    document.addEventListener("touchstart", e => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    if (window.Telegram?.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        console.log("Telegram Web App initialized");
    }
});
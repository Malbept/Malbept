console.log("ui.js loaded");

const coinsDisplay = document.getElementById("coins");
const levelDisplay = document.getElementById("level");
const xpDisplay = document.getElementById("xp");
const xpToNextDisplay = document.getElementById("xpToNext");
const energyDisplay = document.getElementById("energy");
const shieldDisplay = document.getElementById("shield");
const premiumStatus = document.getElementById("premiumStatus");
const clicker = document.getElementById("clicker");
const clickAnimation = document.getElementById("clickAnimation");
const comboDisplay = document.getElementById("comboMultiplier");
const minigameArea = document.getElementById("minigameArea");
const notification = document.getElementById("notification");

let lastClickTime = 0;
const clickDelay = 200;

function showTab(tabId) {
    console.log(`showTab called with tabId: ${tabId}`);
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.style.display = tab.id === tabId ? "block" : "none";
    });
    document.querySelectorAll(".nav-button").forEach(btn => {
        btn.classList.toggle("active", btn.onclick.toString().includes(tabId));
    });
    showNotification(`Відкрито ${getTabName(tabId)}!`);
    if (tabId === "minigamesTab") {
        renderMinigames();
    }
}

function getTabName(tabId) {
    const names = {
        clickerTab: "Клікер",
        shopTab: "Магазин",
        questsTab: "Квести",
        battlePassTab: "Батл-пасс",
        minigamesTab: "Міні-ігри",
        referralsTab: "Реферали",
        settingsTab: "Налаштування"
    };
    return names[tabId] || "Вкладку";
}

function showNotification(message) {
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => notification.style.display = "none", 2000);
}

function handleClick() {
    const now = Date.now();
    if (now - lastClickTime < clickDelay) return;
    lastClickTime = now;
    console.log("handleClick called");
    if (energy > 0 || shield > 0) {
        comboCount++;
        if (comboCount >= 10) {
            comboMultiplier = Math.min(Math.floor(comboCount / 10) + 1, 5);
            updateQuests("combo", comboMultiplier);
            updateBattlePassTasks("combo", comboMultiplier);
        }
        comboDisplay.textContent = comboMultiplier;
        coins += clickPower * comboMultiplier * (doubleCoinsActive ? 2 : 1);
        xp += 1;
        if (shield > 0) {
            shield--;
        } else {
            energy -= 1;
        }
        updateStats();
        checkLevelUp();
        updateQuests("clicks", 1);
        updateQuests("coins", clickPower * comboMultiplier);
        updateAchievements("clicks", 1);
        updateAchievements("coins", clickPower * comboMultiplier);
        updateBattlePass(10);
        showClickAnimation();
        saveGame();
        triggerRandomEvent();
        clearTimeout(comboTimeout);
        comboTimeout = setTimeout(() => {
            comboCount = 0;
            comboMultiplier = 1;
            comboDisplay.textContent = comboMultiplier;
        }, 3000);
    } else {
        showNotification("Немає енергії або щита! Відновіть за рекламу або почекайте.");
    }
}

function showClickAnimation() {
    const anim = document.createElement("div");
    anim.className = "click-animation";
    anim.textContent = `+${clickPower * comboMultiplier}`;
    anim.style.left = `${Math.random() * 80}px`;
    clickAnimation.appendChild(anim);
    anime({
        targets: anim,
        translateY: -40,
        opacity: 0,
        duration: 1000,
        easing: "easeOutQuad",
        complete: () => anim.remove()
    });
}

function levelUpAnimation() {
    anime({
        targets: ".clicker",
        scale: [1, 1.4, 1],
        rotate: "1turn",
        duration: 800,
        easing: "easeInOutQuad"
    });
}

function checkTelegramSubscription(channel) {
    showNotification("Перевірка підписки... (Ця функція потребує серверної логіки)");
    setTimeout(() => {
        updateBattlePassTasks("telegramSubscribe", 1);
        showNotification(`Підписку на ${channel} підтверджено!`);
    }, 1000);
}

clicker.addEventListener("click", handleClick);
clicker.addEventListener("touchstart", e => {
    e.preventDefault();
    handleClick();
});

document.querySelectorAll(".nav-button").forEach(button => {
    const tabId = button.getAttribute("onclick").match(/'([^']+)'/)[1];
    const handleNavClick = () => {
        const now = Date.now();
        if (now - lastClickTime < clickDelay) return;
        lastClickTime = now;
        console.log(`Nav button clicked: ${tabId}`);
        showTab(tabId);
    };
    button.addEventListener("click", handleNavClick);
    button.addEventListener("touchstart", e => {
        e.preventDefault();
        handleNavClick();
    });
});
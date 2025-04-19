console.log("minigames.js loaded");

// Змінні для відстеження прогресу міні-ігор
let powerStrikeWins = parseInt(localStorage.getItem("powerStrikeWins")) || 0;
let treasureHuntBigWins = parseInt(localStorage.getItem("treasureHuntBigWins")) || 0;
let hiddenObjectLevel = parseInt(localStorage.getItem("hiddenObjectLevel")) || 1;
let hiddenObjectScore = parseInt(localStorage.getItem("hiddenObjectScore")) || 0;
let cosmicStormWins = parseInt(localStorage.getItem("cosmicStormWins")) || 0;
let energyCubeWins = parseInt(localStorage.getItem("energyCubeWins")) || 0;
let titanReactionWins = parseInt(localStorage.getItem("titanReactionWins")) || 0;
let powerMazeWins = parseInt(localStorage.getItem("powerMazeWins")) || 0;
let galacticShooterWins = parseInt(localStorage.getItem("galacticShooterWins")) || 0;

function renderMinigames() {
    minigameArea.innerHTML = `
        <div class="minigame" onclick="startPowerStrike()">Потужний Удар<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastPowerStrike') && Date.now() - localStorage.getItem('lastPowerStrike') < 3600000 ? 100 : 0}%"></div></div></div>
        <div class="minigame" onclick="startTreasureHunt()">Скарб Енергії<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastTreasureHunt') && Date.now() - localStorage.getItem('lastTreasureHunt') < 86400000 ? 100 : 0}%"></div></div></div>
        <div class="minigame" onclick="startWeaknessBattle()">Битва зі Слабкістю<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastWeaknessBattle') && Date.now() - localStorage.getItem('lastWeaknessBattle') < 1800000 ? 100 : 0}%"></div></div></div>
        <div class="minigame" onclick="startEnergyBurst()">Енергетичний Спалах<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastEnergyBurst') && Date.now() - localStorage.getItem('lastEnergyBurst') < 7200000 ? 100 : 0}%"></div></div></div>
        <div class="minigame" onclick="startHeroReaction()">Реакція Героя<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastHeroReaction') && Date.now() - localStorage.getItem('lastHeroReaction') < 3600000 ? 100 : 0}%"></div></div></div>
        <div class="minigame" onclick="startSpaceDefense()">Космічний Захист<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastSpaceDefense') && Date.now() - localStorage.getItem('lastSpaceDefense') < 3600000 ? 100 : 0}%"></div></div></div>
        <div class="minigame" onclick="startEnergyPuzzle()">Енерго-Пазл<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastEnergyPuzzle') && Date.now() - localStorage.getItem('lastEnergyPuzzle') < 3600000 ? 100 : 0}%"></div></div></div>
        <div class="minigame" onclick="startHiddenObject()">Пошук Предметів (Рівень: ${hiddenObjectLevel})<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastHiddenObject') && Date.now() - localStorage.getItem('lastHiddenObject') < 3600000 ? 100 : 0}%"></div></div></div>
        <div class="minigame" onclick="startCosmicStorm()">Космічний Шторм<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastCosmicStorm') && Date.now() - localStorage.getItem('lastCosmicStorm') < 3600000 ? 100 : 0}%"></div></div></div>
        <div class="minigame" onclick="startEnergyCube()">Енерго-Куб<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastEnergyCube') && Date.now() - localStorage.getItem('lastEnergyCube') < 3600000 ? 100 : 0}%"></div></div></div>
        <div class="minigame" onclick="startTitanReaction()">Реакція Титана<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastTitanReaction') && Date.now() - localStorage.getItem('lastTitanReaction') < 3600000 ? 100 : 0}%"></div></div></div>
        <div class="minigame" onclick="startPowerMaze()">Лабіринт Сили<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastPowerMaze') && Date.now() - localStorage.getItem('lastPowerMaze') < 3600000 ? 100 : 0}%"></div></div></div>
        <div class="minigame" onclick="startGalacticShooter()">Галактичний Тир<div class="progress-bar"><div class="progress-fill" style="width: ${localStorage.getItem('lastGalacticShooter') && Date.now() - localStorage.getItem('lastGalacticShooter') < 3600000 ? 100 : 0}%"></div></div></div>
    `;
}

// Потужний Удар
function startPowerStrike() {
    const lastStrike = localStorage.getItem("lastPowerStrike");
    const now = Date.now();
    if (lastStrike && now - lastStrike < 3600000) {
        showNotification("Зачекайте, Потужний Удар ще не готовий!");
        return;
    }
    minigameArea.innerHTML = `
        <div class="minigame-area">
            <div class="power-strike-bar">
                <div class="power-strike-zone"></div>
                <div class="power-strike-indicator" id="powerStrikeIndicator"></div>
            </div>
            <button id="strikeButton">Удар!</button>
        </div>
    `;
    const indicator = document.getElementById("powerStrikeIndicator");
    const strikeButton = document.getElementById("strikeButton");
    let position = 0;
    let direction = 1;
    let lastClickTime = 0;
    const clickDelay = 200;
    const interval = setInterval(() => {
        position += direction * 4;
        if (position >= minigameArea.offsetWidth - 20) direction = -1;
        if (position <= 0) direction = 1;
        indicator.style.left = `${position}px`;
    }, 50);
    const handleStrike = () => {
        const now = Date.now();
        if (now - lastClickTime < clickDelay) return;
        lastClickTime = now;
        clearInterval(interval);
        const zoneLeft = minigameArea.offsetWidth / 2 - 20;
        const zoneRight = minigameArea.offsetWidth / 2 + 20;
        if (position >= zoneLeft && position <= zoneRight) {
            coins += 1000;
            powerStrikeWins++;
            updateQuests("powerStrike", 1);
            updateQuests("minigame", 1);
            updateBattlePassTasks("minigame", 1);
            updateAchievements("minigame", 1);
            localStorage.setItem("powerStrikeWins", powerStrikeWins);
            showNotification("Чудовий удар! Ви отримали 1000 монет!");
        } else {
            coins += 50;
            showNotification("Промах! Ви отримали 50 монет за спробу!");
        }
        localStorage.setItem("lastPowerStrike", now);
        updateStats();
        saveGame();
        renderMinigames();
    };
    strikeButton.addEventListener("click", handleStrike);
    strikeButton.addEventListener("touchstart", e => {
        e.preventDefault();
        handleStrike();
    });
}

// Скарб Енергії
function startTreasureHunt() {
    const lastHunt = localStorage.getItem("lastTreasureHunt");
    const now = Date.now();
    if (lastHunt && now - lastHunt < 86400000) {
        showNotification("Скарби ще не з’явилися! Спробуйте завтра.");
        return;
    }
    minigameArea.innerHTML = `
        <div class="minigame-area" style="text-align: center;">
            <div class="treasure-chest" id="chest1">Сундук 1</div>
            <div class="treasure-chest" id="chest2">Сундук 2</div>
            <div class="treasure-chest" id="chest3">Сундук 3</div>
            <div class="treasure-chest" id="chest4">Сундук 4</div>
            <div class="treasure-chest" id="chest5">Сундук 5</div>
        </div>
    `;
    let lastClickTime = 0;
    const clickDelay = 200;
    const rand = Math.random();
    let reward = 0;
    if (rand < 0.2) {
        reward = 2000;
        treasureHuntBigWins++;
        updateQuests("treasureHunt", 1);
    } else if (rand < 0.6) {
        reward = 100;
    } else {
        reward = 500;
    }
    const handleChest = () => {
        const now = Date.now();
        if (now - lastClickTime < clickDelay) return;
        lastClickTime = now;
        coins += reward;
        updateQuests("minigame", 1);
        updateBattlePassTasks("minigame", 1);
        updateAchievements("minigame", 1);
        localStorage.setItem("treasureHuntBigWins", treasureHuntBigWins);
        showNotification(`Ви відкрили сундук! Нагорода: ${reward} монет!`);
        localStorage.setItem("lastTreasureHunt", now);
        updateStats();
        saveGame();
        renderMinigames();
    };
    document.querySelectorAll(".treasure-chest").forEach(chest => {
        chest.addEventListener("click", handleChest);
        chest.addEventListener("touchstart", e => {
            e.preventDefault();
            handleChest();
        });
    });
}

// Битва зі Слабкістю
function startWeaknessBattle() {
    const lastBattle = localStorage.getItem("lastWeaknessBattle");
    const now = Date.now();
    if (lastBattle && now - lastBattle < 1800000) {
        showNotification("Слабкість ще не повернулася! Зачекайте.");
        return;
    }
    let hp = 100;
    minigameArea.innerHTML = `
        <div class="minigame-area">
            <div class="weakness-enemy" id="weaknessEnemy">Слабкість: ${hp}</div>
            <div class="weakness-hp"><div class="weakness-hp-fill" id="weaknessHPFill" style="width: 100%"></div></div>
        </div>
    `;
    const enemy = document.getElementById("weaknessEnemy");
    const hpFill = document.getElementById("weaknessHPFill");
    let lastClickTime = 0;
    const clickDelay = 200;
    let timeLeft = 15;
    const battleInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0 || hp <= 0) {
            clearInterval(battleInterval);
            if (hp <= 0) {
                coins += 1500;
                xp += 50;
                updateQuests("weaknessBattle", 1);
                updateQuests("minigame", 1);
                updateBattlePassTasks("minigame", 1);
                updateAchievements("minigame", 1);
                showNotification("Ви перемогли Слабкість! Нагорода: 1500 монет і 50 XP!");
            } else {
                coins += 100;
                showNotification("Час вийшов! Ви отримали 100 монет за спробу!");
            }
            localStorage.setItem("lastWeaknessBattle", now);
            updateStats();
            saveGame();
            renderMinigames();
        }
    }, 1000);
    const handleEnemyClick = () => {
        const now = Date.now();
        if (now - lastClickTime < clickDelay) return;
        lastClickTime = now;
        if (hp > 0 && timeLeft > 0) {
            hp -= Math.floor(Math.random() * 5) + 1;
            enemy.textContent = `Слабкість: ${hp}`;
            hpFill.style.width = `${(hp / 100) * 100}%`;
        }
    };
    enemy.addEventListener("click", handleEnemyClick);
    enemy.addEventListener("touchstart", e => {
        e.preventDefault();
        handleEnemyClick();
    });
}

// Енергетичний Спалах
function startEnergyBurst() {
    const lastBurst = localStorage.getItem("lastEnergyBurst");
    const now = Date.now();
    if (lastBurst && now - lastBurst < 7200000) {
        showNotification("Енергетичний Спалах ще не готовий! Зачекайте 2 години.");
        return;
    }
    minigameArea.innerHTML = `
        <div class="minigame-area">
            <div class="energy-burst-meter"><div class="energy-burst-fill" id="energyBurstFill" style="width: 0%"></div></div>
            <button id="holdButton">Тримати!</button>
        </div>
    `;
    const holdButton = document.getElementById("holdButton");
    const fill = document.getElementById("energyBurstFill");
    let holdTime = 0;
    let isHolding = false;
    let lastClickTime = 0;
    const clickDelay = 200;
    const startHolding = () => {
        const now = Date.now();
        if (now - lastClickTime < clickDelay) return;
        lastClickTime = now;
        isHolding = true;
        const startTime = Date.now();
        const holdInterval = setInterval(() => {
            if (!isHolding) {
                clearInterval(holdInterval);
                return;
            }
            holdTime = (Date.now() - startTime) / 1000;
            fill.style.width = `${Math.min(holdTime * 20, 100)}%`;
            if (holdTime >= 5) {
                clearInterval(holdInterval);
                const reward = Math.min(Math.floor(holdTime * 600), 3000);
                coins += reward;
                if (reward >= 2000) {
                    updateQuests("energyBurst", reward);
                }
                updateQuests("minigame", 1);
                updateBattlePassTasks("minigame", 1);
                updateAchievements("minigame", 1);
                showNotification(`Енергія заряджена! Нагорода: ${reward} монет!`);
                localStorage.setItem("lastEnergyBurst", now);
                updateStats();
                saveGame();
                renderMinigames();
            }
        }, 100);
    };
    const stopHolding = () => {
        isHolding = false;
        if (holdTime < 5) {
            showNotification("Зарядка перервана! Ви отримали 50 монет!");
            coins += 50;
            updateStats();
            saveGame();
            renderMinigames();
        }
    };
    holdButton.addEventListener("mousedown", startHolding);
    holdButton.addEventListener("touchstart", e => {
        e.preventDefault();
        startHolding();
    });
    document.addEventListener("mouseup", stopHolding, { once: true });
    document.addEventListener("touchend", stopHolding, { once: true });
}

// Реакція Героя
function startHeroReaction() {
    const lastReaction = localStorage.getItem("lastHeroReaction");
    const now = Date.now();
    if (lastReaction && now - lastReaction < 3600000) {
        showNotification("Реакція Героя ще не готова! Зачекайте годину.");
        return;
    }
    let targetsHit = 0;
    minigameArea.innerHTML = `<div class="minigame-area" id="reactionArea"></div>`;
    const area = document.getElementById("reactionArea");
    let lastClickTime = 0;
    const clickDelay = 200;
    let timeLeft = 10;
    const spawnTarget = () => {
        if (timeLeft <= 0) return;
        const target = document.createElement("div");
        target.className = "hero-reaction-target";
        target.style.left = `${Math.random() * (area.offsetWidth - 36)}px`;
        target.style.top = `${Math.random() * (area.offsetHeight - 36)}px`;
        const handleTargetClick = () => {
            const now = Date.now();
            if (now - lastClickTime < clickDelay) return;
            lastClickTime = now;
            targetsHit++;
            updateQuests("heroReaction", 1);
            target.remove();
        };
        target.addEventListener("click", handleTargetClick);
        target.addEventListener("touchstart", e => {
            e.preventDefault();
            handleTargetClick();
        });
        area.appendChild(target);
        setTimeout(() => target.remove(), 1000);
    };
    const targetInterval = setInterval(spawnTarget, 800);
    const gameInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(targetInterval);
            clearInterval(gameInterval);
            const reward = targetsHit * 200;
            coins += reward;
            updateQuests("minigame", 1);
            updateBattlePassTasks("minigame", 1);
            updateAchievements("minigame", 1);
            showNotification(`Ви влучили в ${targetsHit} цілей! Нагорода: ${reward} монет!`);
            localStorage.setItem("lastHeroReaction", now);
            updateStats();
            saveGame();
            renderMinigames();
        }
    }, 1000);
}

// Космічний Захист
function startSpaceDefense() {
    const lastDefense = localStorage.getItem("lastSpaceDefense");
    const now = Date.now();
    if (lastDefense && now - lastDefense < 3600000) {
        showNotification("Космічний Захист ще не готовий! Зачекайте годину.");
        return;
    }
    let asteroidsDestroyed = 0;
    minigameArea.innerHTML = `<div class="minigame-area" id="defenseArea"></div>`;
    const area = document.getElementById("defenseArea");
    let lastClickTime = 0;
    const clickDelay = 200;
    let timeLeft = 15;
    const spawnAsteroid = () => {
        if (timeLeft <= 0) return;
        const asteroid = document.createElement("div");
        asteroid.className = "space-defense-asteroid";
        asteroid.style.left = `${Math.random() * (area.offsetWidth - 30)}px`;
        asteroid.style.top = `0px`;
        const handleAsteroidClick = () => {
            const now = Date.now();
            if (now - lastClickTime < clickDelay) return;
            lastClickTime = now;
            asteroidsDestroyed++;
            updateQuests("spaceDefense", 1);
            asteroid.remove();
        };
        asteroid.addEventListener("click", handleAsteroidClick);
        asteroid.addEventListener("touchstart", e => {
            e.preventDefault();
            handleAsteroidClick();
        });
        area.appendChild(asteroid);
        let posY = 0;
        const fallInterval = setInterval(() => {
            posY += 5;
            asteroid.style.top = `${posY}px`;
            if (posY >= area.offsetHeight - 30) {
                clearInterval(fallInterval);
                asteroid.remove();
            }
        }, 50);
        setTimeout(() => {
            clearInterval(fallInterval);
            asteroid.remove();
        }, 3000);
    };
    const asteroidInterval = setInterval(spawnAsteroid, 1000);
    const gameInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(asteroidInterval);
            clearInterval(gameInterval);
            const reward = asteroidsDestroyed * 150;
            coins += reward;
            updateQuests("minigame", 1);
            updateBattlePassTasks("minigame", 1);
            updateAchievements("minigame", 1);
            showNotification(`Ви знищили ${asteroidsDestroyed} астероїдів! Нагорода: ${reward} монет!`);
            localStorage.setItem("lastSpaceDefense", now);
            updateStats();
            saveGame();
            renderMinigames();
        }
    }, 1000);
}

// Енерго-Пазл
function startEnergyPuzzle() {
    const lastPuzzle = localStorage.getItem("lastEnergyPuzzle");
    const now = Date.now();
    if (lastPuzzle && now - lastPuzzle < 3600000) {
        showNotification("Енерго-Пазл ще не готовий! Зачекайте годину.");
        return;
    }
    minigameArea.innerHTML = `
        <div class="minigame-area" style="text-align: center;">
            <div class="energy-puzzle-tile" id="tile1">1</div>
            <div class="energy-puzzle-tile" id="tile2">2</div>
            <div class="energy-puzzle-tile" id="tile3">3</div>
            <div class="energy-puzzle-tile" id="tile4">4</div>
        </div>
    `;
    let sequence = [];
    let playerSequence = [];
    let lastClickTime = 0;
    const clickDelay = 200;
    const correctSequence = [1, 3, 2, 4];
    const showSequence = () => {
        sequence = correctSequence.slice();
        let i = 0;
        const showInterval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(showInterval);
                return;
            }
            const tile = document.getElementById(`tile${sequence[i]}`);
            tile.classList.add("active");
            setTimeout(() => tile.classList.remove("active"), 500);
            i++;
        }, 600);
    };
    setTimeout(showSequence, 1000);
    const handleTileClick = (tileId) => {
        const now = Date.now();
        if (now - lastClickTime < clickDelay) return;
        lastClickTime = now;
        const tile = document.getElementById(`tile${tileId}`);
        tile.classList.add("active");
        setTimeout(() => tile.classList.remove("active"), 200);
        playerSequence.push(tileId);
        if (playerSequence.length === sequence.length) {
            if (playerSe
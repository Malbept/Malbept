// game.js
const powerFill = document.getElementById("powerFill");
const powerPercent = document.getElementById("powerPercent");
const tapBtn = document.getElementById("tapBtn");
const scoreDisplay = document.getElementById("score");
const multiplierBtn = document.getElementById("multiplierBtn");
const multiplierPrice = document.getElementById("multiplierPrice");
const autoclickerPrice = document.getElementById("autoclickerPrice");
const offlinePrice = document.getElementById("offlinePrice");
const clickSound = document.getElementById("clickSound");

// Modal window for ПТЖ
const createPowerModal = () => {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>ПТЖ</h2>
      <div class="power-meter">
        <div class="power-fill" id="modalPowerFill"></div>
      </div>
      <div class="power-percent" id="modalPowerPercent">50%</div>
      <button class="skull-btn" id="modalSkullBtn">
        <img src="assets/skull.png" alt="Skull" />
      </button>
      <button class="close-btn" onclick="document.querySelector('.modal').remove()">Close</button>
    </div>
  `;
  document.body.appendChild(modal);

  const modalPowerFill = document.getElementById("modalPowerFill");
  const modalPowerPercent = document.getElementById("modalPowerPercent");
  const modalSkullBtn = document.getElementById("modalSkullBtn");
  let power = 50;
  let isAnimating = false;

  const fluctuatePower = () => {
    if (power >= 100) {
      isAnimating = false;
      return;
    }
    const change = Math.random() * 10 - 5;
    power = Math.max(0, Math.min(100, power + change));
    modalPowerFill.style.width = power + "%";
    modalPowerPercent.textContent = Math.round(power) + "%";
    if (power < 100) {
      setTimeout(fluctuatePower, 500);
    } else {
      isAnimating = false;
    }
  };

  modalSkullBtn.addEventListener("click", () => {
    if (!isAnimating) {
      isAnimating = true;
      clickSound.play();
      fluctuatePower();
    }
  });

  modalPowerFill.style.width = power + "%";
  modalPowerPercent.textContent = Math.round(power) + "%";
};

// Initialize game state
const initGame = async () => {
  await initGameState();
  powerFill.style.width = window.gameState.power + "%";
  powerPercent.textContent = Math.round(window.gameState.power) + "%";
  scoreDisplay.textContent = Math.round(window.gameState.score);
  multiplierBtn.textContent = `x${window.gameState.multiplier.toFixed(1)}`;
  multiplierPrice.textContent = Math.round(100 * Math.pow(1.2, window.gameState.multiplierLevel));
  autoclickerPrice.textContent = Math.round(200 * Math.pow(1.3, window.gameState.autoclickerLevel));
  offlinePrice.textContent = Math.round(500 * Math.pow(1.4, window.gameState.offlineLevel));
};
initGame();

// Open ПТЖ modal window
const openPowerWindow = () => {
  createPowerModal();
};

// Update score on server
const updateServerScore = async () => {
  await api.saveScore(
    window.gameState.playerId,
    window.gameState.playerName,
    Math.round(window.gameState.score)
  );
};

// Tap game
const tapGame = async () => {
  window.gameState.score += window.gameState.multiplier;
  scoreDisplay.textContent = Math.round(window.gameState.score);
  clickSound.play();
  saveGameData();
  await updateServerScore();
};

// Store
const buyMultiplier = async () => {
  const price = Math.round(100 * Math.pow(1.2, window.gameState.multiplierLevel));
  if (window.gameState.score >= price) {
    window.gameState.score -= price;
    window.gameState.multiplier += 0.5;
    window.gameState.multiplierLevel += 1;
    multiplierBtn.textContent = `x${window.gameState.multiplier.toFixed(1)}`;
    multiplierPrice.textContent = Math.round(100 * Math.pow(1.2, window.gameState.multiplierLevel));
    scoreDisplay.textContent = Math.round(window.gameState.score);
    clickSound.play();
    saveGameData();
    await updateServerScore();
  }
};

const buyAutoClicker = async () => {
  const price = Math.round(200 * Math.pow(1.3, window.gameState.autoclickerLevel));
  if (window.gameState.score >= price) {
    window.gameState.score -= price;
    window.gameState.autoClicker += 1;
    window.gameState.autoclickerLevel += 1;
    autoclickerPrice.textContent = Math.round(200 * Math.pow(1.3, window.gameState.autoclickerLevel));
    scoreDisplay.textContent = Math.round(window.gameState.score);
    clickSound.play();
    saveGameData();
    await updateServerScore();
  }
};

const buyOfflineProfit = async () => {
  const price = Math.round(500 * Math.pow(1.4, window.gameState.offlineLevel));
  if (window.gameState.score >= price) {
    window.gameState.score -= price;
    window.gameState.offlineProfit += 10;
    window.gameState.offlineLevel += 1;
    offlinePrice.textContent = Math.round(500 * Math.pow(1.4, window.gameState.offlineLevel));
    scoreDisplay.textContent = Math.round(window.gameState.score);
    clickSound.play();
    saveGameData();
    await updateServerScore();
  }
};

// Autoclicker
setInterval(async () => {
  if (window.gameState.autoClicker > 0) {
    window.gameState.score += window.gameState.autoClicker * window.gameState.multiplier;
    scoreDisplay.textContent = Math.round(window.gameState.score);
    saveGameData();
    await updateServerScore();
  }
}, 1000);

// Show sections
const showSection = (sectionId) => {
  document.querySelectorAll(".section").forEach((section) => {
    section.style.display = section.id === `${sectionId}Section` ? "block" : "none";
  });
};

// Load leaderboard
const loadLeaderboard = async () => {
  const leaderboard = await api.fetchLeaderboard();
  const leaderboardList = document.getElementById("leaderboard");
  leaderboardList.innerHTML = leaderboard
    .map((player, index) => `<li>#${index + 1} ${player.name}: ${player.score} points</li>`)
    .join("");
};

// Update player name
const updatePlayerName = async () => {
  const newName = document.getElementById("playerNameInput").value || "Player";
  window.gameState.playerName = newName;
  saveGameData();
  await updateServerScore();
};

// Event listeners
if (tapBtn) tapBtn.addEventListener("click", tapGame);
if (document.getElementById("ratingSection")) loadLeaderboard();
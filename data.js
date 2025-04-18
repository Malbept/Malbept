// data.js
const saveGameData = () => {
  const tg = window.Telegram.WebApp;
  tg.CloudStorage.setItem("power", window.gameState.power.toString());
  tg.CloudStorage.setItem("score", window.gameState.score.toString());
  tg.CloudStorage.setItem("multiplier", window.gameState.multiplier.toString());
  tg.CloudStorage.setItem("autoClicker", window.gameState.autoClicker.toString());
  tg.CloudStorage.setItem("offlineProfit", window.gameState.offlineProfit.toString());
  tg.CloudStorage.setItem("multiplierLevel", window.gameState.multiplierLevel.toString());
  tg.CloudStorage.setItem("autoclickerLevel", window.gameState.autoclickerLevel.toString());
  tg.CloudStorage.setItem("offlineLevel", window.gameState.offlineLevel.toString());
  tg.CloudStorage.setItem("playerId", window.gameState.playerId);
  tg.CloudStorage.setItem("playerName", window.gameState.playerName);
  tg.CloudStorage.setItem("lastLogin", Date.now().toString());
};

const loadGameData = async () => {
  const tg = window.Telegram.WebApp;
  const getItem = (key, defaultValue) => new Promise((resolve) => {
    tg.CloudStorage.getItem(key, (err, value) => {
      resolve(err ? defaultValue : value);
    });
  });

  const lastLogin = Number(await getItem("lastLogin", Date.now()));
  const hoursOffline = (Date.now() - lastLogin) / 1000 / 3600;
  const offlineProfit = Number(await getItem("offlineProfit", 0)) || 0;
  const score = Number(await getItem("score", 0)) || 0;

  let playerId = await getItem("playerId", null);
  if (!playerId) {
    playerId = tg.initDataUnsafe.user?.id.toString() || `player_${Math.floor(Math.random() * 10000)}`;
    tg.CloudStorage.setItem("playerId", playerId);
  }

  let playerName = await getItem("playerName", null);
  if (!playerName) {
    playerName = tg.initDataUnsafe.user?.first_name || `Player_${Math.floor(Math.random() * 10000)}`;
    tg.CloudStorage.setItem("playerName", playerName);
  }

  return {
    power: Number(await getItem("power", 50)) || 50,
    score: score + offlineProfit * hoursOffline,
    multiplier: Number(await getItem("multiplier", 1)) || 1,
    autoClicker: Number(await getItem("autoClicker", 0)) || 0,
    offlineProfit: offlineProfit,
    multiplierLevel: Number(await getItem("multiplierLevel", 0)) || 0,
    autoclickerLevel: Number(await getItem("autoclickerLevel", 0)) || 0,
    offlineLevel: Number(await getItem("offlineLevel", 0)) || 0,
    playerId,
    playerName,
  };
};

// Async loading of game data
const initGameState = async () => {
  window.gameState = await loadGameData();
};
initGameState();
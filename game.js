// game.js
let score = 0;
let clickMultiplier = 1;
let autoClickerRate = 0;
let passiveIncome = 0;
let energy = 100;
let maxEnergy = 100;
let level = 1;
let experience = 0;
let playerName = "Игрок";
let progress = 0;
let boostActive = false;
let tasks = [
  { id: 1, description: "Сделай 100 кликов", target: 100, reward: 50, progress: 0, completed: false, type: "clicks", level: 1 },
  { id: 2, description: "Купи 3 улучшения", target: 3, reward: 100, progress: 0, completed: false, type: "upgrades", level: 1 },
  { id: 3, description: "Набери 1000 очков", target: 1000, reward: 200, progress: 0, completed: false, type: "score", level: 1 },
  { id: 4, description: "Сделай 200 кликов", target: 200, reward: 80, progress: 0, completed: false, type: "clicks", level: 2 },
  { id: 5, description: "Набери 2000 очков", target: 2000, reward: 300, progress: 0, completed: false, type: "score", level: 2 },
  { id: 6, description: "Купи 5 улучшений", target: 5, reward: 150, progress: 0, completed: false, type: "upgrades", level: 2 },
  { id: 7, description: "Сделай 300 кликов", target: 300, reward: 120, progress: 0, completed: false, type: "clicks", level: 3 },
  { id: 8, description: "Набери 5000 очков", target: 5000, reward: 500, progress: 0, completed: false, type: "score", level: 3 },
  { id: 9, description: "Купи 7 улучшений", target: 7, reward: 200, progress: 0, completed: false, type: "upgrades", level: 3 },
  { id: 10, description: "Сделай 500 кликов", target: 500, reward: 200, progress: 0, completed: false, type: "clicks", level: 4 },
  { id: 11, description: "Набери 10000 очков", target: 10000, reward: 1000, progress: 0, completed: false, type: "score", level: 4 },
  { id: 12, description: "Купи 10 улучшений", target: 10, reward: 300, progress: 0, completed: false, type: "upgrades", level: 4 },
  { id: 13, description: "Сделай 1000 кликов", target: 1000, reward: 500, progress: 0, completed: false, type: "clicks", level: 5 },
  { id: 14, description: "Набери 20000 очков", target: 20000, reward: 2000, progress: 0, completed: false, type: "score", level: 5 },
  { id: 15, description: "Купи 15 улучшений", target: 15, reward: 500, progress: 0, completed: false, type: "upgrades", level: 5 },
  { id: 16, description: "Сделай 1500 кликов", target: 1500, reward: 800, progress: 0, completed: false, type: "clicks", level: 6 },
];
let clicks = 0;
let upgradesBought = 0;
let hasVyshyvanka = false;
let promoCodes = [
  { code: "VODEM2025", reward: 500, redeemed: false },
  { code: "UKRAINE", reward: 1000, redeemed: false },
];
let permanentBoost = 1;

// Языковые переводы
const translations = {
  ru: {
    title: "ПОТУЖНОМЕТР",
    vodiem: "ВОДЄМ",
    made_in: "MADE IN ВОДЄМ",
    player: "Игрок: ",
    level: "Уровень: ",
    energy: "Энергия: ",
    tap: "ПТЫК",
    main: "Главная",
    shop: "Магазин",
    tasks: "Задания",
    upgrades: "Улучшения",
    promo: "Промокоды",
    add_task: "Добавить задание",
    add_promo: "Добавить промокод",
    redeem_promo: "Активировать",
    click_multiplier_1: "Казацкая Сила +20%<br>Стоимость: 50P",
    click_multiplier_2: "Гетманская Мощь +50%<br>Стоимость: 200P",
    auto_clicker_1: "Сечевые Стрельцы +2P/сек<br>Стоимость: 100P",
    auto_clicker_2: "Казацкий Автомат +5P/сек<br>Стоимость: 300P",
    energy_max_1: "Запорожская Выносливость +50<br>Стоимость: 150P",
    energy_boost: "Горілка для Енергії (+50 Энергии)<br>Стоимость: 100P",
    click_boost: "Крыивка Силы +20% (60 сек)<br>Стоимость: 150P",
    auto_click_boost: "Дух Бандеры +20% (60 сек)<br>Стоимость: 200P",
    passive_income: "Кобзарский Заработок +5P/сек<br>Стоимость: 500P",
    visual_upgrade: "Вышиванка для ПТЫК<br>Стоимость: 1000P",
    boost_1: "Сало для Силы +10% (30 сек)<br>Стоимость: 80P",
    boost_2: "Борщ для Энергии (+30 Энергии)<br>Стоимость: 70P",
    boost_3: "Калиновая Мощь +15% (45 сек)<br>Стоимость: 120P",
    boost_4: "Днепровская Выносливость (+100 Энергии)<br>Стоимость: 200P",
    boost_5: "Чумацкий Путь +10P/сек (60 сек)<br>Стоимость: 250P",
    boost_6: "Кобза Удачи (+5% к очкам)<br>Стоимость: 300P",
    boost_7: "Степной Ветер +20P/сек (30 сек)<br>Стоимость: 180P",
    boost_8: "Чернобыльский Импульс +25% (60 сек)<br>Стоимость: 400P",
    boost_9: "Тризуб Славы (+10% к очкам)<br>Стоимость: 500P",
    boost_10: "Песня Кобзаря +15P/сек<br>Стоимость: 600P",
    boost_11: "Дух Карпат +5% (60 сек)<br>Стоимость: 90P",
    boost_12: "Славянский Щит +20 Энергии<br>Стоимость: 60P",
    boost_13: "Воля Народа +10% (45 сек)<br>Стоимость: 110P",
    boost_14: "Солнечный Подсолнух +50 Энергии<br>Стоимость: 130P",
    boost_15: "Запорожский Дуб +10P/сек (60 сек)<br>Стоимость: 220P",
    boost_16: "Скифское Золото +15% к очкам<br>Стоимость: 350P",
    boost_17: "Донецкий Уголь +15P/сек (30 сек)<br>Стоимость: 160P",
    boost_18: "Львовский Кофе +20% (60 сек)<br>Стоимость: 300P",
    boost_19: "Одесский Бриз +10% к очкам<br>Стоимость: 400P",
    boost_20: "Херсонский Арбуз +20P/сек<br>Стоимость: 450P",
    boost_21: "Киевский Торт +10% (60 сек)<br>Стоимость: 100P",
    boost_22: "Крымский Мост +30 Энергии<br>Стоимость: 80P",
    boost_23: "Полтавская Битва +15% (45 сек)<br>Стоимость: 130P",
    boost_24: "Черниговский Мёд +50 Энергии<br>Стоимость: 140P",
    boost_25: "Харьковский Танк +15P/сек (60 сек)<br>Стоимость: 240P",
    boost_26: "Житомирский Гранит +15% к очкам<br>Стоимость: 370P",
    boost_27: "Сумской Лес +20P/сек (30 сек)<br>Стоимость: 170P",
    boost_28: "Ровенский Янтарь +20% (60 сек)<br>Стоимость: 320P",
    boost_29: "Винницкая Вишня +10% к очкам<br>Стоимость: 420P",
    boost_30: "Николаевский Корабль +25P/сек<br>Стоимость: 480P",
  },
  en: {
    title: "POTUZHNOMETR",
    vodiem: "VODEM",
    made_in: "MADE IN VODEM",
    player: "Player: ",
    level: "Level: ",
    energy: "Energy: ",
    tap: "TAP",
    main: "Main",
    shop: "Shop",
    tasks: "Tasks",
    upgrades: "Upgrades",
    promo: "Promo Codes",
    add_task: "Add Task",
    add_promo: "Add Promo Code",
    redeem_promo: "Redeem",
    click_multiplier_1: "Cossack Power +20%<br>Cost: 50P",
    click_multiplier_2: "Hetman Might +50%<br>Cost: 200P",
    auto_clicker_1: "Sich Riflemen +2P/sec<br>Cost: 100P",
    auto_clicker_2: "Cossack Auto +5P/sec<br>Cost: 300P",
    energy_max_1: "Zaporizhian Endurance +50<br>Cost: 150P",
    energy_boost: "Horilka for Energy (+50 Energy)<br>Cost: 100P",
    click_boost: "Kryivka Power +20% (60 sec)<br>Cost: 150P",
    auto_click_boost: "Bandera Spirit +20% (60 sec)<br>Cost: 200P",
    passive_income: "Kobzar Earnings +5P/sec<br>Cost: 500P",
    visual_upgrade: "Vyshyvanka for TAP<br>Cost: 1000P",
    boost_1: "Salo for Strength +10% (30 sec)<br>Cost: 80P",
    boost_2: "Borscht for Energy (+30 Energy)<br>Cost: 70P",
    boost_3: "Kalyna Might +15% (45 sec)<br>Cost: 120P",
    boost_4: "Dnipro Endurance (+100 Energy)<br>Cost: 200P",
    boost_5: "Chumak Way +10P/sec (60 sec)<br>Cost: 250P",
    boost_6: "Kobza Luck (+5% to points)<br>Cost: 300P",
    boost_7: "Steppe Wind +20P/sec (30 sec)<br>Cost: 180P",
    boost_8: "Chernobyl Pulse +25% (60 sec)<br>Cost: 400P",
    boost_9: "Tryzub Glory (+10% to points)<br>Cost: 500P",
    boost_10: "Kobzar Song +15P/sec<br>Cost: 600P",
    boost_11: "Carpathian Spirit +5% (60 sec)<br>Cost: 90P",
    boost_12: "Slavic Shield +20 Energy<br>Cost: 60P",
    boost_13: "People's Will +10% (45 sec)<br>Cost: 110P",
    boost_14: "Sunny Sunflower +50 Energy<br>Cost: 130P",
    boost_15: "Zaporizhian Oak +10P/sec (60 sec)<br>Cost: 220P",
    boost_16: "Scythian Gold +15% to points<br>Cost: 350P",
    boost_17: "Donetsk Coal +15P/sec (30 sec)<br>Cost: 160P",
    boost_18: "Lviv Coffee +20% (60 sec)<br>Cost: 300P",
    boost_19: "Odesa Breeze +10% to points<br>Cost: 400P",
    boost_20: "Kherson Watermelon +20P/sec<br>Cost: 450P",
    boost_21: "Kyiv Cake +10% (60 sec)<br>Cost: 100P",
    boost_22: "Crimean Bridge +30 Energy<br>Cost: 80P",
    boost_23: "Poltava Battle +15% (45 sec)<br>Cost: 130P",
    boost_24: "Chernihiv Honey +50 Energy<br>Cost: 140P",
    boost_25: "Kharkiv Tank +15P/sec (60 sec)<br>Cost: 240P",
    boost_26: "Zhytomyr Granite +15% to points<br>Cost: 370P",
    boost_27: "Sumy Forest +20P/sec (30 sec)<br>Cost: 170P",
    boost_28: "Rivne Amber +20% (60 sec)<br>Cost: 320P",
    boost_29: "Vinnytsia Cherry +10% to points<br>Cost: 420P",
    boost_30: "Mykolaiv Ship +25P/sec<br>Cost: 480P",
  },
};

// Загрузка данных из localStorage
function loadGameData() {
  const savedData = localStorage.getItem('gameData');
  if (savedData) {
    const data = JSON.parse(savedData);
    score = data.score || 0;
    clickMultiplier = data.clickMultiplier || 1;
    autoClickerRate = data.autoClickerRate || 0;
    passiveIncome = data.passiveIncome || 0;
    energy = data.energy || 100;
    maxEnergy = data.maxEnergy || 100;
    level = data.level || 1;
    experience = data.experience || 0;
    tasks = data.tasks || tasks;
    clicks = data.clicks || 0;
    upgradesBought = data.upgradesBought || 0;
    hasVyshyvanka = data.hasVyshyvanka || false;
    promoCodes = data.promoCodes || promoCodes;
    permanentBoost = data.permanentBoost || 1;
  }

  // Получаем ник из Telegram
  if (window.Telegram && window.Telegram.WebApp) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    if (user && user.username) {
      playerName = user.username;
    } else if (user && user.first_name) {
      playerName = user.first_name;
    }
  }

  // Загружаем настройки
  const savedLanguage = localStorage.getItem('language') || 'ru';
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.getElementById('language-select').value = savedLanguage;
  document.getElementById('theme-select').value = savedTheme;
  changeLanguage(savedLanguage);
  changeTheme(savedTheme);

  // Проверяем, ты ли это (по Telegram ID)
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id;
  if (userId === 5678878569) { // Замени YOUR_TELEGRAM_ID на твой Telegram ID
    document.getElementById('add-task-section').style.display = 'block';
    document.getElementById('add-promo-section').style.display = 'block';
  }

  document.getElementById('player-name').innerText = `${translations[savedLanguage].player}${playerName}`;
  if (hasVyshyvanka) {
    document.getElementById('tap-button').classList.add('vyshyvanka');
  }
  updateUI();
  updateTasks();
}

// Сохранение данных в localStorage
function saveGameData() {
  const data = {
    score,
    clickMultiplier,
    autoClickerRate,
    passiveIncome,
    energy,
    maxEnergy,
    level,
    experience,
    tasks,
    clicks,
    upgradesBought,
    hasVyshyvanka,
    promoCodes,
    permanentBoost,
  };
  localStorage.setItem('gameData', JSON.stringify(data));
}

// Обновление интерфейса
function updateUI() {
  document.getElementById('score').innerText = `${Math.floor(score)}P`;
  document.getElementById('energy').innerText = `${translations[currentLanguage].energy}${Math.floor(energy)}/${maxEnergy}`;
  document.getElementById('level').innerText = `${translations[currentLanguage].level}${level}`;
  document.querySelector('.progress-text').innerText = `${progress}%`;
  document.querySelector('.progress-fill').style.width = `${progress}%`;
}

// Обновление заданий
function updateTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  tasks.filter(task => task.level <= level).forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.innerHTML = `
      <p>${task.description} (${task.progress}/${task.target}) - Награда: ${task.reward}P</p>
      ${task.completed ? '<span>Завершено</span>' : '<button onclick="claimTask(' + task.id + ')">Получить</button>'}
    `;
    taskList.appendChild(taskItem);
  });
}

// Проверка уровня и добавление новых заданий
function checkLevel() {
  const expNeeded = level * 100;
  if (experience >= expNeeded) {
    level++;
    experience = 0;
    progress = 0;
    addNewTasks();
  } else {
    progress = (experience / expNeeded) * 100;
  }
  updateUI();
  saveGameData();
}

// Добавление новых заданий с новым уровнем
function addNewTasks() {
  const newTasks = [
    { id: tasks.length + 1, description: `Сделай ${level * 100} кликов`, target: level * 100, reward: level * 50, progress: 0, completed: false, type: "clicks", level: level },
    { id: tasks.length + 2, description: `Набери ${level * 1000} очков`, target: level * 1000, reward: level * 200, progress: 0, completed: false, type: "score", level: level },
  ];
  tasks.push(...newTasks);
  updateTasks();
  saveGameData();
}

// Обработка клика
document.getElementById('tap-button').addEventListener('click', () => {
  if (energy >= 1) {
    energy -= 1;
    score += clickMultiplier * permanentBoost;
    clicks++;
    experience += 1;

    const clickSound = document.getElementById('click-sound');
    clickSound.currentTime = 0;
    clickSound.play();

    tasks.forEach(task => {
      if (!task.completed) {
        if (task.type === 'clicks') {
          task.progress = clicks;
          if (task.progress >= task.target) task.completed = true;
        } else if (task.type === 'score') {
          task.progress = Math.floor(score);
          if (task.progress >= task.target) task.completed = true;
        }
      }
    });

    checkLevel();
    updateUI();
    updateTasks();
    saveGameData();
  } else {
    alert('Недостаточно энергии!');
  }
});

// Восстановление энергии
setInterval(() => {
  if (energy < maxEnergy) {
    energy = Math.min(maxEnergy, energy + 0.5);
    updateUI();
    saveGameData();
  }
}, 1000);

// Автокликер и пассивный доход
setInterval(() => {
  score += (autoClickerRate + passiveIncome) * permanentBoost;
  updateUI();
  saveGameData();
}, 1000);

// Покупка множителя кликов
function buyClickMultiplier(id, cost, multiplier) {
  if (score >= cost) {
    score -= cost;
    clickMultiplier *= multiplier;
    upgradesBought++;
    document.getElementById(`click-multiplier-${id}`).style.display = 'none';
    playBuySound();
    updateTasksForUpgrades();
    updateUI();
    saveGameData();
  } else {
    alert('Недостаточно очков!');
  }
}

// Покупка автокликера
function buyAutoClicker(id, cost, rate) {
  if (score >= cost) {
    score -= cost;
    autoClickerRate += rate;
    upgradesBought++;
    document.getElementById(`auto-clicker-${id}`).style.display = 'none';
    playBuySound();
    updateTasksForUpgrades();
    updateUI();
    saveGameData();
  } else {
    alert('Недостаточно очков!');
  }
}

// Покупка увеличения максимальной энергии
function buyEnergyMax(id, cost, amount) {
  if (score >= cost) {
    score -= cost;
    maxEnergy += amount;
    energy += amount;
    upgradesBought++;
    document.getElementById(`energy-max-${id}`).style.display = 'none';
    playBuySound();
    updateTasksForUpgrades();
    updateUI();
    saveGameData();
  } else {
    alert('Недостаточно очков!');
  }
}

// Покупка буста энергии
function buyEnergyBoost() {
  const cost = 100;
  if (score >= cost) {
    score -= cost;
    energy = Math.min(maxEnergy, energy + 50);
    playBuySound();
    updateUI();
    saveGameData();
  } else {
    alert('Недостаточно очков!');
  }
}

// Покупка кастомного буста энергии
function buyEnergyBoostCustom(id, cost, amount) {
  if (score >= cost) {
    score -= cost;
    energy = Math.min(maxEnergy, energy + amount);
    document.getElementById(`boost-${id}`).style.display = 'none';
    playBuySound();
    updateUI();
    saveGameData();
  } else {
    alert('Недостаточно очков!');
  }
}

// Покупка буста кликов
function buyClickBoost() {
  const cost = 150;
  const multiplier = 1.2;
  const duration = 60;
  if (score >= cost && !boostActive) {
    score -= cost;
    boostActive = true;
    const originalMultiplier = clickMultiplier;
    clickMultiplier *= multiplier;

    playBuySound();
    updateUI();
    saveGameData();

    setTimeout(() => {
      clickMultiplier = originalMultiplier;
      boostActive = false;
      updateUI();
      saveGameData();
    }, duration * 1000);
  } else {
    alert(boostActive ? 'Буст уже активен!' : 'Недостаточно очков!');
  }
}

// Покупка буста автокликера
function buyAutoClickBoost() {
  const cost = 200;
  const multiplier = 1.2;
  const duration = 60;
  if (score >= cost && !boostActive) {
    score -= cost;
    boostActive = true;
    const originalRate = autoClickerRate;
    autoClickerRate *= multiplier;

    playBuySound();
    updateUI();
    saveGameData();

    setTimeout(() => {
      autoClickerRate = originalRate;
      boostActive = false;
      updateUI();
      saveGameData();
    }, duration * 1000);
  } else {
    alert(boostActive ? 'Буст уже активен!' : 'Недостаточно очков!');
  }
}

// Покупка общего буста
function buyBoost(id, cost, multiplier, duration) {
  if (score >= cost && !boostActive) {
    score -= cost;
    boostActive = true;
    const originalMultiplier = clickMultiplier;
    const originalRate = autoClickerRate;
    clickMultiplier *= multiplier;
    autoClickerRate *= multiplier;

    playBuySound();
    updateUI();
    saveGameData();

    setTimeout(() => {
      clickMultiplier = originalMultiplier;
      autoClickerRate = originalRate;
      boostActive = false;
      updateUI();
      saveGameData();
    }, duration * 1000);
    document.getElementById(`boost-${id}`).style.display = 'none';
  } else {
    alert(boostActive ? 'Буст уже активен!' : 'Недостаточно очков!');
  }
}

// Покупка временного пассивного дохода
function buyPassiveBoost(id, cost, amount, duration) {
  if (score >= cost && !boostActive) {
    score -= cost;
    boostActive = true;
    passiveIncome += amount;

    playBuySound();
    updateUI();
    saveGameData();

    setTimeout(() => {
      passiveIncome -= amount;
      boostActive = false;
      updateUI();
      saveGameData();
    }, duration * 1000);
    document.getElementById(`boost-${id}`).style.display = 'none';
  } else {
    alert(boostActive ? 'Буст уже активен!' : 'Недостаточно очков!');
  }
}

// Покупка постоянного буста
function buyPermanentBoost(id, cost, multiplier) {
  if (score >= cost) {
    score -= cost;
    permanentBoost *= multiplier;
    document.getElementById(`boost-${id}`).style.display = 'none';
    playBuySound();
    updateUI();
    saveGameData();
  } else {
    alert('Недостаточно очков!');
  }
}

// Покупка пассивного дохода
function buyPassiveIncome() {
  const cost = 500;
  const income = 5;
  if (score >= cost) {
    score -= cost;
    passiveIncome += income;
    document.getElementById('passive-income').style.display = 'none';
    playBuySound();
    updateUI();
    saveGameData();
  } else {
    alert('Недостаточно очков!');
  }
}

// Покупка кастомного пассивного дохода
function buyPassiveIncomeCustom(id, cost, amount) {
  if (score >= cost) {
    score -= cost;
    passiveIncome += amount;
    document.getElementById(`boost-${id}`).style.display = 'none';
    playBuySound();
    updateUI();
    saveGameData();
  } else {
    alert('Недостаточно очков!');
  }
}

// Покупка визуального улучшения
function buyVisualUpgrade() {
  const cost = 1000;
  if (score >= cost) {
    score -= cost;
    hasVyshyvanka = true;
    document.getElementById('tap-button').classList.add('vyshyvanka');
    document.getElementById('visual-upgrade').style.display = 'none';
    playBuySound();
    updateUI();
    saveGameData();
  } else {
    alert('Недостаточно очков!');
  }
}

// Получение награды за задание
function claimTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (task && task.completed && !task.claimed) {
    score += task.reward;
    task.claimed = true;
    playBuySound();
    updateTasks();
    updateUI();
    saveGameData();
  }
}

// Добавление нового задания
function addNewTask() {
  const description = document.getElementById('new-task-description').value;
  const target = parseInt(document.getElementById('new-

// Действия
async function summonPet() {
    if (profile.coins >= 50) {
        const weights = [0.5, 0.3, 0.1, 0.05, 0.03, 0.02];
        let random = Math.random(), sum = 0;
        let index = 0;
        for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (random <= sum) {
                index = i;
                break;
            }
        }
        const newPet = PETS[index];
        profile.coins -= 50;
        profile.pets.push(newPet);
        profile.stats.pets_summoned += 1;
        profile.xp += 20;
        await sendCommand(`/add_pet ${newPet.name}`);
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats pets_summoned ${profile.stats.pets_summoned}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Ты призвал ${newPet.name} (${newPet.rarity})! 🐾 +20 XP`);
        await checkAchievements();
        await checkRank();
        showPets();
    } else {
        alert('Недостаточно монет! 🥺');
    }
}

async function collectItem() {
    if (profile.coins >= 30) {
        const newItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        profile.coins -= 30;
        profile.items.push(newItem);
        profile.stats.items_collected += 1;
        profile.xp += 10;
        await sendCommand(`/add_item ${newItem}`);
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats items_collected ${profile.stats.items_collected}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Ты собрал ${newItem}! 🧺 +10 XP`);
        await checkAchievements();
        await checkRank();
        showCollections();
    } else {
        alert('Недостаточно монет! 🥺');
    }
}

async function buyPet(petName) {
    const pet = PETS.find(p => p.name === petName);
    if (pet && profile.coins >= pet.price) {
        profile.coins -= pet.price;
        profile.pets.push(pet);
        profile.stats.pets_summoned += 1;
        profile.xp += 50;
        await sendCommand(`/add_pet ${pet.name}`);
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats pets_summoned ${profile.stats.pets_summoned}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Ты купил ${pet.name} (${pet.rarity})! 🐾 +50 XP`);
        await checkAchievements();
        await checkRank();
        showShop();
    } else {
        alert('Недостаточно монет или питомец не найден! 🥺');
    }
}

async function buyItem() {
    if (profile.coins >= 50) {
        const newItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        profile.coins -= 50;
        profile.items.push(newItem);
        profile.stats.items_collected += 1;
        profile.xp += 15;
        await sendCommand(`/add_item ${newItem}`);
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats items_collected ${profile.stats.items_collected}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Ты купил ${newItem}! 🧺 +15 XP`);
        await checkAchievements();
        await checkRank();
        showShop();
    } else {
        alert('Недостаточно монет! 🥺');
    }
}

async function buyTitle() {
    const titles = ["Мастер казино 🎰", "Король питомцев 🐾", "Легенда чата 🌟"];
    if (profile.coins >= 200) {
        const newTitle = titles[Math.floor(Math.random() * titles.length)];
        profile.title = newTitle;
        profile.coins -= 200;
        profile.xp += 30;
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Ты получил титул: ${newTitle}! 😎 +30 XP`);
        await checkRank();
        showShop();
    } else {
        alert('Недостаточно монет! 🥺');
    }
}

// Игры
function startBlackjack() {
    document.getElementById('content').innerHTML = `
        <h2>Блекджек 🎴</h2>
        <button class="action" onclick="playBlackjack(10)">Ставка: 10 💰</button>
        <button class="action" onclick="playBlackjack(50)">Ставка: 50 💰</button>
        <button class="action" onclick="playBlackjack(100)">Ставка: 100 💰</button>
    `;
}

async function playBlackjack(bet) {
    if (profile.coins >= bet) {
        const cards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        const player = [cards[Math.floor(Math.random() * cards.length)], cards[Math.floor(Math.random() * cards.length)]];
        const dealer = [cards[Math.floor(Math.random() * cards.length)], cards[Math.floor(Math.random() * cards.length)]];
        const calculateScore = cards => {
            const values = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": 11 };
            let score = 0, aces = 0;
            for (const card of cards) {
                if (card === "A") aces++;
                score += values[card];
            }
            while (score > 21 && aces) {
                score -= 10;
                aces--;
            }
            return score;
        };
        profile.stats.blackjack_games += 1;
        profile.game_state = { game: "blackjack", bet, player, dealer };
        localStorage.setItem('profile', JSON.stringify(profile));
        await sendCommand(`/update_stats blackjack_games ${profile.stats.blackjack_games}`);
        document.getElementById('content').innerHTML = `
            <h2>Блекджек 🎴</h2>
            <div id="game-area">
                <p>Твои карты: ${player.join(', ')} (Очки: ${calculateScore(player)})</p>
                <p>Карта дилера: ${dealer[0]}</p>
                <button class="action" onclick="blackjackHit()">Взять карту</button>
                <button class="action" onclick="blackjackStand()">Остановиться</button>
            </div>
        `;
    } else {
        alert('Недостаточно монет! 🥺');
    }
}

async function blackjackHit() {
    if (profile.game_state.game !== "blackjack") return alert('Игра не найдена! 😿');
    const cards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const newCard = cards[Math.floor(Math.random() * cards.length)];
    profile.game_state.player.push(newCard);
    const calculateScore = cards => {
        const values = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": 11 };
        let score = 0, aces = 0;
        for (const card of cards) {
            if (card === "A") aces++;
            score += values[card];
        }
        while (score > 21 && aces) {
            score -= 10;
            aces--;
        }
        return score;
    };
    const playerScore = calculateScore(profile.game_state.player);
    localStorage.setItem('profile', JSON.stringify(profile));
    if (playerScore > 21) {
        profile.coins -= profile.game_state.bet;
        profile.game_state = {};
        await sendCommand(`/update_coins ${profile.coins}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Перебор! 😿 Ты проиграл ${profile.game_state.bet} монет.`);
        showGames();
    } else {
        document.getElementById('content').innerHTML = `
            <h2>Блекджек 🎴</h2>
            <div id="game-area">
                <p>Твои карты: ${profile.game_state.player.join(', ')} (Очки: ${playerScore})</p>
                <p>Карта дилера: ${profile.game_state.dealer[0]}</p>
                <button class="action" onclick="blackjackHit()">Взять карту</button>
                <button class="action" onclick="blackjackStand()">Остановиться</button>
            </div>
        `;
    }
}

async function blackjackStand() {
    if (profile.game_state.game !== "blackjack") return alert('Игра не найдена! 😿');
    const cards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const calculateScore = cards => {
        const values = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": 11 };
        let score = 0, aces = 0;
        for (const card of cards) {
            if (card === "A") aces++;
            score += values[card];
        }
        while (score > 21 && aces) {
            score -= 10;
            aces--;
        }
        return score;
    };
    let dealer = profile.game_state.dealer;
    let dealerScore = calculateScore(dealer);
    while (dealerScore < 17) {
        dealer.push(cards[Math.floor(Math.random() * cards.length)]);
        dealerScore = calculateScore(dealer);
    }
    const playerScore = calculateScore(profile.game_state.player);
    const gameBoost = profile.pets.reduce((sum, pet) => sum + (pet.bonus.game_boost || 0), 0);
    if (dealerScore > 21 || playerScore > dealerScore) {
        const win = Math.floor(profile.game_state.bet * 2 * (1 + gameBoost));
        profile.coins += win;
        profile.stats.blackjack_wins += 1;
        profile.stats.game_wins += 1;
        profile.xp += 30;
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats blackjack_wins ${profile.stats.blackjack_wins}`);
        await sendCommand(`/update_stats game_wins ${profile.stats.game_wins}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Победа! 🎉 Ты выиграл ${win} монет! +30 XP`);
        await checkAchievements();
        await checkRank();
    } else if (playerScore === dealerScore) {
        alert(`Ничья! 😺 Монеты не изменились.`);
    } else {
        profile.coins -= profile.game_state.bet;
        await sendCommand(`/update_coins ${profile.coins}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Проигрыш! 😿 Ты потерял ${profile.game_state.bet} монет.`);
    }
    profile.game_state = {};
    localStorage.setItem('profile', JSON.stringify(profile));
    document.getElementById('content').innerHTML = `
        <h2>Блекджек 🎴</h2>
        <div id="game-area">
            <p>Твои карты: ${profile.game_state.player.join(', ')} (Очки: ${playerScore})</p>
            <p>Карты дилера: ${dealer.join(', ')} (Очки: ${dealerScore})</p>
            <button class="action" onclick="startBlackjack()">Играть снова</button>
        </div>
    `;
}

function startSlots() {
    document.getElementById('content').innerHTML = `
        <h2>Слоты 🎰</h2>
        <button class="action" onclick="playSlots(10)">Ставка: 10 💰</button>
        <button class="action" onclick="playSlots(20)">Ставка: 20 💰</button>
        <button class="action" onclick="playSlots(50)">Ставка: 50 💰</button>
    `;
}

async function playSlots(bet) {
    if (profile.coins >= bet) {
        const symbols = ["🍒", "🍋", "🍊", "💎", "🔔", "7️⃣"];
        const result = Array.from({length: 3}, () => symbols[Math.floor(Math.random() * symbols.length)]);
        profile.coins -= bet;
        profile.stats.slot_games += 1;
        profile.xp += 10;
        const gameBoost = profile.pets.reduce((sum, pet) => sum + (pet.bonus.game_boost || 0), 0);
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats slot_games ${profile.stats.slot_games}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        let message = `Слоты: ${result.join('')} 🎰\n`;
        if (result[0] === result[1] && result[1] === result[2]) {
            const win = Math.floor(bet * 5 * (1 + gameBoost));
            profile.coins += win;
            profile.stats.game_wins += 1;
            await sendCommand(`/update_coins ${profile.coins}`);
            await sendCommand(`/update_stats game_wins ${profile.stats.game_wins}`);
            message += `Джекпот! 🎉 Ты выиграл ${win} монет! +10 XP`;
        } else if (result[0] === result[1] || result[1] === result[2]) {
            const win = Math.floor(bet * 2 * (1 + gameBoost));
            profile.coins += win;
            profile.stats.game_wins += 1;
            await sendCommand(`/update_coins ${profile.coins}`);
            await sendCommand(`/update_stats game_wins ${profile.stats.game_wins}`);
            message += `Неплохо! 🎉 Ты выиграл ${win} монет! +10 XP`;
        } else {
            message += `Не повезло! 😿 Попробуй ещё! +10 XP`;
        }
        localStorage.setItem('profile', JSON.stringify(profile));
        await checkAchievements();
        await checkRank();
        document.getElementById('content').innerHTML = `
            <h2>Слоты 🎰</h2>
            <div id="game-area">
                <p>${message}</p>
                <button class="action" onclick="startSlots()">Играть снова</button>
            </div>
        `;
    } else {
        alert('Недостаточно монет! 🥺');
    }
}

function startDice() {
    document.getElementById('content').innerHTML = `
        <h2>Кости 🎲</h2>
        <button class="action" onclick="playDice(10)">Ставка: 10 💰</button>
        <button class="action" onclick="playDice(20)">Ставка: 20 💰</button>
        <button class="action" onclick="playDice(50)">Ставка: 50 💰</button>
    `;
}

async function playDice(bet) {
    if (profile.coins >= bet) {
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        profile.coins -= bet;
        profile.stats.dice_games += 1;
        profile.xp += 10;
        const gameBoost = profile.pets.reduce((sum, pet) => sum + (pet.bonus.game_boost || 0), 0);
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats dice_games ${profile.stats.dice_games}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        let message = `Кости: ${dice1} + ${dice2} = ${total} 🎲\n`;
        if (total >= 10) {
            const win = Math.floor(bet * 3 * (1 + gameBoost));
            profile.coins += win;
            profile.stats.game_wins += 1;
            await sendCommand(`/update_coins ${profile.coins}`);
            await sendCommand(`/update_stats game_wins ${profile.stats.game_wins}`);
            message += `Крупный улов! 🎉 Ты выиграл ${win} монет! +10 XP`;
        } else if (total >= 7) {
            const win = Math.floor(bet * 2 * (1 + gameBoost));
            profile.coins += win;
            profile.stats.game_wins += 1;
            await sendCommand(`/update_coins ${profile.coins}`);
            await sendCommand(`/update_stats game_wins ${profile.stats.game_wins}`);
            message += `Неплохо! 🎉 Ты выиграл ${win} монет! +10 XP`;
        } else {
            message += `Не повезло! 😿 Попробуй ещё! +10 XP`;
        }
        localStorage.setItem('profile', JSON.stringify(profile));
        await checkAchievements();
        await checkRank();
        document.getElementById('content').innerHTML = `
            <h2>Кости 🎲</h2>
            <div id="game-area">
                <p>${message}</p>
                <button class="action" onclick="startDice()">Играть снова</button>
            </div>
        `;
    } else {
        alert('Недостаточно монет! 🥺');
    }
}

function startRoulette() {
    document.getElementById('content').innerHTML = `
        <h2>Рулетка 🎡</h2>
        <button class="action" onclick="playRoulette('red', 10)">Красное (x2) - 10 💰</button>
        <button class="action" onclick="playRoulette('black', 10)">Чёрное (x2) - 10 💰</button>
        <button class="action" onclick="playRoulette('green', 10)">Зелёное (x14) - 10 💰</button>
    `;
}

async function playRoulette(color, bet) {
    if (profile.coins >= bet) {
        const outcomes = Array(18).fill('red').concat(Array(18).fill('black'), ['green']);
        const result = outcomes[Math.floor(Math.random() * outcomes.length)];
        profile.coins -= bet;
        profile.stats.roulette_games += 1;
        profile.xp += 15;
        const gameBoost = profile.pets.reduce((sum, pet) => sum + (pet.bonus.game_boost || 0), 0);
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats roulette_games ${profile.stats.roulette_games}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        let message = `Рулетка: ${result} 🎡\n`;
        if (result === color) {
            const multiplier = color === 'green' ? 14 : 2;
            const win = Math.floor(bet * multiplier * (1 + gameBoost));
            profile.coins += win;
            profile.stats.game_wins += 1;
            await sendCommand(`/update_coins ${profile.coins}`);
            await sendCommand(`/update_stats game_wins ${profile.stats.game_wins}`);
            message += `Победа! 🎉 Ты выиграл ${win} монет! +15 XP`;
        } else {
            message += `Не повезло! 😿 Попробуй ещё! +15 XP`;
        }
        localStorage.setItem('profile', JSON.stringify(profile));
        await checkAchievements();
        await checkRank();
        document.getElementById('content').innerHTML = `
            <h2>Рулетка 🎡</h2>
            <div id="game-area">
                <p>${message}</p>
                <button class="action" onclick="startRoulette()">Играть снова</button>
            </div>
        `;
    } else {
        alert('Недостаточно монет! 🥺');
    }
}

function startClicker() {
    profile.game_state = { game: "clicker", clicks: 0 };
    localStorage.setItem('profile', JSON.stringify(profile));
    document.getElementById('content').innerHTML = `
        <h2>Кликер 💰</h2>
        <div id="game-area">
            <p>Кликов: ${profile.game_state.clicks}/10</p>
            <button class="action" onclick="clickerClick()">Клик! 💰</button>
        </div>
    `;
}

async function clickerClick() {
    if (profile.game_state.game !== "clicker") return alert('Игра не найдена! 😿');
    profile.game_state.clicks += 1;
    profile.stats.clicker_games += 1;
    await sendCommand(`/update_stats clicker_games ${profile.stats.clicker_games}`);
    if (profile.game_state.clicks >= 10) {
        const gameBoost = profile.pets.reduce((sum, pet) => sum + (pet.bonus.game_boost || 0), 0);
        const reward = Math.floor(50 * (1 + gameBoost));
        profile.coins += reward;
        profile.stats.game_wins += 1;
        profile.xp += 20;
        profile.game_state = {};
        await sendCommand(`/update_coins ${profile.coins}`);
        await sendCommand(`/update_xp ${profile.xp}`);
        await sendCommand(`/update_stats game_wins ${profile.stats.game_wins}`);
        localStorage.setItem('profile', JSON.stringify(profile));
        alert(`Ты накликал 10 раз! 🎉 Награда: ${reward} монет! +20 XP`);
        await checkAchievements();
        await checkRank();
        showGames();
    } else {
        localStorage.setItem('profile', JSON.stringify(profile));
        document.getElementById('content').innerHTML = `
            <h2>Кликер 💰</h2>
            <div id="game-area">
                <p>Кликов: ${profile.game_state.clicks}/10</p>
                <button class="action" onclick="clickerClick()">Клик! 💰</button>
            </div>
        `;
    }
}

function startGuessCharacter() {
    const character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    profile.game_state = { game: "guess_character", character: character.name, hints: character.hints, current_hint: 0 };
    localStorage.setItem('profile', JSON.stringify(profile));
    document.getElementById('content').innerHTML = `
        <h2>Угадай персонажа 🧠</h2>
        <div id="game-area">
            <
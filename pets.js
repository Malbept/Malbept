profile.pets = profile.pets || [];
profile.petPlayCount = profile.petPlayCount || 0;

function showPets() {
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Питомцы 🐾</h2>
        <p>Твои питомцы приносят 1 монету в минуту!</p>
        <p>Всего питомцев: ${profile.pets.length}</p>
        ${profile.pets.length > 0 ? profile.pets.map((pet, index) => `
            <p>${pet.name} (${pet.type}) 
            <button class="action glass-button" onclick="playWithPet(${index})">Играть</button></p>
        `).join('') : '<p>У тебя пока нет питомцев.</p>'}
        <button class="action glass-button" onclick="adoptPet()">Приютить питомца (100 монет)</button>
    `;
    if (!historyStack.includes('showPets')) {
        historyStack.push('showPets');
    }
    updateProfile();
    applyTheme();
}

function adoptPet() {
    if (profile.coins >= 100) {
        profile.coins -= 100;
        const petTypes = ['Котик 😺', 'Собачка 🐶', 'Дракончик 🐉'];
        const petNames = ['Лапка', 'Шарик', 'Снежок', 'Пушок', 'Искры'];
        const type = petTypes[Math.floor(Math.random() * petTypes.length)];
        const name = petNames[Math.floor(Math.random() * petNames.length)];
        profile.pets.push({ name, type });
        showNotification(`Ты приютил питомца: ${name} (${type})! 🐾`);
        showPets();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function playWithPet(index) {
    const pet = profile.pets[index];
    profile.coins += 10;
    profile.petPlayCount++;
    if (profile.petPlayCount >= 5) {
        checkSecret('play_with_pet_5');
    }
    showNotification(`Ты поиграл с ${pet.name}! +10 монет 🐾`);
    showPets();
    updateProfile();
}

// Начисление монет от питомцев каждую минуту
function earnFromPets() {
    if (profile.pets.length > 0) {
        const earnings = profile.pets.length;
        profile.coins += earnings;
        showNotification(`Твои питомцы принесли ${earnings} монет! 🐾`);
        updateProfile();
    }
}

// Учёт оффлайн-времени
function calculateOfflineEarnings() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    localStorage.setItem('lastVisit', now);

    if (lastVisit && profile.pets.length > 0) {
        const minutesPassed = Math.floor((now - lastVisit) / 60000); // Сколько минут прошло
        if (minutesPassed > 0) {
            const earnings = profile.pets.length * minutesPassed;
            profile.coins += earnings;
            showNotification(`Пока тебя не было, питомцы принесли ${earnings} монет! 🐾`);
            updateProfile();
        }
    }
}

// Запускаем начисление монет каждую минуту
setInterval(earnFromPets, 60000);
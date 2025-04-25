// ui-realestate.js

// Недвижимость
function showRealEstate() {
    const properties = profile.items.filter(item => item.includes('Дом') || item.includes('Машина') || item.includes('Бизнес') || item.includes('Яхта') || item.includes('Самолёт') || item.includes('Вилла') || item.includes('Завод') || item.includes('Ранчо'));
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Недвижимость 🏡</h2>
        <p>Покупай недвижимость и получай пассивный доход!</p>
        <button class="action glass-button" onclick="buyProperty('Дом', 500)">Купить Дом (500 монет)</button>
        <button class="action glass-button" onclick="buyProperty('Машина', 1000)">Купить Машину (1000 монет)</button>
        <button class="action glass-button" onclick="buyProperty('Бизнес', 2000)">Купить Бизнес (2000 монет)</button>
        <button class="action glass-button" onclick="buyProperty('Яхта', 3000)">Купить Яхту (3000 монет)</button>
        <button class="action glass-button" onclick="buyProperty('Самолёт', 5000)">Купить Самолёт (5000 монет)</button>
        <button class="action glass-button" onclick="buyProperty('Вилла', 7000)">Купить Виллу (7000 монет)</button>
        <button class="action glass-button" onclick="buyProperty('Завод', 10000)">Купить Завод (10000 монет)</button>
        <button class="action glass-button" onclick="buyProperty('Ранчо', 12000)">Купить Ранчо (12000 монет)</button>
        <h3>Твоя недвижимость:</h3>
        ${properties.length > 0 ? properties.map((item, index) => `
            <p>${item} 
                <button class="action glass-button" onclick="sellProperty('${item}', ${index})">Продать за ${(item.includes('Дом') ? 250 : item.includes('Машина') ? 500 : item.includes('Бизнес') ? 1000 : item.includes('Яхта') ? 1500 : item.includes('Самолёт') ? 2500 : item.includes('Вилла') ? 3500 : item.includes('Завод') ? 5000 : 6000)} монет</button>
                <button class="action glass-button" onclick="upgradeProperty('${item}', ${index})">Улучшить (${(item.includes('Дом') ? 100 : item.includes('Машина') ? 200 : item.includes('Бизнес') ? 400 : item.includes('Яхта') ? 600 : item.includes('Самолёт') ? 1000 : item.includes('Вилла') ? 1400 : item.includes('Завод') ? 2000 : 2400)} монет)</button>
                <button class="action glass-button" onclick="rentProperty('${item}', ${index})">Сдать в аренду</button>
            </p>
        `).join('') : '<p>У тебя пока нет недвижимости.</p>'}
        <button class="action glass-button" onclick="showMarket()">Рынок 🏪</button>
    `;
    if (!historyStack.includes('showRealEstate')) {
        historyStack.push('showRealEstate');
    }
    updateProfile();
}

function buyProperty(type, cost) {
    if (profile.coins >= cost) {
        profile.coins -= cost;
        const propertyName = `${type} ${profile.items.filter(item => item.includes(type)).length + 1}`;
        profile.items.push(propertyName);
        showNotification(`Куплено: ${propertyName}! 🏡`);
        // Добавляем пассивный доход
        setInterval(() => {
            if (profile.items.includes(propertyName)) {
                const income = type === 'Дом' ? 10 : type === 'Машина' ? 20 : type === 'Бизнес' ? 50 : type === 'Яхта' ? 75 : type === 'Самолёт' ? 100 : type === 'Вилла' ? 150 : type === 'Завод' ? 200 : 250;
                profile.coins += income;
                showNotification(`Пассивный доход от ${propertyName}: +${income} монет 💸`);
                updateProfile();
            }
        }, 600000); // 10 минут
        // Налоги раз в час
        setInterval(() => {
            if (profile.items.includes(propertyName)) {
                const tax = Math.floor(cost * 0.05);
                profile.coins -= tax;
                showNotification(`Налог за ${propertyName}: -${tax} монет 📜`);
                updateProfile();
            }
        }, 3600000); // 1 час
        showRealEstate();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function sellProperty(property, index) {
    const propertyValues = {
        'Дом': 250,
        'Машина': 500,
        'Бизнес': 1000,
        'Яхта': 1500,
        'Самолёт': 2500,
        'Вилла': 3500,
        'Завод': 5000,
        'Ранчо': 6000
    };
    const baseValue = propertyValues[property.split(' ')[0]] || 250;
    profile.coins += baseValue;
    profile.items.splice(index, 1);
    showNotification(`Продано: ${property} за ${baseValue} монет 💸`);
    showRealEstate();
    updateProfile();
}

function upgradeProperty(property, index) {
    const upgradeCosts = {
        'Дом': 100,
        'Машина': 200,
        'Бизнес': 400,
        'Яхта': 600,
        'Самолёт': 1000,
        'Вилла': 1400,
        'Завод': 2000,
        'Ранчо': 2400
    };
    const cost = upgradeCosts[property.split(' ')[0]] || 100;
    if (profile.coins >= cost) {
        profile.coins -= cost;
        profile.items[index] = `${property} (Улучшено)`;
        showNotification(`Недвижимость ${property} улучшена! Доход увеличен. 🏠`);
        showRealEstate();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}

function rentProperty(property, index) {
    const rentIncome = {
        'Дом': 20,
        'Машина': 40,
        'Бизнес': 100,
        'Яхта': 150,
        'Самолёт': 200,
        'Вилла': 300,
        'Завод': 400,
        'Ранчо': 500
    };
    const income = rentIncome[property.split(' ')[0]] || 20;
    profile.coins += income;
    showNotification(`Недвижимость ${property} сдана в аренду! +${income} монет 🏠`);
    showRealEstate();
    updateProfile();
}

// Рынок
function showMarket() {
    const properties = profile.items.filter(item => item.includes('Дом') || item.includes('Машина') || item.includes('Бизнес') || item.includes('Яхта') || item.includes('Самолёт') || item.includes('Вилла') || item.includes('Завод') || item.includes('Ранчо'));
    document.getElementById('main-content').innerHTML = `
        <button class="back-button glass-button" onclick="goBack()">Назад ⬅️</button>
        <h2>Рынок 🏪</h2>
        <p>Продавай или покупай недвижимость!</p>
        <h3>Твоя недвижимость на продажу:</h3>
        ${properties.length > 0 ? properties.map((item, index) => `
            <p>${item} <button class="action glass-button" onclick="sellOnMarket('${item}', ${index})">Продать на рынке за ${(item.includes('Дом') ? 300 : item.includes('Машина') ? 600 : item.includes('Бизнес') ? 1200 : item.includes('Яхта') ? 1800 : item.includes('Самолёт') ? 3000 : item.includes('Вилла') ? 4200 : item.includes('Завод') ? 6000 : 7200)} монет</button></p>
        `).join('') : '<p>У тебя нет недвижимости для продажи.</p>'}
        <h3>Доступно для покупки:</h3>
        <button class="action glass-button" onclick="buyFromMarket('Дом на рынке', 600)">Купить Дом (600 монет)</button>
        <button class="action glass-button" onclick="buyFromMarket('Машина на рынке', 1200)">Купить Машину (1200 монет)</button>
    `;
    if (!historyStack.includes('showMarket')) {
        historyStack.push('showMarket');
    }
    updateProfile();
}

function sellOnMarket(property, index) {
    const marketValues = {
        'Дом': 300,
        'Машина': 600,
        'Бизнес': 1200,
        'Яхта': 1800,
        'Самолёт': 3000,
        'Вилла': 4200,
        'Завод': 6000,
        'Ранчо': 7200
    };
    const value = marketValues[property.split(' ')[0]] || 300;
    profile.coins += value;
    profile.items.splice(index, 1);
    showNotification(`Продано на рынке: ${property} за ${value} монет 💸`);
    showMarket();
    updateProfile();
}

function buyFromMarket(property, cost) {
    if (profile.coins >= cost) {
        profile.coins -= cost;
        profile.items.push(property);
        showNotification(`Куплено на рынке: ${property}! 🏠`);
        showMarket();
        updateProfile();
    } else {
        showNotification('Недостаточно монет! 💰');
    }
}
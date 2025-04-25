// main.js
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

function sendCommand(command) {
    fetch(`https://api.telegram.org/bot7234958924:AAHCz8bNVMTWzoDF0DEeUhXr6eoF57Vpcl0/${command}`)
        .catch(err => console.error('Error sending command:', err));
}

function updateProfile() {
    const profileDiv = document.getElementById('profile');
    if (profileDiv) {
        profileDiv.innerHTML = `
            <p>Имя: ${profile.username}</p>
            <p>Монеты: ${profile.coins} 💰</p>
            <p>Энергия: ${profile.energy}/${profile.maxEnergy} ⚡</p>
        `;
    }
    saveProfile();
}

document.addEventListener('DOMContentLoaded', () => {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    if (user && user.username) {
        profile.username = user.username;
    } else {
        profile.username = 'User';
    }

    // Пасхалка: 10 кликов по баннеру
    let bannerClicks = 0;
    const banner = document.getElementById('banner');
    if (banner) {
        banner.addEventListener('click', () => {
            bannerClicks++;
            if (bannerClicks >= 10) {
                profile.coins += 100;
                showNotification('Секретная награда! +100 монет 🎉');
                bannerClicks = 0;
                updateProfile();
            }
        });
    }

    // Проверяем наличие функции updateEnergy
    if (typeof updateEnergy === 'function') {
        setInterval(updateEnergy, 1000); // Обновление энергии каждую секунду
    } else {
        console.error('updateEnergy is not defined. Check if ui.js is loaded correctly.');
    }
});
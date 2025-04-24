// main.js
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

function sendCommand(command) {
    fetch(`https://api.telegram.org/bot${'7234958924:AAHCz8bNVMTWzoDF0DEeUhXr6eoF57Vpcl0'}/${command}`)
        .catch(err => console.error('Error sending command:', err));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('profile').innerHTML = `
        <p>Имя: ${profile.username}</p>
        <p>Монеты: ${profile.coins} 💰</p>
    `;
});
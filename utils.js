function bindButtonEvents() {
    document.querySelectorAll('.action').forEach(button => {
        // Удаляем старые обработчики, чтобы избежать дублирования
        button.removeEventListener('touchstart', handleTouchStart);
        button.removeEventListener('touchend', handleTouchEnd);
        button.removeEventListener('click', handleClick);

        // Привязываем новые обработчики
        button.addEventListener('touchstart', handleTouchStart);
        button.addEventListener('touchend', handleTouchEnd);
        button.addEventListener('click', handleClick);
    });
}

function handleTouchStart(event) {
    event.target.classList.add('active');
}

function handleTouchEnd(event) {
    event.target.classList.remove('active');
}

function handleClick(event) {
    const action = event.target.getAttribute('data-action');
    if (action && window[action]) {
        window[action]();
    } else {
        console.error(`Function ${action} is not defined.`);
    }
}

// Вызываем привязку событий при изменении содержимого
function observeContentChanges() {
    const mainContent = document.getElementById('main-content');
    const observer = new MutationObserver(() => {
        bindButtonEvents();
    });
    observer.observe(mainContent, { childList: true, subtree: true });
}
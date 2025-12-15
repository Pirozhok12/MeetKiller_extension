let isCounterActive = false;
let counterInterval;
let maxParticipants = 0;

// Функция для обновления количества участников с отладочными выводами
function updateParticipantCount() {
    console.debug("Проверка количества участников");
    const participantElement = document.querySelector('.uGOf1d');

    if (participantElement) {
        const participantCount = parseInt(participantElement.textContent, 10);
        console.log("Текущее количество участников:", participantCount);

        if (maxParticipants === 0) {
            maxParticipants = participantCount;
            console.debug("Установлено максимальное число участников:", maxParticipants);
        }

        if (participantCount < maxParticipants * 0.67 && isCounterActive) {
            console.warn("Количество участников упало ниже 67% от максимума, выход из конференции");
            leaveCall();
        }
    } else {
        console.warn("Элемент с количеством участников (.uGOf1d) не найден.");
    }
}

// Функция для выхода из конференции с отладкой
function leaveCall() {
    isCounterActive = false;
    toggleParticipantCounter(false);

    const leaveButtonSelectors = [
        'button[aria-label="Завершити дзвінок"]',
        'button[aria-label="Leave call"]',
        'button[aria-label="End call"]',
        'button[aria-label*="Завершить звонок"]',
        'button[aria-label*="Leave"]',
        'button[aria-label*="End"]'
    ];

    let leaveButton = null;

    for (const selector of leaveButtonSelectors) {
        leaveButton = document.querySelector(selector);
        if (leaveButton) {
            leaveButton.click();
            console.log("Кнопка выхода нажата");
            return;
        }
    }

    if (!leaveButton) {
        console.error("Кнопка выхода не найдена");
    }
}

// Функция для переключения состояния счетчика с отладкой
function toggleParticipantCounter(active) {
    isCounterActive = active;
    console.debug("Состояние счётчика участников:", isCounterActive ? "активно" : "не активно");

    if (isCounterActive) {
        console.log("Запуск интервала для обновления количества участников");
        counterInterval = setInterval(updateParticipantCount, 2000);
    } else {
        console.log("Остановка интервала для обновления количества участников");
        clearInterval(counterInterval);
    }
}

// Обработчик сообщений из popup.js
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleCounter") {
        toggleParticipantCounter(message.isActive);
    }
});

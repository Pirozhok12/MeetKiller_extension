document.addEventListener("DOMContentLoaded", () => {
    const toggleCounter = document.getElementById("toggleCounter");
    let isCounterActive = false;

    // Восстанавливаем состояние кнопки из chrome.storage.local
    chrome.storage.local.get(["isCounterActive"], (data) => {
        isCounterActive = data.isCounterActive || false;
        toggleCounter.checked = isCounterActive;
    });

    // Переключаем состояние счётчика участников
    toggleCounter.addEventListener("change", async () => {
        isCounterActive = toggleCounter.checked;
        chrome.storage.local.set({ isCounterActive }); // Сохраняем состояние

        try {
            await sendMessageToContent("toggleCounter", isCounterActive);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    // Функция для отправки сообщений на content.js
    function sendMessageToContent(action, isActive) {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0] && tabs[0].url.startsWith("https://meet.google.com/")) {
                    chrome.tabs.sendMessage(tabs[0].id, { action, isActive }, (response) => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        }
                        resolve(response);
                    });
                } else {
                    console.warn("Расширение активно только на Google Meet");
                    toggleCounter.checked = false;
                    reject(new Error("Не на странице Google Meet"));
                }
            });
        });
    }
});

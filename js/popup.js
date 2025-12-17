document.addEventListener("DOMContentLoaded", () => {

    const leaveBtn = document.getElementById("leaveBtn");
    leaveBtn.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (!tab || !tab.url.startsWith("https://meet.google.com/")) {
                console.log("Not a Google Meet tab");
                return;
            }

            chrome.tabs.sendMessage(tab.id, { type: "LEAVE_MEET" });
        });
    });

    
    const slider = document.getElementById("participantsThreshold");
    const valueSpan = document.getElementById("participantsValue");
    valueSpan.textContent = slider.value;


    chrome.storage.local.get(["participantsThreshold"], (data) => {
    const value = typeof data.participantsThreshold === "number"
        ? data.participantsThreshold
        : slider.min || 17; // fallback

    slider.value = value;
    valueSpan.textContent = value;
    });

    
    slider.addEventListener("input", () => {

        const value = Number(slider.value);
        valueSpan.textContent = value;
        chrome.storage.local.set({participantsThreshold: value});

    });


    const countSpan = document.getElementById('count');
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.currentCount) {
            countSpan.textContent = changes.currentCount.newValue;
        }
    });

    chrome.storage.local.get('currentCount', ({ currentCount }) => {
        if (currentCount !== undefined) countSpan.textContent = currentCount;
    });

    const toggleSwitch = document.getElementById("toggle-switch");
 
    chrome.storage.local.get(["autoLeave"], (data) => {
        toggleSwitch.checked = data.autoLeave || false; 
    });

    toggleSwitch.addEventListener("change", () => {
        const isChecked = toggleSwitch.checked;
        chrome.storage.local.set({ autoLeave: isChecked });

           chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (!tab || !tab.url.startsWith("https://meet.google.com/")) {
                console.log("Not a Google Meet tab");
                toggleSwitch.checked = false;
                toggleSwitch.disabled = true;
                return;
            }
              chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_AUTO_LEAVE", isActive: isChecked });
              toggleSwitch.disabled = false;

        });
    });


});

let isValueTaken = false;
let isLeaveBtnPress = false;
let zoomedOut = false;
let autoLeaveEnabled = false;
let threshold = 0;


function isActiveMeetCall() {

}


function getParticipantCount() {
    const divCounetrSelectors = ['.uGOf1d', 'div[style*="fit-content"]'];
    let div;
    for (const selector of divCounetrSelectors) {
        div = document.querySelector(selector);
        if(div)break;
    }
    if (div && isLeaveBtnPress !== true) {
        const count = parseInt(div.textContent, 10);
        
        if(!isNaN(count) && count !== 0){
            isValueTaken = true;
            console.log("isValueTaken = true");
            zoomedOut = false;
            return count;
        }
    }
    if(isValueTaken && !zoomedOut) {
        console.log("sendMessage ZOOM_OUT");
        chrome.runtime.sendMessage({ type: "ZOOM_OUT" });
        zoomedOut = true;
    }
    return 0;
}


const observer = new MutationObserver(() => {

    const count = getParticipantCount();
    if (count === 0) return;
    console.log("count:", count);
    chrome.storage.local.set({ currentCount: count });
    
    if (autoLeaveEnabled === true){
        chrome.storage.local.get("participantsThreshold", (data) => {
            const threshold = data.participantsThreshold;
            console.log("threshold:", threshold);   

            if (typeof threshold !== "number") return;

            console.log("Compare:", count, "===", threshold);

            if (count >= threshold) {
                observer.disconnect();
                leaveMeet();
            }
        });
    }
});

observer.observe(document.body, { childList: true, subtree: true });


function leaveMeet() {
    const leaveButtonSelectors = [
        'button[aria-label="Покинуть видеовстречу"]',
        'button[aria-label="Завершити дзвінок"]',
        'button[aria-label="Leave call"]',
        'button[aria-label="End call"]',
        'button[aria-label*="Leave"]',
        'button[aria-label*="End"]',
        'button[aria-label*="видеовстречу"]',
        'button[aria-label*="відеозустріч"]'
    ];

    for (const selector of leaveButtonSelectors) {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.click();
            console.log("Кнопка выхода нажата");
            return;
        }
    }
    console.error("Leave button not found");
}


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "LEAVE_MEET") {
        observer.disconnect();
        chrome.runtime.sendMessage({ type: "ZOOM_RESET" });
        console.log(" sendMessage ZOOM_RESET");
        isLeaveBtnPress = true;
        leaveMeet();
    }
  
    if (msg.type === "TOGGLE_AUTO_LEAVE") {
        if (msg.isActive) {
            autoLeaveEnabled = true;
            console.log("TOGGLE_AUTO_LEAVE:", autoLeaveEnabled);
        }
        else{
            autoLeaveEnabled = false;
            console.log("TOGGLE_AUTO_LEAVE:", autoLeaveEnabled);
        }
    }


});




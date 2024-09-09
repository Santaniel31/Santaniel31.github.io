let tg = window.Telegram.WebApp;
const userID = tg.WebAppUser.id;
tg.expand();
tg.headerColor = "#17212b";
tg.MainButton.textColor = "#FFFFFF"
tg.MainButton.color = "#008000";
tg.MainButton.setText("Получить");

const dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open("userAwards", 1);

    request.onerror = (event) => {
        reject(event.target.error);
    };

    request.onsuccess = (event) => {
        resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const store = db.createObjectStore("awards", { keyPath: "userId" });
    };
});

const button = document.getElementById("open-box");
const modal = document.getElementsByClassName("modal-award")[0];
const countAward = document.getElementById("countAward");
const nextAward = document.getElementById("nextAward");

function getLastExecutionTime() {
    return new Promise((resolve, reject) => {
        dbPromise.then(db => {
            const transaction = db.transaction("awards", "readonly");
            const store = transaction.objectStore("awards");
            const request = store.get(userID);

            request.onerror = (event) => {
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                if (event.target.result) {
                    resolve(event.target.result.lastExecutionTime);
                } else {
                    resolve(0);
                }
            };
        }).catch(err => reject(err));
    });
}

function updateLastExecutionTime(time) {
    return new Promise((resolve, reject) => {
        dbPromise.then(db => {
            const transaction = db.transaction("awards", "readwrite");
            const store = transaction.objectStore("awards");
            const request = store.put({ userId: userID, lastExecutionTime: time });

            request.onerror = (event) => {
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                resolve();
            };
        }).catch(err => reject(err));
    });
}

window.onload = async function() {
    const currentTime = Date.now();
    const lastExecutionTime = await getLastExecutionTime();

    if (currentTime - lastExecutionTime < 43200000) {
        let remainingTimeSeconds = (43200000 - (currentTime - lastExecutionTime)) / 1000;
        let remainingHours = parseInt(remainingTimeSeconds / 3600);
        let remainingMinutes = parseInt((remainingTimeSeconds % 3600) / 60);
        nextAward.textContent = `Награда недоступна еще ${remainingHours} часов ${remainingMinutes} минут`;
        modal.classList.add("show");
        tg.MainButton.setText("Закрыть");
        tg.MainButton.color = "#ff0000";
        tg.MainButton.show()
    } 
};

button.onclick = async function() {
    const currentTime = Date.now();
    const lastExecutionTime = await getLastExecutionTime(); 

    if (currentTime - lastExecutionTime < 43200000) { 
        let remainingTimeSeconds = (43200000 - (currentTime - lastExecutionTime)) / 1000;
        let remainingHours = parseInt(remainingTimeSeconds / 3600);
        let remainingMinutes = parseInt((remainingTimeSeconds % 3600) / 60);
        nextAward.textContent = `Награда недоступна еще ${remainingHours} часов ${remainingMinutes} минут`;
        return; 
    }

    const dailyPoint = Math.floor(Math.random() * 71) + 30;

    await updateLastExecutionTime(currentTime); 

    countAward.textContent = `Вы получили: ${dailyPoint}💎`;
    nextAward.textContent = "Возвращайтесь через 12 часов";
    modal.classList.add("show");
    tg.MainButton.show()
};

tg.MainButton.onEvent("click", () => {
    if (tg.MainButton.getText() === "Закрыть") {
        tg.close();
    } else {
        tg.SendData(toString(countAward));
    }
});

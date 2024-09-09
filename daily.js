let tg = window.Telegram.WebApp;
tg.expand();
tg.headerColor = "#17212b";
tg.MainButton.textColor = "#FFFFFF"
tg.MainButton.color = "#008000";
tg.MainButton.setText("Получить");

const button = document.getElementById("open-box");
const modal = document.getElementsByClassName("modal-award")[0];
const countAward = document.getElementById("countAward");
const nextAward = document.getElementById("nextAward");

button.onclick = function() {
    dailyPoint = Math.floor(Math.random() * 71) + 30;
    countAward.textContent = `Вы получили: ${dailyPoint}💎`;
    nextAward.textContent = "Возвращайтесь через 12 часов";
    modal.classList.add("show");
    tg.MainButton.show()
    counter += 1;
    
    let data = {
        award: dailyPoint.toString() 
    };

    if (counter > 1) {
        return;
    }
    Telegram.WebApp.onEvent("mainButtonClicked", function(){
        tg.sendData(JSON.stringify(data));
    });
};


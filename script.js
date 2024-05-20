"use strict";
//======Bindings======//
/* Status Indicators */
const petHpIndicator = document.querySelector(".petHp");
const petHungerIndicator = document.querySelector(".petHunger");
const petHappyIndicator = document.querySelector(".petHappy");
/* Pet */
const thePet = document.querySelector(".thePet");
/* Start Game */
const nameInput = document.querySelector(".nameInput");
const playGameBtn = document.querySelector(".playGameBtn");
const gameStart = document.querySelector(".gameStart");
const overlayStart = document.querySelector(".overlay");
/* Game OVER */
const gameOver = document.querySelector(".gameOver");
const restartGame = document.querySelector(".restartGame");
/* Side UI */
const petName = document.querySelector(".petName");
const petLevel = document.querySelector(".petLevel");
const petExp = document.querySelector(".petExp");
const money = document.querySelector(".money");
/* Shop UI */
const petStore = document.querySelector(".petStore");
const closeStoreBtn = document.querySelector(".closeStoreBtn");
const storeMoneyUI = document.querySelector(".yourShoppingMoney");
const shopInventory = document.querySelector(".shopContent");
/* Feed UI */
const feedUi = document.querySelector(".feedUI");
const feedUiCloseBtn = document.querySelector(".closeFeedUIBtn");
const feedUiInventory = document.querySelector(".feedInventory");
/* Game Controls */
const uiBtnPet = document.querySelector(".btnPet");
const uiBtnFeed = document.querySelector(".btnFeed");
const uiBtnPlay = document.querySelector(".btnPlay");
const uiBtnShop = document.querySelector(".btnShop");
/* Minigame */
const miniWindow = document.querySelector(".minigame");
const miniTimer = document.querySelector(".minigameTimer");
const miniPoints = document.querySelector(".minigamePoints");
const miniGame = document.querySelector(".whackMole");
/*======Objects======*/
let yourPet = {
    name: "",
    level: 1,
    hp: 100,
    hunger: 100,
    happiness: 100,
    size: 64,
    experience: 0
};
/*======Variables======*/
/* Timers */
let wanderTimer;
let petHealthUpdate;
let petHungerUpdate;
let petHappinessUpdate;
let petAlive;
let pettingCooldown;
/* Variables */
let foodItems = [
    {
        icon: "💊",
        name: "Medicine",
        value: 200,
        healValue: {
            hp: 30,
            hunger: 0,
            happiness: -10
        }
    },
    {
        icon: "🍗",
        name: "Delicious Snack",
        value: 120,
        healValue: {
            hp: 0,
            hunger: 30,
            happiness: 10
        }
    },
    {
        icon: "🥫",
        name: "Canned Food",
        value: 80,
        healValue: {
            hp: 0,
            hunger: 20,
            happiness: 0
        }
    },
    {
        icon: "🍣",
        name: "Yummy Treat",
        value: 200,
        healValue: {
            hp: 10,
            hunger: 30,
            happiness: 20
        }
    },
    {
        icon: "🥛",
        name: "Milk",
        value: 40,
        healValue: {
            hp: 0,
            hunger: 15,
            happiness: 0
        }
    }
];
let yourItems = [];
let yourGold = 500;
let canPet = true;
/* Animation variables */
let frameSize = 64;
let xFramesWidth = frameSize * 3;
let yFramesHeight = frameSize * 4;
/*===Mini Game===*/
/* Timers */
let minigameTimer;
let mouseMove;
let miniDuratation = 30;
/* Variables */
let holesArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let mouse = 1;
let gamePoints = 0;
/*======Functions======*/
/*===Game Start===*/
playGameBtn.onclick = () => {
    if (nameInput.value === "") {
        alert("Please Enter A Name");
    }
    else if (nameInput.value.length < 5) {
        alert("Name needs to be at least 5 characters long");
    }
    else {
        yourPet.name = nameInput.value;
        yourPet.hp = 100;
        yourPet.hunger = 100;
        yourPet.happiness = 100;
        yourPet.level = 1;
        yourPet.experience = 0;
        yourPet.size = 60;
        gameStart.classList.toggle("hide");
        overlayStart.classList.toggle("hide");
        petStatus();
    }
};
/*===Pet Status Changes===*/
petHealthUpdate = setInterval(() => {
    if (yourPet.hunger < 50 || yourPet.happiness < 50) {
        yourPet.hp -= rng(20);
    }
}, 20000);
petHungerUpdate = setInterval(() => {
    yourPet.hunger -= rng(10);
    petStatus();
}, 20000);
petHappinessUpdate = setInterval(() => {
    yourPet.happiness -= rng(10);
    petStatus();
}, 20000);
pettingCooldown = setInterval(() => {
    canPet = true;
    yourPet.experience += 5;
    petStatus();
}, 30000);
petAlive = setInterval(() => {
    checkAlive();
}, 1000);
function petGrowth() {
    if (yourPet.experience >= 100 && yourPet.level < 5) {
        yourPet.size += 16;
        frameSize += 16;
        yourPet.level++;
        yourPet.experience -= 100;
        thePet.style.width = `${frameSize}px`;
        thePet.style.height = `${frameSize}px`;
        thePet.style.backgroundSize = `${xFramesWidth}px ${yFramesHeight}px`;
    }
    if (yourPet.level === 5) {
        petExp.classList.add("hide");
    }
}
function checkAlive() {
    if (yourPet.hp <= 0) {
        gameOver.classList.toggle("hide");
        overlayStart.classList.toggle("hide");
    }
}
/*====Actions====*/
uiBtnPet.onclick = () => {
    if (canPet) {
        yourPet.happiness += 10;
        yourPet.experience += 10;
        canPet = false;
        petStatus();
    }
    else {
        alert("Your pet becomes a bit grumpy.");
    }
};
restartGame.onclick = () => {
    gameOver.classList.toggle("hide");
    gameStart.classList.toggle("hide");
};
/*====Shop====*/
uiBtnShop.onclick = () => {
    petStore.classList.toggle("hide");
    overlayStart.classList.toggle("hide");
    revealShop();
};
closeStoreBtn.onclick = () => {
    petStore.classList.toggle("hide");
    overlayStart.classList.toggle("hide");
};
function revealShop() {
    storeMoneyUI.innerHTML = "Money: " + yourGold;
    shopInventory.innerHTML = "";
    foodItems.forEach(item => {
        const el = document.createElement("div");
        el.classList.add("shopItem");
        el.innerHTML = `
            <div class="shopItemInfo">
                    <div>${item.icon}</div>
                    <div>${item.name}</div>
                    <div>Cost: ${item.value}</div>
                </div>
                <div>
                    <div>❤️ ${item.healValue.hp}</div>
                    <div>🍖 ${item.healValue.hunger}</div>
                    <div>😺 ${item.healValue.happiness}</div>
                </div>
                <div>
                    <div class="controlsBtn shopItemBtnBuy">Buy</div>
            </div>
        `;
        shopInventory.append(el);
    });
    const buyButtons = document.querySelectorAll(".shopItemBtnBuy");
    buyButtons.forEach((button, index) => {
        // @ts-ignore
        button.onclick = () => {
            if (yourGold >= foodItems[index].value) {
                yourGold -= foodItems[index].value;
                yourItems.push(foodItems[index]);
                console.log(yourItems);
                revealShop();
            }
            else {
                alert("Not Enough Money");
            }
        };
    });
}
/* FEED PET */
uiBtnFeed.onclick = () => {
    feedUi.classList.toggle("hide");
    overlayStart.classList.toggle("hide");
    feedInventoryShow();
};
feedUiCloseBtn.onclick = () => {
    feedUi.classList.toggle("hide");
    overlayStart.classList.toggle("hide");
};
function feedInventoryShow() {
    feedUiInventory.innerHTML = "";
    yourItems.forEach(item => {
        const el = document.createElement("div");
        el.classList.add("shopItem");
        el.innerHTML = `
            <div class="shopItemInfo">
                    <div>${item.icon}</div>
                    <div>${item.name}</div>
                    <div>Cost: ${item.value}</div>
                </div>
                <div>
                    <div>❤️ ${item.healValue.hp}</div>
                    <div>🍖 ${item.healValue.hunger}</div>
                    <div>😺 ${item.healValue.happiness}</div>
                </div>
                <div>
                    <div class="controlsBtn inventoryFeedBtn">Feed</div>
            </div>
        `;
        feedUiInventory.append(el);
    });
    const feedButtons = document.querySelectorAll(".inventoryFeedBtn");
    feedButtons.forEach((button, index) => {
        // @ts-ignore
        button.onclick = () => {
            yourPet.hp += yourItems[index].healValue.hp;
            yourPet.hunger += yourItems[index].healValue.hunger;
            yourPet.happiness += yourItems[index].healValue.happiness;
            yourItems = yourItems.filter((x, i) => i !== index);
            petStatus();
            feedInventoryShow();
        };
    });
}
/*===Pet Animations===*/
function rng(max) {
    return Math.round(Math.random() * max);
}
// Old Version
/*function petWander() {
    return new Promise((resolve, reject) => {

        thePet.style.transition = `top 1000ms, left 1000ms, transform 1000ms`
        thePet.style.top = `${rng(120)}px`
        thePet.style.left = `${rng(510)}px`
        thePet.style.transform = `scaleX(${catSidePosition()})`

        setTimeout(() => {
            resolve
        }, 1000)
    })
}*/
function petWander() {
    let playAnimation;
    // Get current position
    const style = getComputedStyle(thePet);
    const topOffset = parseFloat(style["top"]);
    const leftOffset = parseFloat(style["left"]);
    // Set destination
    let newTop = rng(120);
    let newLeft = rng(510);
    // Set animation
    let animationType = 0; // 0 = walk down; 64 walk up; 128 walk right; 192 walk left
    if ((topOffset - newTop) > (leftOffset - newLeft)) {
        if (topOffset < newTop) {
            animationType = 0;
        }
        else {
            animationType = frameSize;
        }
    }
    else {
        if (leftOffset < newLeft) {
            animationType = frameSize * 2;
        }
        else {
            animationType = frameSize * 3;
        }
    }
    playAnimation = setInterval(() => {
        thePet.style.backgroundPositionY = `${animationType}px`;
        thePet.style.backgroundPositionX = `${frameSize}px`;
        frameSize += frameSize;
    }, 200);
    return new Promise(resolve => {
        thePet.style.transition = `top 1000ms, left 1000ms, transform 1000ms`;
        thePet.style.top = `${newTop}px`;
        thePet.style.left = `${newLeft}px`;
        setTimeout(() => {
            clearInterval(playAnimation);
            resolve;
        }, 1000);
    });
}
//petWander()
wanderTimer = setInterval(() => {
    petWander();
    petGrowth();
}, 5000);
/*===Animations End===*/
function petStatus() {
    /* Sidebar */
    petName.innerHTML = "Name: " + yourPet.name;
    petLevel.innerHTML = "Level: " + yourPet.level;
    petExp.innerHTML = "Exp: " + yourPet.experience;
    money.innerHTML = "💰 " + yourGold;
    /* Health Bars */
    petHpIndicator.style.width = `${yourPet.hp}%`;
    petHungerIndicator.style.width = `${yourPet.hunger}%`;
    petHappyIndicator.style.width = `${yourPet.happiness}%`;
}
/*====Minigame====*/
uiBtnPlay.onclick = () => {
    miniWindow.classList.toggle("hide");
    miniDuratation = 30;
    gamePoints = 0;
    popMouse();
    showMouse();
    miniGameTime();
};
function showMouse() {
    miniGame.innerHTML = "";
    miniPoints.innerHTML = "Points: " + gamePoints;
    holesArray.forEach(hole => {
        const el = document.createElement("div");
        el.classList.add("cell");
        el.classList.add("d-flex");
        el.setAttribute("id", String(hole));
        miniGame.append(el);
    });
    const gameHoles = document.querySelectorAll(".cell");
    gameHoles.forEach((cell, index) => {
        if (mouse === Number(cell.id)) {
            const el = document.createElement("div");
            el.classList.add("mouse");
            cell.append(el);
            const mouseTarget = document.querySelector(".mouse");
            mouseTarget.onclick = () => hitMouse();
        }
    });
}
function hitMouse() {
    gamePoints += 10;
    showMouse();
}
function popMouse() {
    mouse = Math.ceil(Math.random() * 9);
}
function miniGameTime() {
    mouseMove = setInterval(() => {
        popMouse();
        showMouse();
    }, 700);
    minigameTimer = setInterval(() => {
        miniDuratation--;
        miniTimer.innerHTML = "Time: " + miniDuratation + "s";
    }, 1000);
    setTimeout(() => {
        // @ts-ignore
        clearInterval(mouseMove);
        clearInterval(minigameTimer);
        miniOutcome();
        miniWindow.classList.toggle("hide");
    }, 30000);
}
//Change
function miniOutcome() {
    if (gamePoints >= 100 && yourPet.happiness < 100) {
        yourPet.happiness += 20;
        yourPet.experience += 10;
        yourGold += gamePoints;
        petStatus();
    }
    else {
        yourPet.experience += 10;
        yourGold += gamePoints;
        petStatus();
    }
}

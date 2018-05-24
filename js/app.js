let speed = 1;
let countOfGems = 0;
let allItems = [];
let whenGoodsAppearArray = [0, 0, 0];

// variables for star icons
const hearts = document.querySelector(".hearts");
const counter = document.querySelector('.counter');

//variables for popup modal
let modal = document.getElementById("alert-window");
let heading = document.getElementById('alert').childNodes[3];
let paragraph1 = document.querySelector('#alert-paragraph-1');
let closeicon = document.querySelector(".close");
let keyPressPlay;

let gemsId = document.getElementById("gems");
let levelId = document.getElementById("level");

const playerImages = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png',
];

const goodItems = [
    'images/seahorse2-gem.png',
    'images/star1-gem.png',
    'images/goldfish-gem.png',
    'images/Selector.png'
];

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.dt = Math.floor(Math.random() * 2 + 1) * speed;
    this.collision = false;
    this.sprite = 'images/shark-enemy-resize.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function() {
    this.isCollisionPlayerEnemy();
    this.isCollisionEnemyEnemy();
    this.x += speed*this.dt;
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x >= 505){
        this.x = -50;
        //this.sprite = enemyImages[Math.floor(Math.random() * 2)]
        this.dt = Math.floor(Math.random() * 2 + 1) * speed;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//This method checks is enemy touch player and remove heart from lives panel
Enemy.prototype.isCollisionPlayerEnemy = function() {
    if (this.x >= player.x - 70 && this.x <= player.x + 50 && this.y === player.y) {

        player.x = player.initialX;
        player.y = player.initialY;

        player.lives--;
        if (hearts.lastElementChild) {
            hearts.removeChild(hearts.lastElementChild)
        }

        if(player.lives==0){
            heading.innerHTML = 'End of Game';
            paragraph1.innerHTML = 'You lose! You lost all your lives';
            // add class to display popup
            modal.classList.add("show");
            //close icon
            closeButton();
        }

        this.collision = true;
    }

    this.collision = false;
}

//This method prevent to collision enemies
Enemy.prototype.isCollisionEnemyEnemy = function() {
    allEnemies.forEach(enemy => {
        if ((this.x > enemy.x - 200 && this.x <= enemy.x + 10 && this.y === enemy.y) && this.x < enemy.x - 90) {
            enemy.dt = this.dt
        }
    });
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y){
    this.x = x;
    this.y = y;
    this.initialX = this.x; //storing the start position if the Player dies and restart
    this.initialY = this.y;
    this.sprite = 'images/char-boy.png';
    this.lives = 3;
    this.points = 0;
};


Player.prototype.update = function() {
    this.getGoodItem();
    this.reachWatherOnBoard();
    const gems = document.querySelector('.gems ul');
    if (countOfGems >= 4) {
        speed += 0.4;
        countOfGems = 0;

        //This loop sets new moment when goods appears
        for (i = 0; i < 3; i++) {
            whenGoodsAppearArray[i] = player.points + (100 * i) + Math.round(Math.random() * 10 + 1) * 10;
            setTimeout(()=>{
                gems.removeChild(gems.lastElementChild)
            }, 1000);

        }

    }
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.adPoints = function() {
    if (this.y > -25 && this.y < 240) {
        this.points += 10;
        counter.innerHTML = 'SCORE: ' + player.points;
    }
}

//This method checks when player collect gems
Player.prototype.getGoodItem = function () {
    allItems.forEach(item => {
        const gems = document.querySelector('.gems ul');
        const gem = document.createElement('li');
        if (this.x + 25 === item.x && this.y + 55 === item.y) {
            let look = item.look;
            item.x = 1000;
            this.points += item.points;
            counter.innerHTML = 'SCORE: ' + player.points;
            gem.innerHTML = `<img src="${look.substr(0, look.length - 4)}.png" alt="gem">`;
            console.log(gem);
            gems.appendChild(gem);
            countOfGems++;
            console.log(gems);
        }
    })

}

Player.prototype.appearItem = function () {

    if (this.points > whenGoodsAppearArray[0]) {
        item1.posX();
        item1.posY();
        allItems.push(item1);
        whenGoodsAppearArray[0] = 1000000;

    } else if (this.points > whenGoodsAppearArray[1]) {
        item2.posX();
        item2.posY();
        allItems.push(item2);
        whenGoodsAppearArray[1] = 1000000;
    }
    else if (this.points > whenGoodsAppearArray[2]) {
        item3.posX();
        item3.posY();
        allItems.push(item3);
        whenGoodsAppearArray[2] = 1000000;
    }
}

Player.prototype.reachWatherOnBoard = function () {
    if (this.y < 0) {
        let that = this.Object;
        setTimeout(() => {
            this.x = 200;
            this.y = 400;
        }, 300)
    }

}

//this method clears arrays

Player.prototype.clear = function() {
    allItems = [];
    speed = 1;
    countOfGems = 0;
}

Player.prototype.handleInput = function(direction){
    switch (direction) {
        case 'left':
            if (this.x > 0) {
                this.x -= 100;
                this.adPoints();
                this.appearItem();
            }
            break;
        case 'right':
            if (this.x < 399) {
                this.x += 100;
                this.adPoints();
                this.appearItem();
            }
            break;
        case 'up':
            if (this.y > 0) {
                this.y -= 85;
                this.adPoints();
                this.appearItem();
            }
            break;
        case 'down':
            if (this.y < 399 && speed >1.8) {
                this.y += 85;
                this.adPoints();
                this.appearItem();
            }
            break;
    }
};
/*
 * Goodies on board
 */
var GoodItem = function(look = 0, x, y, points) {
        this.x = x;
        this.y = y;
        this.points = points;
        this.look = this.update(look, goodItems);
    }
GoodItem.prototype.update = function(look, array) {
        this.look = array[look]
        return this.look;
    }

GoodItem.prototype.render = function() {
        ctx.drawImage(Resources.get(this.look), this.x, this.y);
    }

    //This method sets when goods can appears on screen
GoodItem.prototype.whenGoodsAppear = function() {
        for (let i = 0; i < 3; i++) {
            whenGoodsAppearArray[i] += (100 * i) + Math.round(Math.random() * 10 + 1) * 10;
        }
    }

GoodItem.prototype.posX = function() {
        this.x = itemPosX[Math.floor(Math.random() * 5)]
        console.log('x:',this.x);
    }

GoodItem.prototype.posY = function() {
        this.y = itemPosY[Math.floor(Math.random() * 3)]
        console.log('y:',this.y);
    }

// Gems will appear at the top of the board in random order
// Gem location will not be repeated
// Collect 5 gems to win the game


// calculate how much time takes the game
function calculateTime() {
    const startTime= 3*60;
    const timeLeft = minute*60 + second;
    const finalTimeTotal = startTime-timeLeft;
    const finalTimeMinutes = Math.floor(finalTimeTotal/60);
    const finalTimeSeconds = finalTimeTotal - finalTimeMinutes * 60;
    clearInterval(interval);
    const finalTime = "in "+finalTimeMinutes+" mins "+finalTimeSeconds+" secs";

    return finalTime;
}


//-----Alert Window
// close button in a popup
function closeButton(){
    closeicon.addEventListener("click", function(e){
        document.removeEventListener("keypress", keyPressPlay);
        modal.classList.remove("show");
        location.reload();
    });
}

// 'play again' button in a popup
function playAgain(){
    document.removeEventListener("keypress",keyPressPlay);
    modal.classList.remove("show");
    location.reload();
}
//------

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const enemy1 = new Enemy(-100, 60);
const enemy2 = new Enemy(-100, 145);
const enemy3 = new Enemy(-100, 230);
const enemy4 = new Enemy(-290, 60);
const enemy5 = new Enemy(-290, 145);
const enemy6 = new Enemy(-280, 230);
const allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6];

var player = new Player(200,400);
const itemPosY = [115, 200, 285];
const itemPosX = [25, 125, 225, 325, 425];

const item1 = new GoodItem(0, 0, 0, 50)
//console.log('item1: ',item1);
const item2 = new GoodItem(1, 0, 0, 80)
const item3 = new GoodItem(2, 0, 0, 100)
const allGoogies = [item1, item2, item3];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

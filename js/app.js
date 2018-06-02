/*
 * VARIABLES
 */
// variables for score panel icons
const hearts = document.querySelector(".hearts");
const counter = document.querySelector('.counter .box-details p');

//variabled for timer
let second, minute;
let timer = document.querySelector("#timer");
let timerMins = document.querySelector("#timer-mins");
let timerSecs = document.querySelector("#timer-secs");
let interval;

//variables for popup window
let moves = document.querySelector(".moves");
let movesNumber = document.querySelector("#moves-number");
let modal = document.getElementById("alert-window");
let gif = document.getElementById("game-over-gif");
let gameOver = document.getElementById("game-over-details");
let heading = gameOver.childNodes[1];
let paragraph1 = document.querySelector('#alert-paragraph-1');
let closeicon = document.querySelector(".close");
let keyPressPlay;

let levelId = document.getElementById("level");

//enemy speed
let speed = 1;

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

let gemsNumber = 0;
let showGoodItemArray = [0, 0, 0];
let gemsId = document.getElementById("gems");
let allGoodItems = [];
let seahorseGem = document.querySelector('#seahorse-gem img');
let starGem = document.querySelector('#star-gem img');
let fishGem = document.querySelector('#fish-gem img');

/*
 * ENEMIES
 */
// Enemies our player must avoid
class Enemy {
    constructor (x, y) {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.x = x;
        this.y = y;
        this.dt = Math.floor(Math.random() * 2 + 1) * speed;
        this.collision = false;
        this.sprite = 'images/shark-enemy-resize.png';
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update () {
        this.isCollisionPlayerEnemy();
        this.isCollisionEnemyEnemy();
        this.x += speed*this.dt;
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        if (this.x >= 505){
            this.x = -50;
            this.dt = Math.floor(Math.random() * 2 + 1) * speed;
        }
    }

    // Draw the enemy on the screen, required method for game
    render () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    //This method checks is enemy touch player and remove heart from lives panel
    isCollisionPlayerEnemy () {
        if (this.x >= player.x - 70 && this.x <= player.x + 50 && this.y === player.y) {

            player.x = player.initialX;
            player.y = player.initialY;

            player.lives--;
            if (hearts.lastElementChild) {
                hearts.removeChild(hearts.lastElementChild)
            }

            if(player.lives===0){
                const img = document.createElement('img');
                img.src = "https://media.giphy.com/media/SIPIe590rx6iA/giphy.gif";
                gif.appendChild(img);
                setTimeout( () => {
                    gif.hidden = true;
                    gameOver.style.display = 'flex';
                    heading.innerHTML = 'End of Game';
                    paragraph1.innerHTML = 'You lost all your lives';
                    document.getElementById("finalMove").innerHTML = countMoves;
                    document.getElementById("totalTime").innerHTML = calculateTime();
                    document.getElementById("finalScore").innerHTML = player.points;
                    //showing move, rating
                    if(countMoves===1) {
                        document.getElementById("finalMove").innerHTML = countMoves+' move';
                    }else{
                        document.getElementById("finalMove").innerHTML = countMoves+' moves';
                    }
                }, 3900);
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
    isCollisionEnemyEnemy () {
        allEnemies.forEach(enemy => {
            if ((this.x > enemy.x - 200 && this.x <= enemy.x + 10 && this.y === enemy.y) && this.x < enemy.x - 90) {
                enemy.dt = this.dt
            }
        });
    }
}
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/*
 * PLAYER
 */
class Player {
    constructor (look=0, x, y){
        this.x = x;
        this.y = y;
        this.look = this.changeLook(look, playerImages);
        this.initialX = this.x; //storing the start position if the Player dies and restart
        this.initialY = this.y;
        this.lives = 3;
        this.points = 0;
        counter.innerHTML = 0;
    }

    //This method change Avatar
    changeLook (look, array) {
        this.look = array[look]
        return this.look;
    }

    update () {
        this.getGoodItem();
        this.reachWatherOnBoard();
        if (gemsNumber === 3) {
            speed += 0.4;
            gemsNumber = 0;
            showGoodItemArray = [0, 0, 0];
            item1.showGoodItem();
            setTimeout(()=>{
                seahorseGem.src = "images/seahorse2-black-gem.png";
                starGem.src = "images/star1-black-gem.png";
                fishGem.src = "images/goldfish-black-gem.png";
            }, 1800);
        }
    }

    render (){
        ctx.drawImage(Resources.get(this.look), this.x, this.y);
    }

    reachWatherOnBoard () {
        if (this.y < 0) {
            let that = this.Object;
            setTimeout(() => {
                this.x = 200;
                this.y = 400;
            }, 300)
        }
    }

    adPoints () {
        if (this.y > -25 && this.y < 240) {
            this.points += 10;
            counter.innerHTML = player.points;
        }
    }

    //Gem appear
    appearItem () {

        if (this.points > showGoodItemArray[0]) {
            item1.posX();
            item1.posY();
            allGoodItems.push(item1);//add gem1 to allItem array
            showGoodItemArray[0] = 1000000;
            console.log(showGoodItemArray);

        } else if (this.points > showGoodItemArray[1]) {
            item2.posX();
            item2.posY();
            allGoodItems.push(item2);//add gem2 to allItem array
            showGoodItemArray[1] = 1000000;
            console.log(item2);
        }
        else if (this.points > showGoodItemArray[2]) {
            item3.posX();
            item3.posY();
            allGoodItems.push(item3);//add gem3 to allItem array
            showGoodItemArray[2] = 1000000;
            console.log(item3);
        }
    }

    //This method checks when player collect gems
    getGoodItem () {
        allGoodItems.forEach(item => {
            if (this.x + 25 === item.x && this.y + 55 === item.y) {
                let gem = '';
                let look = item.look;
                this.points += item.points;
                counter.innerHTML = player.points;
                //changing black shadow of games on a score panel to the collected colorfull gem image
                if(look.indexOf('seahorse')>0){
                    gem = document.querySelector('#seahorse-gem img');
                    gem.src = look;
                }
                if(look.indexOf('star')>0){
                    gem = document.querySelector('#star-gem img');
                    gem.src = look;
                }
                if(look.indexOf('fish')>0){
                    gem = document.querySelector('#fish-gem img');
                    gem.src = look;
                }
                item.x=-1000;
                item.y=-1000;
                gemsNumber++;
            }
        })

    }

    //this method clears arrays
    clear () {
        allGoodItems = [];
        speed = 1;
        gemsNumber = 0;
    }

    handleInput (direction){
        if(!direction) return;
        countMoves++;
        switch (direction) {
            case 'left':
                if (this.x > 0) {
                    this.x -= 100;
                }
                break;
            case 'right':
                if (this.x < 399) {
                    this.x += 100;
                }
                break;
            case 'up':
                if (this.y > 0) {
                    this.y -= 85;
                }
                break;
            case 'down':
                if (this.y < 399) {
                    this.y += 85;
                }
                break;
        }
        this.adPoints();
        this.appearItem();
    }
}
/*
 * GOODIES
 */
class GoodItem {
    constructor(look = 0, x, y, points) {
        this.x = x;
        this.y = y;
        this.points = points;
        this.look = this.update(look, goodItems);
    }

    update (look, array) {
        this.look = array[look]
        return this.look;
    }

    render () {
        ctx.drawImage(Resources.get(this.look), this.x, this.y);
    }

    //Sets when goods can appears on screen
    showGoodItem () {
        for (let i = 0; i < 3; i++) {
            showGoodItemArray[i] = player.points + (100 * i) + Math.round(Math.random() * 10 + 1) * 10;
        }
    }

    //Set gem position
    posX () {
        this.x = itemPosX[Math.floor(Math.random() * 5)]
    }

    posY () {
        this.y = itemPosY[Math.floor(Math.random() * 3)]
    }
}

// Gems will appear at the top of the board in random order
// Gem location will not be repeated
// Collect 5 gems to win the game


/*
 * ALERT WINDOW
 */
// calculate how much time takes the game
calculateTime = () => {
    const finalTimeTotal = minute*60 + second;
    const finalTimeMinutes = Math.floor(finalTimeTotal/60);
    const finalTimeSeconds = finalTimeTotal - finalTimeMinutes * 60;
    clearInterval(this.interval);
    const finalTime = "in "+finalTimeMinutes+" mins "+finalTimeSeconds+" secs";
    return finalTime;
}
// close button in a popup
closeButton = () => {
    closeicon.addEventListener("click", function(e){
        document.removeEventListener("keypress", keyPressPlay);
        modal.classList.remove("show");
        location.reload();
    });
}

// 'play again' button in a popup
playAgain = () => {
    document.removeEventListener("keypress",keyPressPlay);
    modal.classList.remove("show");
    location.reload();
}


/*
 * OBJECTS INIT
 */

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const enemy1 = new Enemy(-140, 60);
const enemy2 = new Enemy(-120, 145);
const enemy3 = new Enemy(-140, 230);
const enemy4 = new Enemy(-310, 60);
const enemy5 = new Enemy(-330, 145);
const enemy6 = new Enemy(-280, 230);
const allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6];

let countMoves = 0;

var player = new Player(0, 200,400);
const itemPosY = [115, 200, 285];
const itemPosX = [25, 125, 225, 325, 425];

const item1 = new GoodItem(0, 0, 0, 50);
const item2 = new GoodItem(1, 0, 0, 80)
const item3 = new GoodItem(2, 0, 0, 100)

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

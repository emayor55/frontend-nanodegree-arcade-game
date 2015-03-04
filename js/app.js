
var NO_OF_BUGS = 5;

var X_STEP = 101; // no. of pixels a 'left' or 'right' arrow key will cause player to move horizontally;
                  // corresponds to width of each tile 
var Y_STEP = 85;  // no. of pixels an 'up' or 'down' arrow key will cause player to move vertically.
                  // corresponds to height of each tile 
var X_PMAX_RIGHT = 404 // maximum X-coordinate of player allowed (so does not exit screen).  
var X_START = 202; // X-coordinate of player image at start of game. 
var Y_START = 384; // Y-coordinate of player image at start of game

var X_EMAX_RIGHT = 505; // X-coordinate of enemy when it is no longer visible 
var X_OFFSCREEN = -202; // X-coordinate of enemy safely out of sight 

var X_OVERLAP = 60; // overlap of images in pixels along x-axis deemed as a collision
var Y_OVERLAP = 16; // overlap of images in pixels along y-axis deemed as a collision 

// Enemies our player must avoid
var Enemy = function(i) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // idea - the various attributes will be in arrays: speed, y_coord, x_coord. The constructor will have an argument which will determine
    
    this.x_start = -((i % NO_OF_BUGS)*101)-101;  // starting x-coordinate for enemies
	this.x = this.x_start ; 
    this.y= 60 + (i % 3)*85;  // there are only 3 y-positions allowed: 
    //this.speed= (((i + 1) % NO_OF_BUGS)+.8)*150-(i*50);
	
    this.speed_start = (( (i+1) % NO_OF_BUGS)+.8)*175
	this.speed = this.speed_start; 

	console.log("Bug # "+i+ " : position "+this.y+" : Speed  : "+this.speed); 
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png'

}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    this.x = this.x + (this.speed*dt)
    // return the enemy sprite once it exits right 
    if (this.x >= X_EMAX_RIGHT) { 
        this.x = this.x_start;  // return to original start 
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
////console.log("In enemy.render")
}

// Get position of Enemy; coordinates returned are used for collision check
Enemy.prototype.getPosition = function() {
    return [this.x, this.y];
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x=X_START;
    this.y=Y_START;
    this.x_step=0;  // 
    this.y_step=0;
    this.x_prior=0;
    this.y.rior=0;
     // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
}
Player.prototype.update = function() {
	// This function updates the position of the player
    this.x = this.x + this.x_step;
    this.y = this.y + this.y_step;
	
	//re-initialize step size after using them  
    this.x_step=0;
    this.y_step=0;
    // }
   // console.log(" x is "+this.x +" ; y is "+ this.y );
}
 

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	
	// extra logic to clear the area above the water tiles
    // when player sprite moves along top row
    if ((this.y_prior <= 0 && this.x_prior != this.x) || (this.y_prior <= 0 && this.y_prior != this.y)) {
        ctx.clearRect(this.x_prior,0,X_STEP,(X_STEP/2));
    }
    this.x_prior = this.x;
    this.y_prior = this.y;

};

// {Positions player at start position, after a collision
Player.prototype.sendHome = function() {
    this.x=X_START;
    this.y=Y_START;
}
;

// Get position of Player; coordinates returned are used for collision check
Player.prototype.getPosition = function() {
    return [this.x, this.y];
};

Player.prototype.handleInput = function(input) {
 	var xFactor = 0;
	var yFactor = 0
    this.x_step = 0;
    this.y_step = 0;

	switch (input) {
	case 'left':
        if (this.x != 0) xFactor = -1; //  Player must only move LEFT if Player is not at LEFTMOST column (this.x == 0)  
		break; 	
	case 'right':
        if (this.x != X_PMAX_RIGHT) xFactor = 1; // Player must only move RIGHT if Player is not at RIGHTMOST column (this.x == 404) 
		break;
	case 'up':
        if (this.y >= 0 ) yFactor = -1; //Player must only move UP if Player is not at TOP row (this.y < 0)
		break;
    case 'down':
        if (this.y != Y_START ) yFactor = 1; // Player must only move DOWN if Player is not at BOTTOM row (this.x == 384)
		break;
	default :
		break;
	} 
	this.x_step = xFactor*X_STEP;
	this.y_step = yFactor*Y_STEP;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = []; 
for (var i=0; i< NO_OF_BUGS; i++) {
    var enemy = new Enemy(i);
        allEnemies[i] = enemy; 
}

var player =  new Player(); 
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

function checkCollisions() {
        ;
        allEnemies.forEach(function(enemy) {
            var eposn = enemy.getPosition();  // enemy position
            var pposn = player.getPosition();  // player position
			// eposn[0] and pposn[0] are x-coordinates of enemy and player sprites.
			// eposn[1] and eposn[1] are y-coordinates of enemy and player sprites. 
            if ((eposn[1] - pposn[1]) == Y_OVERLAP )  {  // player visually on an "enemy lane"
                    if (((X_OVERLAP >= (pposn[0] - eposn[0])) && (eposn[0] <= pposn[0] )) 
						// enemy image visually overlaps player image from left
                                ||
                        ( X_OVERLAP >= (eposn[0] - pposn[0])) && (pposn[0] <= eposn[0])){ 
						// player image visually overlaps enemy image from left 
                player.sendHome();
            }
        }
     })
}

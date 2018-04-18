// Create our 'timAllen' state that will contain the game
var mainState = {
    preload: function() {
        // Load the bird sprite
        game.load.image('bird', 'assets/tim_allen.png');

        game.load.image('pipe', 'assets/house.png');

        game.load.audio('jump', 'assets/tim_allen_grunt.wav');

        game.load.audio('death', 'assets/i_am_mrs_nesbitt.wav');
    },

    create: function() {
        // Change the background color of the game to blue
        game.stage.backgroundColor = '#71c5cf';

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);



        // Create an empty group
        this.pipes = game.add.group();

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
            { font: "30px Arial", fill: "#ffffff" });

        // Move the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);

        this.jumpSound = game.add.audio('jump');

        this.deathSound = game.add.audio('death');
    },

    update: function() {
        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function

            if (this.bird.y < 0 || this.bird.y > 490)
                this.restartGame();

            game.physics.arcade.overlap(
                this.bird, this.pipes, this.hitPipe, null, this);

            if (this.bird.angle < 20)
                this.bird.angle += 1;

    },

    // Make the bird jump
    jump: function() {

        if (this.bird.alive === false)
            return;

        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        game.add.tween(this.bird).to({angle: -20}, 100).start();

        this.jumpSound.play();
    },



// Restart the game
    restartGame: function() {
        // Start the 'timAllen' state, which restarts the game
        if (this.score > hiScore) {
            hiScore = this.score;
            updateScoreText();
        }

        game.state.start('timAllen');
    },

    addOnePipe: function(x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);

        this.score += 1;
        this.labelScore.text = this.score;
    },

    hitPipe: function() {

        this.deathSound.play();

        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);


// var gameState = 0; // 0 is off, 1 is running (does not mean game is paused!)
var paused = true; //

// Add the 'mainState' and call it 'main'
game.state.add('timAllen', mainState);



/* Start the state to actually start the game */

var gameState = 0; // 0 before the game starts for the first time, 1 after that


// starts the game only if it is the first time running or it is paused
var timAllenFlappyBirdGame = function() {

    if (gameState === 0) { // when the game is running for the first time (state = 0)
        if (!cameraOn) {
            onStart();
        }
        game.state.start('timAllen');
        paused = false;
        gameState = 1;
        document.getElementById("pauseBtn").disabled = false;
    }

    else if (paused) { // when the game is paused, unpause it
        onStart();
        game.paused = false;
        paused = false;
        document.getElementById("pauseBtn").disabled = false;
    }

    // if all fails it does nothing (when the game is running)

};


// pauses game only if it is paused and disables pause button
var pauseGame = function() {
    if (!paused) {
        game.paused = true;
        paused = true;
        document.getElementById("pauseBtn").disabled = true;
    }

};

/*
// enables play button
var enablePlayBtn = function() {
    document.getElementById("timAllen").disabled = false;
};

// disables play button
var disablePlayBtn = function() {
    document.getElementById("timAllen").disabled = true;
};
*/



// keeps track of highest score in website session
var hiScore = 0;


var updateScoreText = function() {
    var baseText = "Highest Score: ";
    var element = document.getElementById("scoreText");
    element.innerHTML = baseText + hiScore;
};





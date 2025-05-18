import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

new Phaser.Game(config);

const initialBirdPos = {
  x: config.width / 10,
  y: config.height / 2,
};
const horizontalFlapVelocity = 200;
const pipeVelocity = 200;
const verticalFlapVelocity = 250;
const pipesToRender = 4;
let pipeHorizontalDist = 0;
let pipeDistanceRange = [150, 250];

let bird = null;
let pipes = null;

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  pipes = this.physics.add.group();
  this.add.image(0, 0, "sky").setOrigin(0);
  bird = this.physics.add
    .sprite(initialBirdPos.x, initialBirdPos.y, "bird")
    .setScale(1.5)
    .setOrigin(0);

  bird.body.gravity.y = 400;

  for (let index = 0; index < pipesToRender; index++) {
    const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, "pipe").setOrigin(0, 0);

    placePipes(upperPipe, lowerPipe);
  }
  pipes.setVelocityX(-pipeVelocity);

  this.input.keyboard.on("keydown-SPACE", flap);
}

function update(time, delta) {
  if (bird.y > config.height || bird.y < 0 - bird.height) {
    restartBirdPosition();
  }
}

function flap() {
  bird.body.velocity.y = -verticalFlapVelocity;
}

function restartBirdPosition() {
  bird.body.x = initialBirdPos.x;
  bird.body.y = initialBirdPos.y;
  bird.body.velocity.y = 0;
}

function placePipes(upperPipe, lowerPipe) {
  pipeHorizontalDist += 400;
  let pipeDistance = Phaser.Math.Between(...pipeDistanceRange);
  let pipeVerticalPos = Phaser.Math.Between(
    20,
    config.height - 20 - pipeDistance
  );

  upperPipe.x = pipeHorizontalDist;
  upperPipe.y = pipeVerticalPos;

  lowerPipe.x = upperPipe.x;
  lowerPipe.y = upperPipe.y + pipeDistance;
}

function getRightmostPipe() {}

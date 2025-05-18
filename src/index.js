import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
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
const VELOCITY = 200;
const flapVelocity = 250;
let pipeDistanceRange = [150, 250];
let pipeDistance = Phaser.Math.Between(...pipeDistanceRange);
let pipeVerticalPos = Phaser.Math.Between(
  20,
  config.height - 20 - pipeDistance
);

let bird = null;
let lowerPipe = null;
let upperPipe = null;

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  this.add.image(0, 0, "sky").setOrigin(0);
  bird = this.physics.add
    .sprite(initialBirdPos.x, initialBirdPos.y, "bird")
    .setScale(1.5)
    .setOrigin(0);

  bird.body.gravity.y = 400;
  bird.body.velocity.x = VELOCITY;

  this.input.keyboard.on("keydown-SPACE", flap);

  upperPipe = this.add.sprite(400, pipeVerticalPos, "pipe").setOrigin(0, 1);
  lowerPipe = this.add
    .sprite(400, upperPipe.y + pipeDistance, "pipe")
    .setOrigin(0, 0);
}

function update(time, delta) {
  if (bird.y > config.height || bird.y < 0 - bird.height) {
    restartBirdPosition();
  }
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

function restartBirdPosition() {
  bird.body.x = initialBirdPos.x;
  bird.body.y = initialBirdPos.y;
  bird.body.velocity.x = VELOCITY;
  bird.body.velocity.y = 0;
}

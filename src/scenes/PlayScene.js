import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;

    this.bird = null;
    this.pipes = null;
    this.pipesToRender = 4;
    this.pipeVelocity = 200;
    this.verticalFlapVelocity = 250;

    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [350, 400];
  }
  preload() {
    this.loadAssets();
  }
  create() {
    this.createBG();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.handleInput();
  }
  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  loadAssets() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }
  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }
  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setScale(1.5)
      .setOrigin(0);

    this.bird.body.gravity.y = 400;
    this.bird.body.setCollideWorldBounds(true);
  }
  createPipes() {
    this.pipes = this.physics.add.group();

    for (let index = 0; index < this.pipesToRender; index++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipes(upperPipe, lowerPipe);
    }
    this.pipes.setVelocityX(-this.pipeVelocity);
  }
  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }
  handleInput() {
    this.input.keyboard.on("keydown-SPACE", this.flap, this);
  }
  checkGameStatus() {
    if (
      this.bird.getBounds().top >= this.config.height ||
      this.bird.y <= 0 ||
      this.bird.getBounds().bottom >= this.config.height
    ) {
      this.gameOver();
    }
  }
  flap() {
    this.bird.body.velocity.y = -this.verticalFlapVelocity;
  }
  gameOver() {
    //  this.bird.body.x = this.config.startPosition.x;
    //  this.bird.body.y = this.config.startPosition.y;
    //  this.bird.body.velocity.y = 0;
    this.physics.pause();
    this.bird.setTint(0xff0000);
  }
  placePipes(upperPipe, lowerPipe) {
    let rightMostPipeX = this.getRightmostPipe();
    let pipeHorizontalDist = Phaser.Math.Between(
      ...this.pipeHorizontalDistanceRange
    );
    let pipeDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
    let pipeVerticalPos = Phaser.Math.Between(
      20,
      this.config.height - 20 - pipeDistance
    );

    upperPipe.x = pipeHorizontalDist + rightMostPipeX;
    upperPipe.y = pipeVerticalPos;

    lowerPipe.x = upperPipe.x;
    lowerPipe.y = upperPipe.y + pipeDistance;
  }
  getRightmostPipe() {
    let rightMostPipeX = 0;

    this.pipes.getChildren().forEach((pipe) => {
      rightMostPipeX = Math.max(pipe.x, rightMostPipeX);
    });

    return rightMostPipeX;
  }
  recyclePipes() {
    let tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipes(...tempPipes);
        }
      }
    });
  }
}

export default PlayScene;
